'use client';

import { useState } from 'react';
import { Box, Typography, Button, TextField, CircularProgress, Paper, Divider, Chip, Alert, Snackbar } from '@mui/material';
import { FileText, Sparkles, Copy, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import GuestBanner from '@/components/GuestBanner';

export default function LegalMemoPage() {
  const { status } = useSession();
  const isGuest = status === 'unauthenticated';
  const [subject, setSubject] = useState('');
  const [facts, setFacts] = useState('');
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (isGuest) { signIn(); return; }
    if (!subject.trim() || !facts.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: `Draft a professional legal memo.\n\nSUBJECT: ${subject}\n\nFACTS: ${facts}\n\nQUESTION OF LAW: ${question || 'Not specified'}`,
          targetDoc: 'legalNotice', language: 'en', useBNS: false,
        }),
      });
      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      setResult(data.legalNotice || Object.values(data)[0] as string || '');
    } catch (e: any) { setError(e.message || 'Something went wrong'); } finally { setLoading(false); }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {isGuest && <GuestBanner />}
      <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 3, md: 5 }, width: '100%' }}>
        <Button component={Link} href={isGuest ? '/generate' : '/dashboard'} startIcon={<ArrowLeft size={16} />}
          sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 600, mb: 3, pl: 0 }}>
          {isGuest ? 'Back to Drafting' : 'Back to Dashboard'}
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={22} color="#7c3aed" />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>Legal Memo</Typography>
            <Typography variant="body2" color="text.secondary">AI-drafted memoranda of law for case research & advocacy</Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" fontWeight={700} mb={1}>Subject / Re:</Typography>
            <TextField fullWidth size="small" placeholder="e.g., Maintainability of a writ petition under Article 226 for service matters"
              value={subject} onChange={e => setSubject(e.target.value)}
              sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />

            <Typography variant="subtitle2" fontWeight={700} mb={1}>Facts of the Case</Typography>
            <TextField fullWidth multiline rows={5} size="small"
              placeholder="Describe the relevant facts, parties involved, and background..."
              value={facts} onChange={e => setFacts(e.target.value)}
              sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />

            <Typography variant="subtitle2" fontWeight={700} mb={1}>
              Question of Law <Chip label="Optional" size="small" sx={{ ml: 1, fontSize: '0.7rem', height: 20 }} />
            </Typography>
            <TextField fullWidth size="small" placeholder="e.g., Whether the employer can terminate without notice during probation?"
              value={question} onChange={e => setQuestion(e.target.value)}
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />

            <Button fullWidth variant="contained" size="large" onClick={handleGenerate}
              disabled={loading || !subject.trim() || !facts.trim()}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Sparkles size={18} />}
              sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, py: 1.4, bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}>
              {isGuest ? 'Sign In to Generate Memo' : loading ? 'Drafting Memo...' : 'Generate Legal Memo'}
            </Button>
          </Box>

          {result && (
            <Paper sx={{ flex: 1.2, borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: 'none' }}>
              <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" fontWeight={700}>Generated Memo</Typography>
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
      </Box>
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
}
