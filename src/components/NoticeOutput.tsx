'use client';

import React, { useState, useRef } from 'react';
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
  Chip,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import {
  FileText, MessageCircle, FilePenLine, Copy, Download, Loader2, Send, Sparkles,
  Pencil, CheckCircle2, X, RefreshCw, Share2, Languages, Mail
} from 'lucide-react';
import { NoticeFormData, LANGUAGES } from './NoticeForm';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { TextField, InputAdornment } from '@mui/material';

// Dynamic import for Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <Box sx={{ p: 4, textAlign: 'center' }}><Loader2 size={24} className="animate-spin" /></Box>
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

interface OutputProps {
  initialData: {
    legalNotice?: string;
    whatsappMessage?: string;
    complaintDraft?: string;
    emailDraft?: string;
  };
  formData: NoticeFormData;
}

export default function NoticeOutput({ initialData, formData }: OutputProps) {
  const theme = useTheme();
  const [tabIndex, setTabIndex] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  
  const [docs, setDocs] = useState<{
    legalNotice: string;
    whatsappMessage: string;
    complaintDraft: string;
    emailDraft: string;
  }>({
    legalNotice: initialData.legalNotice || '',
    whatsappMessage: initialData.whatsappMessage || '',
    complaintDraft: initialData.complaintDraft || '',
    emailDraft: initialData.emailDraft || '',
  });

  const [docLoading, setDocLoading] = useState<{ [key: string]: boolean }>({
    legalNotice: false,
    whatsappMessage: false,
    complaintDraft: false,
    emailDraft: false
  });

  const [refinementInput, setRefinementInput] = useState('');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState(formData.language || 'en');

  const tabLoadingMessages = [
    "Analyzing specific context for this format...",
    "Applying professional legal tone...",
    "Ensuring BNS 2023 compliance and citations...",
    "Formatting numbered paragraphs...",
    "Finalizing prayer/ultimatum clause...",
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

  const fetchDoc = async (target: string, refinement?: string, langOverride?: string, force?: boolean) => {
    if (!force && !refinement && docs[target as keyof typeof docs]) return;
    setDocLoading(prev => ({ ...prev, [target]: true }));
    setFetchError(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, language: langOverride ?? selectedLanguage, targetDoc: target, refinement, currentDraft: docs[target as keyof typeof docs] }),
      });
      if (!res.ok) throw new Error(`Failed to process request for ${target}`);
      const resData = await res.json();
      setDocs(prev => ({ ...prev, [target as keyof typeof docs]: resData[target] }));
      if (refinement) setRefinementInput('');
    } catch (err: any) {
      setFetchError(err.message || 'Error communicating with AI');
    } finally {
      setDocLoading(prev => ({ ...prev, [target]: false }));
    }
  };

  const handleLanguageChange = (newLang: string) => {
    setSelectedLanguage(newLang);
    // Clear all cached docs and refetch current tab in new language
    setDocs({ legalNotice: '', whatsappMessage: '', complaintDraft: '', emailDraft: '' });
    const currentTabId = tabs[tabIndex]?.id || 'legalNotice';
    setTimeout(() => fetchDoc(currentTabId, undefined, newLang, true), 50);
  };

  const handleRegenerate = (target: string) => {
    setDocs(prev => ({ ...prev, [target as keyof typeof docs]: '' }));
    setTimeout(() => fetchDoc(target, undefined, undefined, true), 50);
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
    // Don't fetch if already has content OR if in edit mode
    if (!editMode[targetId]) {
      if (targetId === 'legalNotice' && !docs.legalNotice) fetchDoc('legalNotice');
      if (targetId === 'whatsappMessage' && !docs.whatsappMessage) fetchDoc('whatsappMessage');
      if (targetId === 'complaintDraft' && !docs.complaintDraft) fetchDoc('complaintDraft');
      if (targetId === 'emailDraft' && !docs.emailDraft) fetchDoc('emailDraft');
    }
  };

  const tabs = [
    { id: 'legalNotice', label: 'Legal Notice', icon: <FileText size={18} />, content: docs.legalNotice, title: 'Formal Legal Notice' },
    { id: 'emailDraft', label: 'Email', icon: <Mail size={18} />, content: docs.emailDraft, title: 'Formal Email Notice' },
    { id: 'whatsappMessage', label: 'WhatsApp', icon: <MessageCircle size={18} />, content: docs.whatsappMessage, title: 'WhatsApp Demand Draft' },
    { id: 'complaintDraft', label: 'Complaint Draft', icon: <FilePenLine size={18} />, content: docs.complaintDraft, title: 'Consumer Court / Police Complaint' },
  ];

  const handleToggleEdit = (tabId: string) => {
    const isEnteringEdit = !editMode[tabId];
    
    if (isEnteringEdit) {
      const content = docs[tabId as keyof typeof docs];
      // If it's plain text (no HTML tags), convert it to basic HTML blocks for Quill
      if (content && !/<[a-z][\s\S]*>/i.test(content)) {
        const html = content.split('\n').map(line => {
          const trimmed = line.trim();
          if (!trimmed) return '';
          const isHeading = /^(LEGAL NOTICE|FACTS|LEGAL GROUNDS|DEMANDS|ULTIMATUM|SUBJECT:|TO:|FROM:|NOTICE|PRAYER)/i.test(trimmed);
          const isNumbered = /^\d+\./.test(trimmed);
          
          if (isHeading) return `<h3><strong>${trimmed}</strong></h3>`;
          if (isNumbered) return `<p><strong>${line}</strong></p>`;
          return `<p>${line}</p>`;
        }).filter(Boolean).join('');
        setDocs(prev => ({ ...prev, [tabId]: html }));
      }
    }
    
    setEditMode(prev => ({ ...prev, [tabId]: !prev[tabId] }));
  };

  const handleCopy = (index: number, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleWhatsAppShare = (content: string) => {
    const encoded = encodeURIComponent(content.substring(0, 1000)); // WhatsApp link truncates
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleDownloadDocx = (title: string, content: string) => {
    // Detect if content is HTML or plain text
    const isHtml = /<[a-z][\s\S]*>/i.test(content);
    
    // Format content appropriately for the .doc blob
    const bodyContent = isHtml 
      ? content 
      : content.split('\n').map(line => `<p>${line || '&nbsp;'}</p>`).join('');

    const html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word'
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${title}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 12pt; margin: 2cm; }
        h1 { text-align: center; font-size: 14pt; text-transform: uppercase; }
        h2, h3 { color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
        p { line-height: 1.8; text-align: justify; margin-bottom: 12pt; }
        ul, ol { margin-left: 20pt; margin-bottom: 12pt; }
        li { margin-bottom: 4pt; }
        strong { font-weight: bold; }
      </style></head>
      <body>
        <h1>${title}</h1>
        <hr style="border: 1px solid #6366f1;"/>
        ${bodyContent}
      </body></html>`;
    const blob = new Blob([html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const addImageToPdf = (doc: any, src: string, x: number, y: number, w: number, h: number) => {
    if (!src) return;
    // Detect format from data URI
    let fmt: string = 'PNG';
    if (src.startsWith('data:image/jpeg') || src.startsWith('data:image/jpg')) fmt = 'JPEG';
    else if (src.startsWith('data:image/png')) fmt = 'PNG';
    else if (src.startsWith('data:image/webp')) fmt = 'WEBP';
    try {
      doc.addImage(src, fmt, x, y, w, h);
    } catch {
      // Fallback: try other formats
      const fallbacks = ['PNG', 'JPEG', 'WEBP'].filter(f => f !== fmt);
      for (const f of fallbacks) {
        try { doc.addImage(src, f, x, y, w, h); return; } catch {}
      }
    }
  };

  const handleDownloadPDF = async (title: string, tabId: string) => {
    try {
      const element = document.getElementById(`doc-preview-${tabId}`);
      if (!element) return;
      
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;

      // Ensure crisp high-res screenshot
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Calculate how many pages we need based on height
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - pageHeight; // Adjust position for next page
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${title.replace(/\s+/g, '_')}.pdf`);
    } catch (e) {
      console.error("PDF generation failed:", e);
    }
  };

  // Helper to format content into HTML for PDF capture
  const formatHtml = (content: string) => {
    if (!content) return '';
    const isHtml = /<[a-z][\s\S]*>/i.test(content);

    if (isHtml) {
      return content;
    }

    // Convert plain text to HTML paragraphs, similar to renderFormattedContent logic
    return content.split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '<p>&nbsp;</p>'; // Preserve empty lines as spacing
      const isMajorHeading = /^(LEGAL NOTICE|FACTS|LEGAL GROUNDS|DEMANDS|ULTIMATUM|SUBJECT:|TO:|FROM:|NOTICE|PRAYER)/i.test(trimmed);
      const isNumberedClause = /^\d+\./.test(trimmed);

      if (isMajorHeading) {
        return `<h3 style="font-size: 1.1em; font-weight: bold; text-transform: uppercase; margin-top: 1.5em; margin-bottom: 0.5em; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5em;">${trimmed}</h3>`;
      }
      if (isNumberedClause) {
        return `<p style="font-weight: bold; margin-bottom: 0.5em;">${line}</p>`;
      }
      return `<p style="margin-bottom: 0.5em;">${line}</p>`;
    }).join('');
  };

  // Format doc content for display with bold headings
  const renderFormattedContent = (content: string) => {
    if (!content) return null;

    // Detect if content is HTML (from Quill) or plain text
    const isHtml = /<[a-z][\s\S]*>/i.test(content);

    if (isHtml) {
      return (
        <Box 
          className="quill-viewer"
          sx={{
            fontFamily: 'serif',
            fontSize: '0.9rem',
            lineHeight: 1.85,
            color: 'text.primary',
            '& p': { mb: 1.5 },
            '& h1, & h2, & h3': { color: 'primary.main', fontWeight: 700, mb: 1.5, mt: 3, borderBottom: '1px solid', borderColor: 'divider', pb: 0.5 },
            '& strong': { fontWeight: 700 },
            '& ul, & ol': { pl: 4, mb: 2 }
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    return content.split('\n').map((line, i) => {
      const isMajorHeading = /^(LEGAL NOTICE|FACTS|LEGAL GROUNDS|DEMANDS|ULTIMATUM|SUBJECT:|TO:|FROM:|NOTICE|PRAYER)/i.test(line.trim());
      const isNumberedClause = /^\d+\./.test(line.trim());
      return (
        <Typography
          key={i}
          component="p"
          sx={{
            fontFamily: 'serif',
            fontSize: isMajorHeading ? '0.95rem' : '0.9rem',
            fontWeight: isMajorHeading ? 700 : (isNumberedClause ? 500 : 400),
            textTransform: isMajorHeading ? 'uppercase' : 'none',
            letterSpacing: isMajorHeading ? '0.05em' : 'normal',
            color: isMajorHeading ? 'primary.main' : 'text.primary',
            lineHeight: 1.85,
            mt: isMajorHeading ? 1.5 : 0,
            mb: isMajorHeading ? 0.5 : 0,
            borderBottom: isMajorHeading ? '1px solid' : 'none',
            borderColor: 'divider',
            pb: isMajorHeading ? 0.5 : 0,
          }}
        >
          {line || '\u00A0'}
        </Typography>
      );
    });
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }} className="animate-fade-in">
      <Paper elevation={0} className="glass-panel" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider', 
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)', 
          display: 'flex', 
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: { xs: 'stretch', lg: 'center' }
        }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
            sx={{ 
              flexGrow: 1,
              '& .MuiTab-root': { py: 2, minHeight: 50, fontSize: { xs: '0.8rem', sm: '0.95rem' } } 
            }}
          >
            {tabs.map((tab, idx) => (
              <Tab
                key={idx}
                icon={tab.icon}
                iconPosition="start"
                label={tab.label}
                sx={{ fontWeight: 600, textTransform: 'capitalize' }}
              />
            ))}
          </Tabs>

          {/* Language switcher — stacks below tabs on mobile */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: { xs: 'center', lg: 'flex-end' },
            px: 2, 
            py: { xs: 1.5, lg: 0 },
            gap: 1, 
            flexShrink: 0,
            borderTop: { xs: '1px solid rgba(0,0,0,0.05)', lg: 'none' }
          }}>
            <Languages size={16} style={{ opacity: 0.5 }} />
            <FormControl size="small" variant="outlined" sx={{ minWidth: { xs: '100%', lg: 120 } }}>
              <Select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                sx={{
                  fontSize: '0.8rem',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                  '& .MuiSelect-select': { py: 0.8, px: 1.5 },
                }}
              >
                {LANGUAGES.map(l => (
                  <MenuItem key={l.code} value={l.code} sx={{ fontSize: '0.85rem' }}>
                    {l.native} <Box component="span" sx={{ ml: 0.5, fontSize: '0.7rem', color: 'text.secondary' }}>({l.label})</Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {tabs.map((tab, idx) => (
          <Box key={idx} role="tabpanel" hidden={tabIndex !== idx} sx={{ p: { xs: 2, md: 4 } }}>
            {tabIndex === idx && (
              <Box>
                {/* Header Row */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6" color="primary" fontWeight={700}>{tab.title}</Typography>
                    {tab.content && !docLoading[tab.id] && (
                      <Chip label="Ready" size="small" color="success" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
                    )}
                  </Box>
                  
                  {!docLoading[tab.id] && tab.content && (
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {/* Edit Mode Toggle */}
                      <Tooltip title={editMode[tab.id] ? "Save Edit" : "Edit Directly"}>
                        <IconButton
                          onClick={() => handleToggleEdit(tab.id)}
                          size="small"
                          sx={{ bgcolor: editMode[tab.id] ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.1)', borderRadius: 2 }}
                        >
                          {editMode[tab.id] ? <CheckCircle2 size={18} color="#10b981" /> : <Pencil size={18} />}
                        </IconButton>
                      </Tooltip>

                      {/* Copy */}
                      <Tooltip title={copiedIndex === idx ? "Copied!" : "Copy"}>
                        <IconButton onClick={() => handleCopy(idx, tab.content)} size="small" sx={{ bgcolor: 'rgba(99,102,241,0.08)', borderRadius: 2 }}>
                          <Copy size={18} />
                        </IconButton>
                      </Tooltip>

                      {/* Regenerate */}
                      <Tooltip title="Generate fresh draft">
                        <IconButton onClick={() => handleRegenerate(tab.id)} size="small" sx={{ bgcolor: 'rgba(245,158,11,0.1)', borderRadius: 2 }}>
                          <RefreshCw size={18} color="#f59e0b" />
                        </IconButton>
                      </Tooltip>

                      {/* WhatsApp Share */}
                      <Tooltip title="Share on WhatsApp">
                        <IconButton
                          onClick={() => handleWhatsAppShare(tab.content)}
                          size="small"
                          sx={{ bgcolor: 'rgba(37,211,102,0.1)', borderRadius: 2 }}
                        >
                          <MessageCircle size={18} color="#25d366" />
                        </IconButton>
                      </Tooltip>

                      {/* Download Word */}
                      <Tooltip title="Download as Word (.doc)">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleDownloadDocx(tab.title, tab.content)}
                          sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.75rem', minWidth: 'auto', px: 1.5 }}
                        >
                          .doc
                        </Button>
                      </Tooltip>

                      {/* Download PDF */}
                      <Tooltip title="Download PDF (Exact formatting)">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDownloadPDF(tab.title, tab.id)}
                          sx={{ 
                            border: '1px solid', borderColor: 'divider',
                            color: 'error.main', bgcolor: 'rgba(239,68,68,0.05)',
                            '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' }
                          }}>
                          <Download size={16} />
                          <Typography variant="caption" sx={{ ml: 1, fontWeight: 600 }}>
                            PDF
                          </Typography>
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>

                {/* Document Viewer / Editor */}
                <Paper
                  elevation={0}
                  sx={{
                    minHeight: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: docLoading[tab.id] ? 'center' : 'flex-start',
                    alignItems: docLoading[tab.id] ? 'center' : 'stretch',
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : '#fafafa',
                    border: editMode[tab.id]
                      ? '2px solid #10b981'
                      : theme.palette.mode === 'dark'
                      ? '1px solid rgba(255,255,255,0.05)'
                      : '1px solid rgba(0,0,0,0.06)',
                    borderRadius: 2,
                    maxHeight: '60vh',
                    overflowY: 'auto',
                    position: 'relative',
                    transition: 'border 0.2s',
                  }}
                >
                  {/* Edit mode indicator bar */}
                  {editMode[tab.id] && (
                    <Box sx={{ px: 2, py: 0.8, bgcolor: 'rgba(16,185,129,0.1)', borderBottom: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Pencil size={13} color="#10b981" />
                      <Typography variant="caption" color="#10b981" fontWeight={700}>EDIT MODE — Type freely to make changes</Typography>
                      <Box sx={{ ml: 'auto', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5 }}
                        onClick={() => handleToggleEdit(tab.id)}>
                        <CheckCircle2 size={14} color="#10b981" />
                        <Typography variant="caption" color="#10b981" fontWeight={700}>Done</Typography>
                      </Box>
                    </Box>
                  )}
                  {docLoading[tab.id] ? (
                    <Box textAlign="center">
                      <Loader2 size={32} className="animate-spin" style={{ color: theme.palette.primary.main, marginBottom: 12 }} />
                      <Typography variant="body2" color="text.primary" fontWeight={600} mb={0.5}>
                        {tabLoadingMessages[loadingStep]}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {docs[tab.id as keyof typeof docs] ? 'Refining draft...' : `Generating your ${tab.label.toLowerCase()}...`}
                      </Typography>
                    </Box>
                  ) : fetchError && !tab.content ? (
                    <Box textAlign="center">
                      <X size={32} color="#ef4444" style={{ marginBottom: 8 }} />
                      <Typography color="error" fontWeight={600}>{fetchError}</Typography>
                    </Box>
                  ) : editMode[tab.id] ? (
                    // ✏️ REAL RICH TEXT EDITOR
                    <Box sx={{ 
                      p: 0, 
                      '& .quill': { border: 'none' },
                      '& .ql-toolbar': { 
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                        border: 'none',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        position: 'sticky',
                        top: 0,
                        zIndex: 10,
                        backdropFilter: 'blur(10px)',
                        px: 2
                      },
                      '& .ql-container': { 
                        fontFamily: 'serif', 
                        fontSize: '0.95rem',
                        minHeight: '400px',
                        border: 'none'
                      },
                      '& .ql-editor': {
                        p: 3,
                        lineHeight: '1.85'
                      },
                      '& .ql-stroke': {
                        stroke: theme.palette.mode === 'dark' ? '#cbd5e1 !important' : '#475569 !important'
                      },
                      '& .ql-fill': {
                        fill: theme.palette.mode === 'dark' ? '#cbd5e1 !important' : '#475569 !important'
                      },
                      '& .ql-picker': {
                        color: theme.palette.mode === 'dark' ? '#cbd5e1 !important' : '#475569 !important'
                      }
                    }}>
                      <ReactQuill
                        theme="snow"
                        value={docs[tab.id as keyof typeof docs]}
                        onChange={(val) => setDocs(prev => ({ ...prev, [tab.id as keyof typeof docs]: val }))}
                        modules={QUILL_MODULES}
                        formats={QUILL_FORMATS}
                      />
                    </Box>
                  ) : (
                    // 📄 FORMATTED VIEW MODE
                    <Box sx={{ p: 4 }}>
                      {/* ── LETTERHEAD (shown when logo/stamp present, Legal Notice tab only) ── */}
                      {(tab.id === 'legalNotice' || tab.id === 'complaintDraft') && (formData.lawyerLogo || formData.lawyerStamp) && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 2,
                            pb: 2,
                            borderBottom: '2px solid',
                            borderColor: 'primary.main',
                            gap: 2,
                          }}
                        >
                          {/* Logo — left */}
                          {formData.lawyerLogo ? (
                            <Box sx={{ flexShrink: 0 }}>
                              <img
                                src={formData.lawyerLogo}
                                alt="Lawyer Logo"
                                style={{ height: 64, maxWidth: 160, objectFit: 'contain', display: 'block' }}
                              />
                            </Box>
                          ) : <Box sx={{ width: 64 }} />}

                          {/* Firm name — center */}
                          {formData.senderType === 'lawyer' && (
                            <Box sx={{ textAlign: 'center', flex: 1 }}>
                              <Typography variant="subtitle1" fontWeight={800} sx={{ fontFamily: 'Georgia, serif', letterSpacing: 1, textTransform: 'uppercase' }}>
                                {formData.lawyerName || ''}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontFamily: 'Georgia, serif' }}>
                                Advocate &amp; Legal Consultant
                              </Typography>
                              {formData.lawyerAddress && (
                                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'Georgia, serif' }}>
                                  {formData.lawyerAddress}
                                </Typography>
                              )}
                            </Box>
                          )}

                          {/* Stamp — right */}
                          {formData.lawyerStamp ? (
                            <Box sx={{ flexShrink: 0 }}>
                              <img
                                src={formData.lawyerStamp}
                                alt="Lawyer Stamp"
                                style={{ height: 72, width: 72, objectFit: 'contain', display: 'block', opacity: 0.9 }}
                              />
                            </Box>
                          ) : <Box sx={{ width: 72 }} />}
                        </Box>
                      )}

                      {renderFormattedContent(tab.content) || (
                        <Typography color="text.secondary" fontStyle="italic">
                          Drafting will begin when you click this tab.
                        </Typography>
                      )}
                    </Box>
                  )}
                </Paper>

                {/* Refinement Chat Box */}
                {!docLoading[tab.id] && tab.content && (
                  <Box mt={3} className="animate-fade-in">
                    <Typography variant="subtitle2" color="text.secondary" mb={1.5} display="flex" alignItems="center" gap={1}>
                      <Sparkles size={16} /> Refine with AI
                    </Typography>
                    <Box component="form" onSubmit={handleRefine} sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="e.g. 'Make it more aggressive', 'Add a 7-day deadline', 'Include contract number...'"
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
