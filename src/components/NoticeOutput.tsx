'use client';

import React, { useState } from 'react';
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
import { FileText, MessageCircle, FilePenLine, Copy, Download } from 'lucide-react';
import jsPDF from 'jspdf';

interface OutputProps {
  data: {
    legalNotice: string;
    whatsappMessage: string;
    complaintDraft: string;
  };
}

export default function NoticeOutput({ data }: OutputProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const tabs = [
    { label: 'Legal Notice', icon: <FileText size={18} />, content: data.legalNotice, title: 'Formal Legal Notice' },
    { label: 'WhatsApp Message', icon: <MessageCircle size={18} />, content: data.whatsappMessage, title: 'WhatsApp Draft' },
    { label: 'Complaint Draft', icon: <FilePenLine size={18} />, content: data.complaintDraft, title: 'Consumer Court/Police Draft' },
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
    
    // Add simple styling to the text doc
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    const lines = doc.splitTextToSize(content, maxLineWidth);
    
    // pagination tracking
    let cursorY = margin;
    const pageHeight = doc.internal.pageSize.getHeight();
    
    for (let i = 0; i < lines.length; i++) {
        if (cursorY > pageHeight - margin) {
            doc.addPage();
            cursorY = margin;
        }
        doc.text(lines[i], margin, cursorY);
        cursorY += 6; // line spacing
    }

    doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <Box sx={{ width: '100%', mt: 4 }} className="animate-fade-in">
      <Paper elevation={0} className="glass-panel" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'rgba(0,0,0,0.2)' }}>
          <Tabs
            value={tabIndex}
            onChange={(e, newIndex) => setTabIndex(newIndex)}
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
                </Box>
                
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 2,
                    maxHeight: '400px',
                    overflowY: 'auto',
                    typography: 'body1',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'serif',
                    lineHeight: 1.8,
                  }}
                >
                  {tab.content}
                </Paper>
              </Box>
            )}
          </Box>
        ))}
      </Paper>
    </Box>
  );
}
