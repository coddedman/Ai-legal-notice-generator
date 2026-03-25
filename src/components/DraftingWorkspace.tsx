'use client';

import React, { useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  Button, 
  IconButton, 
  Tooltip, 
  Divider, 
  Container,
  Avatar,
  Tab,
  Tabs,
  Drawer,
  IconButton as MuiIconButton,
  Fab,
  CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  ChevronRight,
  UserPlus,
  Send,
  Undo,
  Redo,
  Type,
  Baseline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  RemoveFormatting,
  Sparkles,
  RefreshCw,
  Save,
  ChevronLeft,
  Mail,
  Share2,
  FileText,
  Download,
  Phone,
  MessageSquare
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import dynamic from 'next/dynamic';
import { NoticeFormData } from './NoticeForm';

// Dynamic import for Quill
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
});

const QUILL_MODULES = {
  toolbar: {
    container: '#toolbar',
    handlers: {
      'modify': function() { /* Handled via parent button */ },
      'convert': function() { /* Handled via parent button */ }
    }
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true
  }
};

const QUILL_FORMATS = [
  'font', 'size', 'header',
  'bold', 'italic', 'underline', 'strike', 'color', 'background',
  'list', 'indent', 'align',
  'blockquote', 'code-block', 'script'
];



interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface WorkspaceProps {
  initialContent: string;
  onSave: (content: string) => void;
  onModify: (refinement: string) => void;
  loading: boolean;
  formData: NoticeFormData;
  updateFormData: (data: Partial<NoticeFormData>) => void;
}

export default function DraftingWorkspace({ 
  initialContent, 
  onSave, 
  onModify, 
  loading, 
  formData, 
  updateFormData 
}: WorkspaceProps) {
  const theme = useTheme();
  const [content, setContent] = useState(initialContent);
  const [refinementInput, setRefinementInput] = useState('');

  // Sync content if it changes from parent (e.g. after AI generation)
  React.useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);
  const [rightOpen, setRightOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { role: 'ai', text: 'Hi! I have generated your draft. How would you like me to refine it?' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleRefine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinementInput.trim() || loading) return;
    
    const userMsg = refinementInput.trim();
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setRefinementInput('');
    
    try {
      // 1. First, chat with the user
      const chatRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg, 
          chatHistory, 
          currentDraft: content,
          targetDoc: (formData as any).targetDoc || 'legalNotice'
        }),
      });

      if (!chatRes.ok) throw new Error('AI Chat failed');
      const chatData = await chatRes.json();
      
      // 2. Add AI reply to history
      setChatHistory(prev => [...prev, { role: 'ai', text: chatData.reply }]);

      // 3. If AI signals an update is needed, trigger modification
      if (chatData.shouldUpdateDraft) {
         setChatHistory(prev => [...prev, { role: 'ai', text: '_Applying changes to the document..._' }]);
         await onModify(userMsg);
         setChatHistory(prev => [...prev, { role: 'ai', text: 'Update complete. Please review the changes.' }]);
      }
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error. Please try again.' }]);
    }
  };

  const handleExportPDF = async () => {
    const editor = document.querySelector('.ql-editor') as HTMLElement;
    if (!editor) return;
    
    const canvas = await html2canvas(editor, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: editor.scrollWidth,
      windowHeight: editor.scrollHeight
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${(formData as any).targetDoc || 'Legal_Notice'}_${new Date().getTime()}.pdf`);
  };

  const handleExportWhatsApp = () => {
    const text = document.querySelector('.ql-editor')?.textContent || '';
    const url = `https://wa.me/?text=${encodeURIComponent(text.substring(0, 3000))}`;
    window.open(url, '_blank');
  };

  const handleExportEmail = () => {
    const text = document.querySelector('.ql-editor')?.textContent || '';
    const subject = encodeURIComponent((formData as any).targetDoc?.toUpperCase() || 'LEGAL NOTICE');
    const body = encodeURIComponent(text);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 80px)', bgcolor: 'rgba(248,250,252,1)', overflow: 'hidden', m: -4 }}>
      {/* ── CENTER: The Editor ── */}
      <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          p: 3, 
          overflowY: 'auto',
          alignItems: 'center'
      }}>
        <Paper elevation={0} sx={{ 
            width: '100%', 
            maxWidth: 800, 
            minHeight: '100%', 
            p: 0, 
            borderRadius: 3, 
            border: '1px solid', 
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'white',
            boxShadow: '0 4px 25px rgba(0,0,0,0.03)'
        }}>
            {/* Custom Styled Toolbar per Screenshot */}
            <Box id="toolbar" sx={{ 
                p: 1.5, 
                borderBottom: '1px solid', 
                borderColor: '#e2e8f0', 
                display: 'flex', 
                gap: 1, 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                bgcolor: '#f8fafc',
                '& .ql-formats': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mr: '8px !important',
                    borderRight: '1.5px solid #e2e8f0',
                    pr: 1
                },
                '& .ql-formats:last-child': { borderRight: 'none' },
                '& button, & .ql-picker': {
                    border: '1px solid #e2e8f0 !important',
                    borderRadius: '8px !important',
                    bgcolor: 'white !important',
                    height: '34px !important',
                    width: '34px !important',
                    display: 'flex !important',
                    alignItems: 'center !important',
                    justifyContent: 'center !important',
                    transition: 'all 0.2s',
                    '&:hover': {
                        borderColor: '#94a3b8 !important',
                        bgcolor: '#f1f5f9 !important'
                    }
                },
                '& .ql-picker': {
                    width: 'auto !important',
                    px: '8px !important'
                },
                '& .ql-stroke': { stroke: '#475569 !important' },
                '& .ql-fill': { fill: '#475569 !important' },
                '& .ql-active': {
                    bgcolor: '#4f46e520 !important',
                    borderColor: '#4f46e5 !important',
                    '& .ql-stroke': { stroke: '#4f46e5 !important' }
                }
            }}>
                <span className="ql-formats">
                    <select className="ql-font" defaultValue="serif">
                        <option value="serif">Select font</option>
                        <option value="sans-serif">Sans Serif</option>
                        <option value="monospace">Monospace</option>
                    </select>
                    <select className="ql-size" defaultValue="medium">
                        <option value="small">Small</option>
                        <option value="medium">Size</option>
                        <option value="large">Large</option>
                        <option value="huge">Extra Large</option>
                    </select>
                </span>

                <span className="ql-formats">
                    <button className="ql-bold" />
                    <button className="ql-italic" />
                    <button className="ql-underline" />
                    <button className="ql-strike" />
                    <button className="ql-clean">
                        <RemoveFormatting size={16} />
                    </button>
                </span>

                <span className="ql-formats">
                    <button className="ql-header" value="1">H<sub>1</sub></button>
                    <button className="ql-header" value="2">H<sub>2</sub></button>
                    <button className="ql-header" value="3">H<sub>3</sub></button>
                    <button className="ql-header" value="4">H<sub>4</sub></button>
                </span>

                <span className="ql-formats">
                    <button className="ql-blockquote" />
                    <button className="ql-code-block" />
                    <button className="ql-list" value="ordered" />
                    <button className="ql-list" value="bullet" />
                    <button className="ql-script" value="sub" />
                    <button className="ql-script" value="super" />
                </span>

                <span className="ql-formats">
                    <button className="ql-align" value="" />
                    <button className="ql-align" value="center" />
                    <button className="ql-align" value="right" />
                    <button className="ql-align" value="justify" />
                </span>

                <span className="ql-formats">
                    <button className="ql-undo">
                        <Undo size={16} />
                    </button>
                    <button className="ql-redo">
                        <Redo size={16} />
                    </button>
                </span>
            </Box>

            {/* Editor Content Area */}
            <Box sx={{ 
                flexGrow: 1, 
                p: {xs: 2, md: 5},
                '& .quill': { border: 'none' },
                '& .ql-container': { fontFamily: 'serif', fontSize: '1.1rem', border: 'none' },
                '& .ql-editor': { padding: 0, lineHeight: 1.8, minHeight: '600px' }
            }}>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={QUILL_MODULES}
                  formats={QUILL_FORMATS}
                  placeholder="Your legal draft will appear here..."
                />
            </Box>

            {/* Sticky Bottom Action Bar */}
            <Paper 
                elevation={4}
                sx={{ 
                    position: 'sticky', 
                    bottom: 24, 
                    left: 0, 
                    right: 0, 
                    mx: 'auto',
                    width: 'calc(100% - 48px)',
                    bgcolor: 'white', 
                    borderRadius: 4, 
                    display: 'flex', 
                    p: { xs: 1.5, sm: 2 },
                    border: '1px solid',
                    borderColor: 'divider',
                    alignItems: 'center',
                    gap: { xs: 1, sm: 2 },
                    flexWrap: 'wrap',
                    zIndex: 40,
                    // Add a shadow blur that fades into the document background
                    boxShadow: '0 12px 32px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)'
                }}
            >
                <Button 
                    variant="outlined" 
                    startIcon={<Sparkles size={18} />} 
                    onClick={() => onModify('')}
                    sx={{ 
                        borderRadius: 3, 
                        px: 3, 
                        py: 1.2, 
                        textTransform: 'none', 
                        fontWeight: 700,
                        color: '#334155',
                        borderColor: '#e2e8f0',
                        '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' }
                    }}
                >
                    Modify Draft
                </Button>
                <Button 
                    variant="outlined" 
                    startIcon={<RefreshCw size={18} />} 
                    sx={{ 
                        borderRadius: 3, 
                        px: 3, 
                        py: 1.2, 
                        textTransform: 'none', 
                        fontWeight: 700,
                        color: '#334155',
                        borderColor: '#e2e8f0',
                        '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' }
                    }}
                >
                    Convert to BNS/BNSS
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Send via WhatsApp">
                        <IconButton 
                            onClick={handleExportWhatsApp}
                            sx={{ border: '1px solid #e2e8f0', color: '#25D366', '&:hover': { bgcolor: '#25D36610' } }}
                        >
                            <Phone size={20} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Send via Email">
                        <IconButton 
                            onClick={handleExportEmail}
                            sx={{ border: '1px solid #e2e8f0', color: '#4f46e5', '&:hover': { bgcolor: '#4f46e510' } }}
                        >
                            <Mail size={20} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Download PDF">
                        <IconButton 
                            onClick={handleExportPDF}
                            sx={{ border: '1px solid #e2e8f0', color: '#ef4444', '&:hover': { bgcolor: '#ef444410' } }}
                        >
                            <FileText size={20} />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                <Button 
                    variant="contained" 
                    startIcon={<Save size={20} />} 
                    onClick={() => onSave(content)}
                    sx={{ 
                        borderRadius: 3, 
                        px: 4, 
                        py: 1.2, 
                        textTransform: 'none', 
                        fontWeight: 700,
                        bgcolor: '#4f46e5',
                        boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
                        '&:hover': { bgcolor: '#4338ca', boxShadow: 'none' }
                    }}
                >
                    Save
                </Button>
            </Paper>
        </Paper>
      </Box>

      {/* ── RIGHT SIDEBAR: AI Assistance ── */}
      <Box sx={{ 
        width: rightOpen ? 350 : 0, 
        transition: 'width 0.3s ease', 
        bgcolor: 'white', 
        borderLeft: '1px solid', 
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
            <IconButton size="small" onClick={() => setRightOpen(false)}><ChevronRight size={18} /></IconButton>
            <Typography variant="subtitle2" fontWeight={800} color="text.secondary">LEGAL DESK AI</Typography>
        </Box>

        <Box sx={{ p: 2, flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {chatHistory.map((msg, idx) => (
                <Box key={idx} sx={{ 
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    bgcolor: msg.role === 'user' ? '#4f46e5' : 'white',
                    color: msg.role === 'user' ? 'white' : 'text.primary',
                    p: 1.5,
                    borderRadius: 3,
                    borderBottomRightRadius: msg.role === 'user' ? 4 : 12,
                    borderBottomLeftRadius: msg.role === 'ai' ? 4 : 12,
                    maxWidth: '85%',
                    border: msg.role === 'ai' ? '1px solid' : 'none',
                    borderColor: 'divider',
                    boxShadow: msg.role === 'ai' ? '0 2px 10px rgba(0,0,0,0.02)' : '0 4px 12px rgba(79,70,229,0.2)'
                }}>
                    {msg.role === 'ai' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Sparkles size={14} color="#4f46e5" />
                            <Typography variant="caption" fontWeight={700} color="#4f46e5">Legal Desk AI</Typography>
                        </Box>
                    )}
                    <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                        {msg.text}
                    </Typography>
                </Box>
            ))}
            {loading && (
                <Box sx={{ alignSelf: 'flex-start', bgcolor: 'white', p: 1.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', display: 'flex', gap: 1 }}>
                    <CircularProgress size={16} thickness={4} />
                    <Typography variant="caption" color="text.secondary">Updating your document...</Typography>
                </Box>
            )}
            <div ref={chatEndRef} />
        </Box>

        {/* AI Chat Box at bottom of Right Sidebar */}
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'rgba(252,252,252,1)' }}>
            <form onSubmit={handleRefine}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Ask AI or refine your draft..."
                  value={refinementInput}
                  onChange={(e) => setRefinementInput(e.target.value)}
                  disabled={loading}
                  InputProps={{
                    sx: { borderRadius: 4, bgcolor: 'white' },
                    endAdornment: (
                        <IconButton size="small" type="submit" disabled={loading || !refinementInput.trim()}>
                            {loading ? <CircularProgress size={18} /> : <Send size={18} />}
                        </IconButton>
                    )
                  }}
                />
            </form>
        </Box>
      </Box>

      {/* Button to reopen right sidebar */}
      {!rightOpen && (
        <MuiIconButton 
            onClick={() => setRightOpen(true)} 
            sx={{ position: 'fixed', right: 4, top: '50%', zIndex: 10, bgcolor: 'white', border: '1px solid', borderColor: 'divider' }}
        >
            <ChevronLeft size={18} />
        </MuiIconButton>
      )}
    </Box>
  );
}
