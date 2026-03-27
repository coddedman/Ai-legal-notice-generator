'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, TextField, CircularProgress, Paper, Divider, Snackbar, Alert, Chip } from '@mui/material';
import { Search, Sparkles, ArrowLeft, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import GuestBanner from '@/components/GuestBanner';

const QUICK_QUERIES = [
  'What is the limitation period for filing a civil suit in India?',
  'What are the grounds for bail under BNSS 2023?',
  'How to file a consumer complaint under Consumer Protection Act 2019?',
  'What are the rights of an arrested person under BNSS?',
  'What is the procedure for filing a writ petition in High Court?',
];

export default function ResearchPage() {
  const { status } = useSession();
  const isGuest = status === 'unauthenticated';
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleResearch = async (q?: string) => {
    if (isGuest) { signIn(); return; }
    const finalQuery = q || query;
    if (!finalQuery.trim()) return;
    if (q) setQuery(q);
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: `Legal Research Query:\n\n${finalQuery}\n\nProvide a comprehensive legal analysis citing relevant Indian statutes (BNS 2023, BNSS 2023, CPC, IEA, specific Acts), landmark Supreme Court and High Court cases, and practical advice for an advocate or litigant in India.`,
          targetDoc: 'legalNotice', language: 'en', useBNS: true,
        }),
      });
      if (!res.ok) throw new Error('Research failed');
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
          <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Search size={22} color="#0284c7" />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>Legal Research</Typography>
            <Typography variant="body2" color="text.secondary">Ask any legal question — get citations, case laws & practical guidance under Indian law</Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 3 }} />

        <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ letterSpacing: '0.08em', mb: 1.5, display: 'block' }}>
          Quick Questions
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {QUICK_QUERIES.map(q => (
            <Chip key={q} label={q} onClick={() => handleResearch(q)} clickable
              sx={{ fontSize: '0.78rem', fontWeight: 600, borderRadius: '8px', border: '1px solid #e2e8f0', bgcolor: 'white', '&:hover': { bgcolor: '#ede9fe', borderColor: '#c4b5fd' } }} />
          ))}
        </Box>

        <Typography variant="subtitle2" fontWeight={700} mb={1}>Your Legal Question</Typography>
        <TextField fullWidth multiline rows={4} size="small"
          placeholder="e.g., What is the process to challenge a Section 9 arbitration petition? What remedies are available under the Arbitration Act 1996?"
          value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey && !isGuest) handleResearch(); }}
          sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />

        <Button fullWidth variant="contained" size="large" onClick={() => handleResearch()}
          disabled={loading || (!isGuest && !query.trim())}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Sparkles size={18} />}
          sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, py: 1.4, bgcolor: '#0284c7', '&:hover': { bgcolor: '#0369a1' }, mb: 4 }}>
          {isGuest ? 'Sign In to Research' : loading ? 'Researching...' : 'Research This Question'}
        </Button>

        {result && (
          <Paper sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: 'none' }}>
            <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" fontWeight={700}>Research Results</Typography>
              <Button size="small" startIcon={copied ? <Check size={14} /> : <Copy size={14} />}
                onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}>
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </Box>
            <Box sx={{ p: 3, fontFamily: 'Georgia, serif', fontSize: '0.95rem', lineHeight: 1.8, maxHeight: '65vh', overflowY: 'auto', whiteSpace: 'pre-wrap', color: '#1e293b' }}>
              {result}
            </Box>
          </Paper>
        )}
      </Box>
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
}
