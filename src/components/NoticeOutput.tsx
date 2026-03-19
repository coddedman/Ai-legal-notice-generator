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
} from '@mui/material';
import { 
  FileText, MessageCircle, FilePenLine, Copy, Download, Loader2, Send, Sparkles, 
  Pencil, CheckCircle2, X, RefreshCw, Share2
} from 'lucide-react';
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
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  
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

  const fetchDoc = async (target: string, refinement?: string) => {
    if (!refinement && docs[target]) return;
    setDocLoading(prev => ({ ...prev, [target]: true }));
    setFetchError(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, targetDoc: target, refinement, currentDraft: docs[target] }),
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

  const handleRegenerate = (target: string) => {
    setDocs(prev => ({ ...prev, [target]: '' }));
    setTimeout(() => fetchDoc(target), 50);
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
      if (targetId === 'whatsappMessage') fetchDoc('whatsappMessage');
      if (targetId === 'complaintDraft') fetchDoc('complaintDraft');
    }
  };

  const tabs = [
    { id: 'legalNotice', label: 'Legal Notice', icon: <FileText size={18} />, content: docs.legalNotice, title: 'Formal Legal Notice' },
    { id: 'whatsappMessage', label: 'WhatsApp', icon: <MessageCircle size={18} />, content: docs.whatsappMessage, title: 'WhatsApp Demand Draft' },
    { id: 'complaintDraft', label: 'Complaint Draft', icon: <FilePenLine size={18} />, content: docs.complaintDraft, title: 'Consumer Court / Police Complaint' },
  ];

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
    // Simple .doc (HTML blob) as a widely-supported approach
    const html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word'
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${title}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 12pt; margin: 2cm; }
        h1 { text-align: center; font-size: 14pt; text-transform: uppercase; }
        p { line-height: 1.8; text-align: justify; }
      </style></head>
      <body>
        <h1>${title}</h1>
        <hr/>
        ${content.split('\n').map(line => `<p>${line || '&nbsp;'}</p>`).join('')}
      </body></html>`;
    const blob = new Blob([html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const addImageToPdf = (doc: jsPDF, src: string, x: number, y: number, w: number, h: number) => {
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

  const handleDownloadPDF = (title: string, content: string) => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxLineWidth = pageWidth - margin * 2;

    let cursorY = 15;

    // ---- LETTERHEAD ----
    if (formData.lawyerLogo) {
      addImageToPdf(doc, formData.lawyerLogo, margin, cursorY, 28, 28);
    }

    // Lawyer/Sender name block (top right)
    const isLawyer = formData.senderType === 'lawyer';
    const senderBlock = isLawyer
      ? [`Adv. ${formData.lawyerName || ''}`, formData.lawyerAddress || '']
      : [formData.senderName, formData.senderAddress || ''];

    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.text(senderBlock[0].toUpperCase(), pageWidth - margin, cursorY + 5, { align: 'right' });
    doc.setFont("times", "normal");
    doc.setFontSize(9);
    const addrLines = doc.splitTextToSize(senderBlock[1], 80);
    addrLines.forEach((line: string, i: number) => {
      doc.text(line, pageWidth - margin, cursorY + 10 + (i * 5), { align: 'right' });
    });

    cursorY += formData.lawyerLogo ? 35 : 20;

    // Divider
    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(0.8);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 3;

    // Recipient block
    doc.setFont("times", "bold");
    doc.setFontSize(10);
    doc.text('TO:', margin, cursorY + 5);
    doc.setFont("times", "normal");
    doc.text(formData.receiverName, margin + 10, cursorY + 5);
    if (formData.receiverAddress) {
      const recvAddrLines = doc.splitTextToSize(formData.receiverAddress, maxLineWidth - 10);
      recvAddrLines.forEach((line: string, i: number) => {
        doc.text(line, margin + 10, cursorY + 10 + (i * 5));
      });
      cursorY += 10 + recvAddrLines.length * 5;
    } else {
      cursorY += 10;
    }

    cursorY += 5;
    doc.setLineWidth(0.3);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 8;

    // Date
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`, pageWidth - margin, cursorY, { align: 'right' });
    cursorY += 8;

    // Document Title
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text(title.toUpperCase(), pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 3;
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 8;

    // Document Content
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(content, maxLineWidth);
    let pageCount = 1;

    const addFooter = (pNum: number) => {
      doc.setFont("times", "italic");
      doc.setFontSize(8);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
      doc.text(`Page ${pNum} | AI Legal Notice Generator | Confidential`, pageWidth / 2, pageHeight - 8, { align: 'center' });
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

    // Stamp at bottom
    if (formData.lawyerStamp) {
      if (cursorY > pageHeight - 55) {
        addFooter(pageCount);
        doc.addPage();
        pageCount++;
        cursorY = 25;
      }
      addImageToPdf(doc, formData.lawyerStamp, margin, cursorY + 5, 38, 38);
    }

    addFooter(pageCount);
    doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
  };

  // Format doc content for display with bold headings
  const renderFormattedContent = (content: string) => {
    if (!content) return null;
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
                sx={{ fontWeight: 600, textTransform: 'capitalize', fontSize: '0.95rem' }}
              />
            ))}
          </Tabs>
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
                          onClick={() => setEditMode(prev => ({ ...prev, [tab.id]: !prev[tab.id] }))}
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
                      {tab.id === 'whatsappMessage' && (
                        <Tooltip title="Share on WhatsApp">
                          <IconButton onClick={() => handleWhatsAppShare(tab.content)} size="small" sx={{ bgcolor: 'rgba(37,211,102,0.1)', borderRadius: 2 }}>
                            <Share2 size={18} color="#25d366" />
                          </IconButton>
                        </Tooltip>
                      )}

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
                      <Tooltip title="Download PDF (with Letterhead)">
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleDownloadPDF(tab.title, tab.content)}
                          startIcon={<Download size={16} />}
                          sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.75rem', background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)' }}
                        >
                          PDF
                        </Button>
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
                        onClick={() => setEditMode(prev => ({ ...prev, [tab.id]: false }))}>
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
                        {docs[tab.id] ? 'Refining draft...' : `Generating your ${tab.label.toLowerCase()}...`}
                      </Typography>
                    </Box>
                  ) : fetchError && !tab.content ? (
                    <Box textAlign="center">
                      <X size={32} color="#ef4444" style={{ marginBottom: 8 }} />
                      <Typography color="error" fontWeight={600}>{fetchError}</Typography>
                    </Box>
                  ) : editMode[tab.id] ? (
                    // ✏️ DIRECT EDIT MODE — full-height auto-resize textarea
                    <Box sx={{ p: 3 }}>
                      <textarea
                        autoFocus
                        value={docs[tab.id]}
                        onChange={(e) => setDocs(prev => ({ ...prev, [tab.id]: e.target.value }))}
                        style={{
                          width: '100%',
                          minHeight: '400px',
                          fontFamily: 'Georgia, Times New Roman, serif',
                          fontSize: '0.9rem',
                          lineHeight: '1.85',
                          color: theme.palette.mode === 'dark' ? '#e2e8f0' : '#1e293b',
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                          resize: 'vertical',
                          padding: 0,
                        }}
                      />
                    </Box>
                  ) : (
                    // 📄 FORMATTED VIEW MODE
                    <Box sx={{ p: 4 }}>
                      {/* ── LETTERHEAD (shown when logo/stamp present, Legal Notice tab only) ── */}
                      {tab.id === 'legalNotice' && (formData.lawyerLogo || formData.lawyerStamp) && (
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
