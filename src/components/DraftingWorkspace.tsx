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
  Pencil, 
  CheckCircle2, 
  Sparkles, 
  Save, 
  RefreshCw, 
  Download, 
  ArrowLeft, 
  MessageCircle, 
  Scale, 
  ThumbsUp, 
  ShieldAlert, 
  Search,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Send
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { NoticeFormData } from './NoticeForm';

// Dynamic import for Quill
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
});

const QUILL_MODULES = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['clean']
  ],
};

const QUILL_FORMATS = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'align',
];

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
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  const handleRefine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinementInput.trim()) return;
    onModify(refinementInput);
    setRefinementInput('');
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 80px)', bgcolor: 'rgba(248,250,252,1)', overflow: 'hidden', m: -4 }}>
      
      {/* ── LEFT SIDEBAR: Detail Input ── */}
      <Box sx={{ 
        width: leftOpen ? 300 : 0, 
        transition: 'width 0.3s ease', 
        bgcolor: 'white', 
        borderRight: '1px solid', 
        borderColor: 'divider',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" fontWeight={800} color="primary">CASE DETAILS</Typography>
            <IconButton size="small" onClick={() => setLeftOpen(false)}><ChevronLeft size={18} /></IconButton>
        </Box>
        
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Button variant="text" size="small" startIcon={<UserPlus size={16} />} sx={{ color: '#10b981', alignSelf: 'flex-start', fontWeight: 700, mb: 1 }}>
                Add a client?
            </Button>

            <TextField fullWidth size="small" label="Court Name" value={formData.courtName || ''} onChange={(e) => updateFormData({ courtName: e.target.value })} />
            <TextField fullWidth size="small" label="Complaint Number" value={formData.complaintNumber || ''} onChange={(e) => updateFormData({ complaintNumber: e.target.value })} />
            <TextField fullWidth size="small" label="Name of Complainant" value={formData.senderName || ''} onChange={(e) => updateFormData({ senderName: e.target.value })} />
            <TextField fullWidth size="small" label="Father/Husband Name" placeholder="Father/Husband" />
            <TextField fullWidth size="small" label="Age" type="number" />
            <TextField fullWidth size="small" label="Sender Address" multiline rows={2} value={formData.senderAddress || ''} onChange={(e) => updateFormData({ senderAddress: e.target.value })} />
            
            <Divider sx={{ my: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>OPPOSITE PARTY</Typography>
            </Divider>

            <TextField fullWidth size="small" label="Respondent / Recipient Name" value={formData.receiverName || ''} onChange={(e) => updateFormData({ receiverName: e.target.value })} />
            <TextField fullWidth size="small" label="Respondent Address" multiline rows={2} value={formData.receiverAddress || ''} onChange={(e) => updateFormData({ receiverAddress: e.target.value })} />
        </Box>
      </Box>

      {/* Button to reopen left sidebar */}
      {!leftOpen && (
        <MuiIconButton 
            onClick={() => setLeftOpen(true)} 
            sx={{ position: 'fixed', left: 4, top: '50%', zIndex: 10, bgcolor: 'white', border: '1px solid', borderColor: 'divider' }}
        >
            <ChevronRight size={18} />
        </MuiIconButton>
      )}

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
            {/* Editor Toolbar Header */}
            <Box sx={{ p: 1, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', bgcolor: 'rgba(252,252,252,1)' }}>
                <Button size="small" startIcon={<Sparkles size={16} />} sx={{ textTransform: 'none', fontWeight: 600, color: '#4f46e5' }} onClick={() => onModify('')}>
                    Modify Draft
                </Button>
                <Button size="small" startIcon={<RefreshCw size={16} />} sx={{ textTransform: 'none', fontWeight: 600, color: '#10b981' }}>
                    Convert to BNS
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button variant="contained" size="small" startIcon={<Save size={16} />} onClick={() => onSave(content)} sx={{ bgcolor: '#4f46e5' }}>
                    Save
                </Button>
            </Box>

            {/* Editor Content Area */}
            <Box sx={{ 
                flexGrow: 1, 
                p: {xs: 2, md: 5},
                '& .quill': { border: 'none' },
                '& .ql-container': { fontFamily: 'serif', fontSize: '1rem', border: 'none' },
                '& .ql-editor': { padding: 0, lineHeight: 1.8 }
            }}>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={QUILL_MODULES}
                  formats={QUILL_FORMATS}
                />
            </Box>
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
            <Typography variant="subtitle2" fontWeight={800} color="text.secondary">AI CO-PILOT</Typography>
        </Box>

        <Box sx={{ p: 2, flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'rgba(248,250,252,1)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Scale size={20} color="#6366f1" />
                    <Typography variant="subtitle2" fontWeight={700}>Cases For You</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                    Find landmark and relevant judgments that support your legal position.
                </Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'rgba(248,250,252,1)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <ShieldAlert size={20} color="#ef4444" />
                    <Typography variant="subtitle2" fontWeight={700}>Cases Against You</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                    Find potential opposing cases that go against the present matter.
                </Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'rgba(248,250,252,1)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <ThumbsUp size={20} color="#10b981" />
                    <Typography variant="subtitle2" fontWeight={700}>Arguments In Your Favour</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                    Generate compelling legal arguments based on your case facts.
                </Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'rgba(248,250,252,1)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Download size={20} color="#6366f1" />
                    <Typography variant="subtitle2" fontWeight={700}>Export & Templates</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                    Download in professional formats or switch templates.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined" startIcon={<Download size={14} />} sx={{ textTransform: 'none', borderRadius: 1.5, fontSize: '0.7rem' }}>
                        PDF
                    </Button>
                    <Button size="small" variant="outlined" startIcon={<Download size={14} />} sx={{ textTransform: 'none', borderRadius: 1.5, fontSize: '0.7rem' }}>
                        Docx
                    </Button>
                </Box>
            </Paper>
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
