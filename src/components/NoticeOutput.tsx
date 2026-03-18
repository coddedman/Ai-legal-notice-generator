'use client';

import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import { FileText, MessageCircle, FilePenLine, Copy, Download, Loader2, Send, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';
import { NoticeFormData } from './NoticeForm';
import { TextField, InputAdornment } from '@mui/material';

interface OutputProps {
  initialData: {
    legalNotice?: string;
    whatsappMessage?: string;
    complaintDraft?: string;
  };
  formData: NoticeFormData;
}

export default function NoticeOutput({ initialData, formData }: OutputProps) {
  const theme = useTheme();
  const [tabIndex, setTabIndex] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const [docs, setDocs] = useState<{ [key: string]: string }>({
    legalNotice: initialData.legalNotice || '',
    whatsappMessage: initialData.whatsappMessage || '',
    complaintDraft: initialData.complaintDraft || ''
  });

  const [docLoading, setDocLoading] = useState<{ [key: string]: boolean }>({
    legalNotice: false,
    whatsappMessage: false,
    complaintDraft: false
  });

  const [refinementInput, setRefinementInput] = useState('');
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [loadingStep, setLoadingStep] = useState(0);
  const tabLoadingMessages = [
    "Analyzing specific context for this format...",
    "Applying professional legal tone...",
    "Ensuring BNS compliance and citations...",
    "Formatting numbered paragraphs...",
    "Finalizing specific prayer/ultimatum..."
  ];

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    const isAnyLoading = Object.values(docLoading).some(v => v);
    
    if (isAnyLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % tabLoadingMessages.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [docLoading]);

  const fetchDoc = async (target: string, refinement?: string) => {
    if (!refinement && docs[target]) return; 

    setDocLoading(prev => ({ ...prev, [target]: true }));
    setFetchError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          targetDoc: target,
          refinement: refinement,
          currentDraft: docs[target]
        }),
      });

      if (!res.ok) throw new Error(`Failed to process request for ${target}`);
      
      const resData = await res.json();
      setDocs(prev => ({ ...prev, [target]: resData[target] }));
      if (refinement) setRefinementInput('');
    } catch (err: any) {
      setFetchError(err.message || 'Error communicating with AI');
    } finally {
      setDocLoading(prev => ({ ...prev, [target]: false }));
    }
  };

  const handleRefine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinementInput.trim()) return;
    const currentTabId = tabs[tabIndex].id;
    fetchDoc(currentTabId, refinementInput);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    const targetId = tabs[newValue].id;
    if (targetId === 'whatsappMessage') fetchDoc('whatsappMessage');
    if (targetId === 'complaintDraft') fetchDoc('complaintDraft');
  };

  const tabs = [
    { id: 'legalNotice', label: 'Legal Notice', icon: <FileText size={18} />, content: docs.legalNotice, title: 'Formal Legal Notice' },
    { id: 'whatsappMessage', label: 'WhatsApp Message', icon: <MessageCircle size={18} />, content: docs.whatsappMessage, title: 'WhatsApp Draft' },
    { id: 'complaintDraft', label: 'Complaint Draft', icon: <FilePenLine size={18} />, content: docs.complaintDraft, title: 'Consumer Court/Police Draft' },
  ];

  const handleCopy = (index: number, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadPDF = (title: string, content: string) => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxLineWidth = pageWidth - margin * 2;
    
    let cursorY = 20;

    // Add Firm Logo if available
    if (formData.lawyerLogo) {
       try {
         doc.addImage(formData.lawyerLogo, 'PNG', margin, 15, 25, 25);
         cursorY = 45; // Move cursor down after logo
       } catch (e) {
         console.error('PDF Logo Error:', e);
       }
    }

    // Add professional header
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.text(title.toUpperCase(), pageWidth / 2, cursorY, { align: 'center' });
    
    cursorY += 5;
    doc.setLineWidth(0.5);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    
    cursorY += 10;
    const lines = doc.splitTextToSize(content, maxLineWidth);
    let pageCount = 1;

    const addFooter = (pNum: number) => {
      doc.setFont("times", "italic");
      doc.setFontSize(9);
      doc.text(`Page ${pNum} - Generated by AI Legal Notice Assistant`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    };

    for (let i = 0; i < lines.length; i++) {
        if (cursorY > pageHeight - 25) {
            addFooter(pageCount);
            doc.addPage();
            pageCount++;
            cursorY = 25; 
        }
        doc.setFont("times", "normal");
        doc.text(lines[i], margin, cursorY);
        cursorY += 7;
    }
    
    // Add Stamp if available (at the end)
    if (formData.lawyerStamp) {
       if (cursorY > pageHeight - 50) {
          doc.addPage();
          cursorY = 25;
       }
       try {
         doc.addImage(formData.lawyerStamp, 'PNG', margin, cursorY + 5, 35, 35);
       } catch (e) {
         console.error('PDF Stamp Error:', e);
       }
    }

    addFooter(pageCount);
    doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <Box sx={{ width: '100%', mt: 4 }} className="animate-fade-in">
      <Paper elevation={0} className="glass-panel" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)' }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
            sx={{ '& .MuiTab-root': { py: 2.5, minHeight: 60 } }}
          >
            {tabs.map((tab, idx) => (
              <Tab
                key={idx}
                icon={tab.icon}
                iconPosition="start"
                label={tab.label}
                sx={{ fontWeight: 600, textTransform: 'capitalize', fontSize: '1rem' }}
              />
            ))}
          </Tabs>
        </Box>

        {tabs.map((tab, idx) => (
          <Box
            key={idx}
            role="tabpanel"
            hidden={tabIndex !== idx}
            sx={{ p: { xs: 2, md: 4 } }}
          >
            {tabIndex === idx && (
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6" color="primary">
                    {tab.title}
                  </Typography>
                  {!docLoading[tab.id] && tab.content && (
                    <Box>
                      <Tooltip title={copiedIndex === idx ? "Copied!" : "Copy to Clipboard"}>
                        <IconButton onClick={() => handleCopy(idx, tab.content)} color="primary" sx={{ mr: 1, bgcolor: 'rgba(99,102,241,0.1)' }}>
                          <Copy size={20} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download PDF">
                        <IconButton onClick={() => handleDownloadPDF(tab.title, tab.content)} color="secondary" sx={{ bgcolor: 'rgba(139,92,246,0.1)' }}>
                          <Download size={20} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
                
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: docLoading[tab.id] ? 'center' : 'flex-start',
                    alignItems: docLoading[tab.id] ? 'center' : 'stretch',
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.02)',
                    border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                    borderRadius: 2,
                    maxHeight: '500px',
                    overflowY: 'auto',
                    typography: 'body1',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'serif',
                    lineHeight: 1.8,
                  }}
                >
                  {docLoading[tab.id] ? (
                    <Box textAlign="center">
                      <Loader2 size={32} className="animate-spin" style={{ color: theme.palette.primary.main, marginBottom: 12 }} />
                      <Typography variant="body2" color="text.primary" fontWeight={600} mb={0.5}>
                         {tabLoadingMessages[loadingStep]}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {docs[tab.id] ? 'Refining draft...' : `Generating specialized ${tab.label.toLowerCase()}...`}
                      </Typography>
                    </Box>
                  ) : fetchError && !tab.content ? (
                    <Typography color="error">{fetchError}</Typography>
                  ) : (
                    tab.content || 'Drafting will begin when you click this tab.'
                  )}
                </Paper>

                {/* Refinement Chat Box */}
                {!docLoading[tab.id] && tab.content && (
                  <Box mt={4} className="animate-fade-in">
                    <Typography variant="subtitle2" color="text.secondary" mb={1.5} display="flex" alignItems="center" gap={1}>
                       <Sparkles size={16} /> Need to change something? Chat with Advocate AI
                    </Typography>
                    <Box component="form" onSubmit={handleRefine} sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="e.g. 'Make it more professional', 'Add a 7-day deadline', 'Include the transaction ID...'"
                        value={refinementInput}
                        onChange={(e) => setRefinementInput(e.target.value)}
                        disabled={docLoading[tab.id]}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 3,
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'white'
                          } 
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MessageCircle size={18} color={theme.palette.text.secondary} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Button
                        variant="contained"
                        type="submit"
                        disabled={!refinementInput.trim() || docLoading[tab.id]}
                        sx={{ 
                          borderRadius: 3, 
                          px: 3,
                          background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
                          textTransform: 'none',
                          fontWeight: 600
                        }}
                      >
                        <Send size={18} />
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        ))}
      </Paper>
    </Box>
  );
}
