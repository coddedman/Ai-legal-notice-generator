'use client';

import { useState, useRef } from 'react';
import { Box, Typography, Button, TextField, CircularProgress, Paper, Divider, Snackbar, Alert } from '@mui/material';
import { UploadCloud, Sparkles, ArrowLeft, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import GuestBanner from '@/components/GuestBanner';

export default function UploadPDFPage() {
  const { status } = useSession();
  const isGuest = status === 'unauthenticated';
  const [extractedText, setExtractedText] = useState('');
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file || file.type !== 'application/pdf') { setError('Please upload a valid PDF file.'); return; }
    setFileName(file.name);
    setError('Tip: Paste the document text below for best results.');
  };

  const handleAnalyze = async () => {
    if (isGuest) { signIn(); return; }
    if (!extractedText.trim()) { setError('Please paste or provide the document text first.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: `Analyze the following legal document and ${question.trim() ? `answer this question: ${question}` : 'summarize key points, obligations, rights, risks, and applicable Indian law citations.'}\n\nDOCUMENT TEXT:\n${extractedText.slice(0, 6000)}`,
          targetDoc: 'legalNotice', language: 'en', useBNS: false,
        }),
      });
      if (!res.ok) throw new Error('Analysis failed');
      const data = await res.json();
      setResult(data.legalNotice || Object.values(data)[0] as string || '');
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {isGuest && <GuestBanner />}
      <Box sx={{ maxWidth: 960, mx: 'auto', p: { xs: 3, md: 5 }, width: '100%' }}>
        <Button component={Link} href={isGuest ? '/generate' : '/dashboard'} startIcon={<ArrowLeft size={16} />}
          sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 600, mb: 3, pl: 0 }}>
          {isGuest ? 'Back to Drafting' : 'Back to Dashboard'}
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UploadCloud size={22} color="#16a34a" />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>Upload & Analyze Document</Typography>
            <Typography variant="body2" color="text.secondary">Paste or upload document text — AI summarizes, flags risks & cites Indian law</Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 3 }} />

        <Box onClick={() => fileRef.current?.click()}
          sx={{ border: '2px dashed #c7d2fe', borderRadius: '12px', p: 4, mb: 3, textAlign: 'center', cursor: 'pointer', bgcolor: '#f5f3ff', transition: 'all 0.2s', '&:hover': { borderColor: '#4f46e5', bgcolor: '#ede9fe' } }}>
          <UploadCloud size={32} color="#6d28d9" />
          <Typography variant="body1" fontWeight={700} mt={1} color="#6d28d9">{fileName || 'Click to upload PDF'}</Typography>
          <Typography variant="caption" color="text.secondary">PDF files only · Max 10 MB</Typography>
          <input ref={fileRef} type="file" accept="application/pdf" hidden onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </Box>

        <Typography variant="subtitle2" fontWeight={700} mb={1}>Paste Document Text</Typography>
        <TextField fullWidth multiline rows={6} size="small"
          placeholder="Paste the full text of your legal document here (contract, FIR, court order, notice, etc.)..."
          value={extractedText} onChange={e => setExtractedText(e.target.value)}
          sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />

        <Typography variant="subtitle2" fontWeight={700} mb={1}>Specific Question <Box component="span" sx={{ color: 'text.disabled', fontWeight: 400 }}>(optional)</Box></Typography>
        <TextField fullWidth size="small"
          placeholder="e.g., Is this rent agreement valid under the Transfer of Property Act? What are the tenant's rights?"
          value={question} onChange={e => setQuestion(e.target.value)}
          sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />

        <Button fullWidth variant="contained" size="large" onClick={handleAnalyze}
          disabled={loading || !extractedText.trim()}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Sparkles size={18} />}
          sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, py: 1.4, bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' }, mb: 4 }}>
          {isGuest ? 'Sign In to Analyze' : loading ? 'Analyzing...' : 'Analyze Document'}
        </Button>

        {result && (
          <Paper sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: 'none' }}>
            <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" fontWeight={700}>AI Analysis</Typography>
              <Button size="small" startIcon={copied ? <Check size={14} /> : <Copy size={14} />}
                onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}>
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </Box>
            <Box sx={{ p: 3, fontFamily: 'Georgia, serif', fontSize: '0.95rem', lineHeight: 1.8, maxHeight: '60vh', overflowY: 'auto', whiteSpace: 'pre-wrap', color: '#1e293b' }}>
              {result}
            </Box>
          </Paper>
        )}
      </Box>
      <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="info">{error}</Alert>
      </Snackbar>
    </Box>
  );
}
