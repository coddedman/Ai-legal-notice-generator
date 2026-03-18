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
import { FileText, MessageCircle, FilePenLine, Copy, Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { NoticeFormData } from './NoticeForm';

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
  
  const [docs, setDocs] = useState({
    legalNotice: initialData.legalNotice || '',
    whatsappMessage: initialData.whatsappMessage || '',
    complaintDraft: initialData.complaintDraft || ''
  });

  const [docLoading, setDocLoading] = useState<{ [key: string]: boolean }>({
    legalNotice: false,
    whatsappMessage: false,
    complaintDraft: false
  });

  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchDoc = async (target: 'whatsappMessage' | 'complaintDraft') => {
    if (docs[target]) return; // already fetched

    setDocLoading(prev => ({ ...prev, [target]: true }));
    setFetchError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, targetDoc: target }),
      });

      if (!res.ok) throw new Error(`Failed to fetch ${target}`);
      
      const resData = await res.json();
      setDocs(prev => ({ ...prev, [target]: resData[target] }));
    } catch (err: any) {
      setFetchError(err.message || 'Error loading draft');
    } finally {
      setDocLoading(prev => ({ ...prev, [target]: false }));
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    if (newValue === 1) fetchDoc('whatsappMessage');
    if (newValue === 2) fetchDoc('complaintDraft');
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
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxLineWidth = pageWidth - margin * 2;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(content, maxLineWidth);
    let cursorY = margin;
    const pageHeight = doc.internal.pageSize.getHeight();
    for (let i = 0; i < lines.length; i++) {
        if (cursorY > pageHeight - margin) {
            doc.addPage();
            cursorY = margin;
        }
        doc.text(lines[i], margin, cursorY);
        cursorY += 6;
    }
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
                      <Typography variant="body2" color="text.secondary">
                        Generating specialized {tab.label.toLowerCase()}...
                      </Typography>
                    </Box>
                  ) : fetchError && !tab.content ? (
                    <Typography color="error">{fetchError}</Typography>
                  ) : (
                    tab.content || 'Drafting will begin when you click this tab.'
                  )}
                </Paper>
              </Box>
            )}
          </Box>
        ))}
      </Paper>
    </Box>
  );
}
