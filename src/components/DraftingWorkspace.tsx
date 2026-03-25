'use client';

import React, { useState, useRef, useContext } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
  Select,
  Avatar,
  TextField,
  InputAdornment,
  MenuItem,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from '@/theme/ThemeRegistry';
import {
  Pencil,
  Copy,
  RefreshCw,
  MessageCircle,
  Download,
  Sun,
  Moon,
  Send,
  Sparkles,
  Scale,
  Mail,
  MessageSquare,
  FileText,
  ClipboardList,
  Check,
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import dynamic from 'next/dynamic';
import { NoticeFormData } from './NoticeForm';
import { useSession, signIn, signOut } from 'next-auth/react';

// Dynamic import for Quill — only shown when editing
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const QUILL_MODULES = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ header: [1, 2, 3, false] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['clean'],
  ],
  history: { delay: 500, maxStack: 100, userOnly: true },
};

const QUILL_FORMATS = [
  'bold', 'italic', 'underline', 'strike',
  'header', 'list', 'align', 'indent',
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
  onEditDetails?: () => void;
}

const DOC_TABS = [
  { key: 'legalNotice', label: 'Legal Notice', icon: Scale },
  { key: 'email',       label: 'Email',         icon: Mail },
  { key: 'whatsapp',    label: 'WhatsApp',      icon: MessageSquare },
  { key: 'complaint',   label: 'Complaint Draft', icon: ClipboardList },
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'mr', label: 'Marathi' },
  { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' },
  { code: 'gu', label: 'Gujarati' },
  { code: 'bn', label: 'Bengali' },
  { code: 'kn', label: 'Kannada' },
  { code: 'ml', label: 'Malayalam' },
  { code: 'pa', label: 'Punjabi' },
  { code: 'or', label: 'Odia' },
  { code: 'as', label: 'Assamese' },
  { code: 'ur', label: 'Urdu' },
  { code: 'sa', label: 'Sanskrit' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'ar', label: 'Arabic' },
];

export default function DraftingWorkspace({
  initialContent,
  onSave,
  onModify,
  loading,
  formData,
  updateFormData,
  onEditDetails,
}: WorkspaceProps) {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { data: session } = useSession();

  const [content, setContent] = useState(initialContent);
  const [activeTab, setActiveTab] = useState('legalNotice');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');
  const [refinementInput, setRefinementInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { role: 'ai', text: 'Hi! I have generated your draft. How would you like me to refine it?' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleCopy = () => {
    const text = document.querySelector('.ql-editor')?.textContent
      || content.replace(/<[^>]+>/g, '');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleExportPDF = async () => {
    const editor = document.querySelector('.doc-content-area') as HTMLElement;
    if (!editor) return;
    const canvas = await html2canvas(editor, { scale: 2, useCORS: true, logging: false });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Legal_Notice_${Date.now()}.pdf`);
  };

  const handleExportDoc = () => {
    const htmlContent = `<!DOCTYPE html><html><head><meta charset='utf-8'><title>Legal Notice</title></head><body style="font-family:serif;margin:40px;">${content}</body></html>`;
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Legal_Notice_${Date.now()}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleWhatsApp = () => {
    const text = document.querySelector('.doc-content-area')?.textContent || '';
    window.open(`https://wa.me/?text=${encodeURIComponent(text.substring(0, 3000))}`, '_blank');
  };

  const handleRefine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinementInput.trim() || loading) return;
    const userMsg = refinementInput.trim();
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setRefinementInput('');
    try {
      const chatRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, chatHistory, currentDraft: content }),
      });
      if (!chatRes.ok) throw new Error('AI Chat failed');
      const chatData = await chatRes.json();
      setChatHistory(prev => [...prev, { role: 'ai', text: chatData.reply }]);
      if (chatData.shouldUpdateDraft) {
        setChatHistory(prev => [...prev, { role: 'ai', text: '_Applying changes..._' }]);
        await onModify(userMsg);
        setChatHistory(prev => [...prev, { role: 'ai', text: 'Done! Changes applied to the document.' }]);
      }
    } catch {
      setChatHistory(prev => [...prev, { role: 'ai', text: 'Sorry, something went wrong. Please try again.' }]);
    }
  };

  const isDark = theme.palette.mode === 'dark';
  const bgPage = isDark ? '#0f1117' : '#eef0f8';
  const bgCard = isDark ? '#1a1d2e' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: bgPage,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Outfit', sans-serif",
    }}>

      {/* ── Top Nav Bar ── */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        px: { xs: 2, md: 4 },
        pt: 2,
        pb: 1,
        gap: 1.5,
        maxWidth: 1400,
        width: '100%',
        mx: 'auto',
      }}>
        <Tooltip title={session?.user?.name || 'Account'}>
          <Avatar
            src={session?.user?.image || ''}
            sx={{
              width: 36, height: 36,
              bgcolor: '#4f46e5',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: '2px solid white',
              boxShadow: '0 2px 8px rgba(79,70,229,0.25)',
            }}
          >
            {session?.user?.name?.charAt(0) || 'R'}
          </Avatar>
        </Tooltip>

        <IconButton
          onClick={colorMode.toggleColorMode}
          sx={{
            bgcolor: isDark ? '#2d3147' : 'white',
            border: `1px solid ${borderColor}`,
            width: 36, height: 36,
            borderRadius: '10px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            '&:hover': { bgcolor: isDark ? '#363a5a' : '#f1f5f9' },
          }}
        >
          {isDark ? <Sun size={16} color="#f8fafc" /> : <Moon size={16} color="#475569" />}
        </IconButton>
      </Box>

      {/* ── Shared max-width container for everything below ── */}
      <Box sx={{
        maxWidth: 1400,
        width: '100%',
        mx: 'auto',
        px: { xs: 2, md: 4 },
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        pb: 5,
      }}>

        {/* ── Input Details Review Card ── */}
        <Box sx={{
          bgcolor: bgCard,
          border: `1px solid ${borderColor}`,
          borderRadius: '10px',
          px: 3,
          py: 1.5,
          mb: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          <Typography variant="body2" fontWeight={700} color={isDark ? '#f1f5f9' : '#1e293b'}>
            Input Details (Review)
          </Typography>
          <Button
            variant="contained"
            onClick={onEditDetails}
            sx={{
              borderRadius: '8px',
              px: 2.5,
              py: 0.7,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.8rem',
              bgcolor: '#1e1b4b',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#312e81', boxShadow: 'none' },
            }}
          >
            Edit Details
          </Button>
        </Box>


        {/* ── Two-column: Document card + AI panel ── */}
        <Box sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'flex-start',
          flexGrow: 1,
        }}>

          {/* ── LEFT: Document Card ── */}
          <Box sx={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{
              bgcolor: bgCard,
              border: `1px solid ${borderColor}`,
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
            }}>
              {/* Card Header */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2.5,
                py: 1.5,
                borderBottom: `1px solid ${borderColor}`,
                flexWrap: 'wrap',
                gap: 1,
              }}>
                {/* Left: Title + Badge + Language */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography variant="body1" fontWeight={800} color={isDark ? '#f1f5f9' : '#1e293b'}>
                    Formal Legal Notice
                  </Typography>
                  <Chip
                    label="Ready"
                    size="small"
                    sx={{
                      bgcolor: '#059669',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.65rem',
                      height: 20,
                      borderRadius: '6px',
                      '.MuiChip-label': { px: 1 },
                    }}
                  />

                  {/* Divider */}
                  <Box sx={{ width: '1px', height: 20, bgcolor: borderColor, mx: 0.5 }} />

                  {/* Language Selector */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <Box sx={{ fontSize: '0.9rem', lineHeight: 1 }}>🌐</Box>
                    <Select
                      value={selectedLang}
                      size="small"
                      onChange={(e) => setSelectedLang(e.target.value)}
                      sx={{
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: isDark ? '#cbd5e1' : '#475569',
                        '.MuiSelect-select': { py: 0.5, pl: 1, pr: '28px !important' },
                        '& fieldset': { borderColor },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor },
                        minWidth: 100,
                      }}
                    >
                      {LANGUAGES.map((l) => (
                        <MenuItem key={l.code} value={l.code} sx={{ fontSize: '0.82rem' }}>
                          {l.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </Box>

                {/* Right: Action Buttons */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Tooltip title="Edit document">
                    <IconButton
                      size="small"
                      onClick={() => setIsEditing(!isEditing)}
                      sx={{
                        width: 32, height: 32, borderRadius: '8px',
                        bgcolor: isEditing ? '#4f46e510' : (isDark ? '#2d3147' : '#f1f5f9'),
                        border: `1px solid ${isEditing ? '#4f46e5' : borderColor}`,
                        color: isEditing ? '#4f46e5' : '#64748b',
                        '&:hover': { bgcolor: '#4f46e515' },
                      }}
                    >
                      <Pencil size={14} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title={copied ? 'Copied!' : 'Copy text'}>
                    <IconButton
                      size="small"
                      onClick={handleCopy}
                      sx={{
                        width: 32, height: 32, borderRadius: '8px',
                        bgcolor: isDark ? '#2d3147' : '#f1f5f9',
                        border: `1px solid ${borderColor}`,
                        color: copied ? '#059669' : '#64748b',
                        '&:hover': { bgcolor: '#f1f5f9' },
                      }}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Regenerate">
                    <IconButton
                      size="small"
                      onClick={() => onModify('')}
                      disabled={loading}
                      sx={{
                        width: 32, height: 32, borderRadius: '8px',
                        bgcolor: isDark ? '#2d3147' : '#f1f5f9',
                        border: `1px solid ${borderColor}`,
                        color: '#f59e0b',
                        '&:hover': { bgcolor: '#fef9c3' },
                      }}
                    >
                      {loading ? <CircularProgress size={14} /> : <RefreshCw size={14} />}
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Send via WhatsApp">
                    <IconButton
                      size="small"
                      onClick={handleWhatsApp}
                      sx={{
                        width: 32, height: 32, borderRadius: '8px',
                        bgcolor: isDark ? '#2d3147' : '#f1f5f9',
                        border: `1px solid ${borderColor}`,
                        color: '#25D366',
                        '&:hover': { bgcolor: '#f0fdf4' },
                      }}
                    >
                      <MessageCircle size={14} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download .doc">
                    <Box
                      onClick={handleExportDoc}
                      sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        px: 1.2, height: 32,
                        borderRadius: '8px',
                        border: `1px solid ${borderColor}`,
                        bgcolor: isDark ? '#2d3147' : '#f1f5f9',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#e0e7ff', borderColor: '#c7d2fe' },
                      }}
                    >
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#4f46e5' }}>.doc</Typography>
                    </Box>
                  </Tooltip>

                  <Tooltip title="Download PDF">
                    <Box
                      onClick={handleExportPDF}
                      sx={{
                        display: 'flex', alignItems: 'center', gap: 0.5,
                        px: 1.2, height: 32,
                        borderRadius: '8px',
                        border: `1px solid ${borderColor}`,
                        bgcolor: isDark ? '#2d3147' : '#f1f5f9',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#fef2f2', borderColor: '#fca5a5' },
                      }}
                    >
                      <Download size={13} color="#ef4444" />
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#ef4444' }}>PDF</Typography>
                    </Box>
                  </Tooltip>
                </Box>
              </Box>

              {/* Document Body */}
              {isEditing ? (
                <Box sx={{
                  '& .quill': { border: 'none' },
                  '& .ql-toolbar': {
                    borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                    borderBottom: `1px solid ${borderColor}`,
                    bgcolor: isDark ? '#1a1d2e' : '#f8fafc',
                  },
                  '& .ql-container': { border: 'none', fontFamily: 'Georgia, serif', fontSize: '1rem' },
                  '& .ql-editor': {
                    minHeight: 400, padding: '1.5rem 2rem',
                    lineHeight: 1.9, color: isDark ? '#e2e8f0' : '#1e293b',
                  },
                }}>
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={QUILL_MODULES}
                    formats={QUILL_FORMATS}
                  />
                  <Box sx={{ p: 2, borderTop: `1px solid ${borderColor}`, display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
                    <Button variant="outlined" onClick={() => setIsEditing(false)}
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}>
                      Cancel
                    </Button>
                    <Button variant="contained"
                      onClick={() => { onSave(content); setIsEditing(false); }}
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, boxShadow: 'none', bgcolor: '#1e1b4b', '&:hover': { bgcolor: '#312e81' } }}>
                      Save Changes
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box
                  className="doc-content-area"
                  sx={{
                    p: { xs: 2.5, md: '2rem 2.5rem' },
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontSize: '1rem',
                    lineHeight: 1.85,
                    color: isDark ? '#e2e8f0' : '#1e293b',
                    minHeight: 400,
                    '& p': { mb: 1.5 },
                    '& strong': { fontWeight: 700 },
                    maxHeight: '68vh',
                    overflowY: 'auto',
                  }}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              )}
            </Box>

            {/* Save button — centered below document */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={() => onSave(content)}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 5,
                  py: 1.2,
                  fontSize: '0.9rem',
                  bgcolor: '#1e1b4b',
                  boxShadow: '0 2px 12px rgba(30,27,75,0.22)',
                  '&:hover': { bgcolor: '#312e81', boxShadow: 'none' },
                }}
              >
                Save to History
              </Button>
            </Box>
          </Box>

          {/* ── RIGHT: AI Chat Panel ── */}
          <Box sx={{
            width: 380,
            flexShrink: 0,
            bgcolor: bgCard,
            border: `1px solid ${borderColor}`,
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            position: 'sticky',
            top: 12,
            maxHeight: 'calc(100vh - 160px)',
          }}>
            {/* AI Panel Header */}
            <Box sx={{
              px: 2, py: 1.5,
              borderBottom: `1px solid ${borderColor}`,
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
            }}>
              <Box sx={{
                width: 26, height: 26,
                borderRadius: '7px',
                bgcolor: '#ede9fe',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Sparkles size={13} color="#4f46e5" />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: '#4f46e5', lineHeight: 1.2 }}>
                  Legal Desk AI
                </Typography>
                <Typography sx={{ fontSize: '0.68rem', color: '#94a3b8', lineHeight: 1 }}>
                  Ask me to refine your draft
                </Typography>
              </Box>
            </Box>

            {/* Chat Messages */}
            <Box sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 1.5,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}>
              {chatHistory.map((msg, idx) => (
                <Box key={idx} sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}>
                  {msg.role === 'ai' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.4, ml: 0.3 }}>
                      <Box sx={{
                        width: 16, height: 16, borderRadius: '4px',
                        bgcolor: '#ede9fe',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Sparkles size={9} color="#4f46e5" />
                      </Box>
                      <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#4f46e5' }}>
                        Legal Desk AI
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{
                    bgcolor: msg.role === 'user' ? '#4f46e5' : (isDark ? '#2d3147' : '#f8fafc'),
                    color: msg.role === 'user' ? 'white' : (isDark ? '#e2e8f0' : '#1e293b'),
                    px: 1.5, py: 1,
                    borderRadius: '10px',
                    borderBottomRightRadius: msg.role === 'user' ? '3px' : '10px',
                    borderBottomLeftRadius: msg.role === 'ai' ? '3px' : '10px',
                    maxWidth: '90%',
                    border: msg.role === 'ai' ? `1px solid ${borderColor}` : 'none',
                    boxShadow: msg.role === 'ai' ? 'none' : '0 1px 4px rgba(79,70,229,0.2)',
                  }}>
                    <Typography sx={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                      {msg.text}
                    </Typography>
                  </Box>
                </Box>
              ))}

              {loading && (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', px: 0.5 }}>
                  <CircularProgress size={12} thickness={4} />
                  <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Updating document...
                  </Typography>
                </Box>
              )}
              <div ref={chatEndRef} />
            </Box>

            {/* Chat Input */}
            <Box sx={{
              p: 1.5,
              borderTop: `1px solid ${borderColor}`,
              bgcolor: isDark ? '#1a1d2e' : '#fafafa',
            }}>
              <form onSubmit={handleRefine}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Ask AI or refine your draft..."
                  value={refinementInput}
                  onChange={(e) => setRefinementInput(e.target.value)}
                  disabled={loading}
                  InputProps={{
                    sx: {
                      borderRadius: '8px',
                      bgcolor: isDark ? '#0f1117' : 'white',
                      fontSize: '0.8rem',
                      '& fieldset': { borderColor, borderRadius: '8px' },
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          type="submit"
                          disabled={loading || !refinementInput.trim()}
                          sx={{
                            width: 26, height: 26,
                            borderRadius: '7px',
                            bgcolor: refinementInput.trim() ? '#4f46e5' : 'transparent',
                            color: refinementInput.trim() ? 'white' : '#94a3b8',
                            '&:hover': { bgcolor: '#4338ca' },
                            '&.Mui-disabled': { bgcolor: 'transparent', color: '#cbd5e1' },
                          }}
                        >
                          {loading ? <CircularProgress size={13} /> : <Send size={13} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </form>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

}
