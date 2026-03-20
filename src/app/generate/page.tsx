'use client';
import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container, Typography, Box, Paper, Snackbar, Alert,
  CircularProgress, IconButton, Button, Avatar, Menu,
  MenuItem, ListItemIcon, Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from '@/theme/ThemeRegistry';
import NoticeForm, { NoticeFormData } from '@/components/NoticeForm';
import NoticeOutput from '@/components/NoticeOutput';
import { ShieldCheck, Scale, FileSignature, Sun, Moon, LogIn, UserCircle, LogOut, AlertTriangle } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function GeneratePage() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);

  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<{
    legalNotice?: string;
    whatsappMessage?: string;
    complaintDraft?: string;
  } | null>(null);
  const [lastFormData, setLastFormData] = useState<NoticeFormData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [minimized, setMinimized] = useState(false);

  const loadingMessages = [
    'Analyzing dispute and context...',
    'Identifying relevant Indian Laws (BNS 2023)...',
    'Checking legal precedents and deficiency patterns...',
    'Drafting your formal Legal Notice...',
    'Structuring the formal Court/Police complaint...',
    'Refining legal terminology and consequences...',
    'Finalizing all drafts for you...'
  ];

  const handleGenerate = async (formData: NoticeFormData) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    setGeneratedData(null);
    setLastFormData(formData);
    setProgress(5);
    setLoadingStep(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return Math.min(prev + Math.floor(Math.random() * 5) + 2, 95);
      });
    }, 1200);

    const messageInterval = setInterval(() => {
      setLoadingStep(prev => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 3000);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, targetDoc: 'legalNotice' }),
      });

      if (!res.ok) throw new Error('Failed to generate notices');
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setProgress(100);
      setGeneratedData({ legalNotice: data.legalNotice });
      setSuccessMsg('Legal Notice drafted successfully!');
      setMinimized(true);

      // Save to DB silently
      fetch('/api/save-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: data.legalNotice,
          type: 'legalNotice',
          language: formData.language || 'en',
          formData,
        })
      }).catch(() => {});

      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 300);

    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    }
  };

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: 2 }}>
        <CircularProgress size={24} />
        <Typography variant="body2" color="text.secondary">Loading secure session...</Typography>
      </Box>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will be redirected by useEffect
  }

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', pb: 10 }}>
      {/* User + Theme Toggle */}
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10, display: 'flex', gap: 1.5, alignItems: 'center' }}>
        {status === 'authenticated' ? (
          <>
            <IconButton onClick={handleProfileClick} sx={{ p: 0.5, border: '1px solid', borderColor: 'divider' }}>
              <Avatar src={session.user?.image || ''} sx={{ width: 32, height: 32, fontSize: '0.9rem' }}>
                {session.user?.name?.charAt(0)}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl} open={open} onClose={handleProfileClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{ sx: { mt: 1.5, borderRadius: 3, minWidth: 180 } }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" noWrap>{session.user?.name}</Typography>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                  {session.user?.email}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <MenuItem component={Link} href="/history" onClick={handleProfileClose}>
                <ListItemIcon><UserCircle size={18} /></ListItemIcon>
                My History
              </MenuItem>
              <MenuItem onClick={() => { handleProfileClose(); signOut(); }} sx={{ color: 'error.main' }}>
                <ListItemIcon><LogOut size={18} color={theme.palette.error.main} /></ListItemIcon>
                Sign Out
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            variant="text" startIcon={<LogIn size={18} />}
            onClick={() => signIn()} disabled={status === 'loading'}
            sx={{ borderRadius: 2, color: 'text.primary', display: { xs: 'none', sm: 'flex' } }}
          >
            Sign In
          </Button>
        )}

        <IconButton onClick={colorMode.toggleColorMode} color="inherit" disabled={loading} sx={{
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          border: '1px solid', borderColor: 'divider', backdropFilter: 'blur(10px)',
        }}>
          {theme.palette.mode === 'dark'
            ? <Sun size={20} color={theme.palette.primary.light} />
            : <Moon size={20} color={theme.palette.primary.main} />}
        </IconButton>
      </Box>

      {/* Background orb */}
      <Box sx={{
        position: 'absolute', top: '-15%', left: '-10%',
        width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0) 70%)',
        borderRadius: '50%', zIndex: -1,
      }} />

      <Container maxWidth="md" sx={{ pt: { xs: 8, md: 10 } }}>
        {!minimized && (
          <Box textAlign="center" mb={4} className="animate-fade-in">
            <Box display="flex" justifyContent="center" gap={2} mb={3}>
              <Box p={2} borderRadius="50%" bgcolor="rgba(99,102,241,0.1)" color="primary.main"><Scale size={32} /></Box>
              <Box p={2} borderRadius="50%" bgcolor="rgba(16,185,129,0.1)" color="success.main"><ShieldCheck size={32} /></Box>
              <Box p={2} borderRadius="50%" bgcolor="rgba(139,92,246,0.1)" color="secondary.main"><FileSignature size={32} /></Box>
            </Box>
            <Typography variant="h1" component="h1" sx={{
              fontWeight: 800, mb: 2,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)'
                : 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2rem', md: '4rem' }
            }}>
              AI Legal Notice Generator
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto', fontWeight: 400, opacity: 0.8 }}>
              Empowering individuals and SMEs across India. Instantly generate perfectly formatted legal notices with professional AI drafting.
            </Typography>

            {/* Disclaimer */}
            <Box sx={{
              mt: 4, mx: 'auto', maxWidth: 640, p: 2, borderRadius: 2.5,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(245,158,11,0.08)' : 'rgba(245,158,11,0.06)',
              border: '1px solid', borderColor: 'rgba(245,158,11,0.3)',
              display: 'flex', alignItems: 'flex-start', gap: 1.5, textAlign: 'left',
            }}>
              <AlertTriangle size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
              <Typography variant="caption" color="text.secondary" lineHeight={1.7}>
                <strong style={{ color: '#f59e0b' }}>Not Legal Advice.</strong>{' '}
                AI-generated documents are draft templates only. Always verify law sections and consult a qualified advocate.{' '}
                <Link href="/terms" style={{ color: '#6366f1', fontWeight: 600 }}>Terms</Link>
                {' · '}
                <Link href="/privacy" style={{ color: '#6366f1', fontWeight: 600 }}>Privacy</Link>
              </Typography>
            </Box>
          </Box>
        )}

        <Paper elevation={0} className="glass-panel animate-fade-in" sx={{
          p: minimized ? 2 : { xs: 3, md: 5 },
          borderRadius: 4, transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', mb: 4,
          border: '1px solid', borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant={minimized ? 'h6' : 'h5'} color="text.primary" fontWeight="600">
                {minimized ? 'Input Details (Review)' : 'Draft Your Notice'}
              </Typography>
              {!minimized && (
                <Typography variant="body2" color="text.secondary">
                  Fill in the details below. Our AI will automatically generate culturally and legally appropriate Indian drafts.
                </Typography>
              )}
            </Box>
            {minimized && (
              <Box component="button" onClick={() => setMinimized(false)} sx={{
                bgcolor: 'primary.main', color: 'white', px: 2, py: 1, borderRadius: 2,
                border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                '&:hover': { bgcolor: 'primary.dark' }
              }}>
                Edit Details
              </Box>
            )}
          </Box>
          <Box sx={{ mt: minimized ? 0 : 4 }}>
            {!minimized && (
              <NoticeForm onSubmit={handleGenerate} loading={loading} initialData={lastFormData || undefined} />
            )}
          </Box>
        </Paper>

        {loading && (
          <Box mt={6} display="flex" flexDirection="column" alignItems="center" className="animate-fade-in" sx={{ width: '100%' }}>
            <Box sx={{ width: '100%', mb: 4 }}>
              <Box sx={{ height: 10, width: '100%', bgcolor: 'rgba(99,102,241,0.08)', borderRadius: 5, overflow: 'hidden' }}>
                <Box sx={{
                  height: '100%', width: `${progress}%`,
                  background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
                  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)'
                }} />
              </Box>
              <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'right', fontWeight: 600, color: 'primary.main', opacity: 0.8 }}>
                {progress}% Completed
              </Typography>
            </Box>
            <Box p={4} borderRadius={4}
              bgcolor={theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)'}
              border="1px solid" borderColor="divider"
              sx={{ width: '100%', textAlign: 'center', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.08)', backdropFilter: 'blur(10px)' }}
            >
              <CircularProgress size={32} thickness={5} sx={{ color: 'primary.main', mb: 3 }} />
              <Typography variant="h6" color="text.primary" fontWeight={700} mb={1}>
                {loadingMessages[loadingStep]}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
                Our AI Senior Advocate is analyzing Indian Penal Code sections and formulating your official notice.
              </Typography>
            </Box>
          </Box>
        )}

        {generatedData && !loading && lastFormData && minimized && (
          <Box mt={5}>
            <NoticeOutput initialData={generatedData} formData={lastFormData} />
          </Box>
        )}
      </Container>

      <Snackbar open={!!error || !!successMsg} autoHideDuration={6000}
        onClose={() => { setError(null); setSuccessMsg(null); }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={error ? 'error' : 'success'}
          onClose={() => { setError(null); setSuccessMsg(null); }}
          sx={{ width: '100%', borderRadius: 2, fontWeight: 500 }} variant="filled">
          {error || successMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
