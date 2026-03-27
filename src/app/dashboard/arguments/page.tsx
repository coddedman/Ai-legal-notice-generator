'use client';

import { useState } from 'react';
import { Box, Typography, Button, TextField, CircularProgress, Paper, Divider, ToggleButtonGroup, ToggleButton, Snackbar, Alert } from '@mui/material';
import { ShieldCheck, Sparkles, Copy, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import GuestBanner from '@/components/GuestBanner';

const SIDES = [
  { value: 'prosecution', label: 'Prosecution / Petitioner' },
  { value: 'defence', label: 'Defence / Respondent' },
  { value: 'both', label: 'Both Sides' },
];

export default function BuildArgumentsPage() {
  const { status } = useSession();
  const isGuest = status === 'unauthenticated';
  const [caseDesc, setCaseDesc] = useState('');
  const [side, setSide] = useState('prosecution');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (isGuest) { signIn(); return; }
    if (!caseDesc.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: `Build legal arguments for the following case.\n\nSIDE: ${side.toUpperCase()}\n\nCASE DETAILS:\n${caseDesc}\n\nProvide structured arguments with applicable sections of Indian law (BNS/CPC/IEA), precedents if relevant, and legal reasoning.`,
          targetDoc: 'legalNotice', language: 'en', useBNS: true,
        }),
      });
      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      setResult(data.legalNotice || Object.values(data)[0] as string || '');
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
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
          <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={22} color="#d97706" />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>Build Arguments</Typography>
            <Typography variant="body2" color="text.secondary">Generate structured legal arguments with Indian law citations</Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" fontWeight={700} mb={1.5}>Argue for</Typography>
            <ToggleButtonGroup value={side} exclusive onChange={(_, v) => v && setSide(v)} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
              {SIDES.map(s => (
                <ToggleButton key={s.value} value={s.value}
                  sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.82rem', borderRadius: '8px !important', border: '1px solid #e2e8f0 !important', px: 2,
                    '&.Mui-selected': { bgcolor: '#1e1b4b', color: 'white', borderColor: '#1e1b4b !important' } }}>
                  {s.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            <Typography variant="subtitle2" fontWeight={700} mb={1}>Case Description</Typography>
            <TextField fullWidth multiline rows={7} size="small"
              placeholder="Describe the case — parties, dispute, key facts, relevant charges/sections, and what outcome you are arguing for..."
              value={caseDesc} onChange={e => setCaseDesc(e.target.value)}
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />

            <Button fullWidth variant="contained" size="large" onClick={handleGenerate}
              disabled={loading || !caseDesc.trim()}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Sparkles size={18} />}
              sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, py: 1.4, bgcolor: '#d97706', '&:hover': { bgcolor: '#b45309' } }}>
              {isGuest ? 'Sign In to Build Arguments' : loading ? 'Building Arguments...' : 'Generate Arguments'}
            </Button>
          </Box>

          {result && (
            <Paper sx={{ flex: 1.2, borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: 'none' }}>
              <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" fontWeight={700}>Legal Arguments</Typography>
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
