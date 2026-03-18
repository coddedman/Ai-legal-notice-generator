'use client';

import React, { useState, useContext } from 'react';
import { Container, Typography, Box, Paper, Snackbar, Alert, CircularProgress, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from '@/theme/ThemeRegistry';
import NoticeForm, { NoticeFormData } from '@/components/NoticeForm';
import NoticeOutput from '@/components/NoticeOutput';
import { ShieldCheck, Scale, FileSignature, Sun, Moon } from 'lucide-react';

export default function Home() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  
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

  const loadingMessages = [
    "Analyzing dispute and context...",
    "Identifying relevant Indian Laws (IPC, Section 420, Consumer Act)...",
    "Checking legal precedents and deficiency patterns...",
    "Drafting your formal Legal Notice...",
    "Drafting first-person WhatsApp demand...",
    "Structuring the formal Court/Police complaint...",
    "Refining legal terminology and consequences...",
    "Finalizing all drafts for you..."
  ];

  const handleGenerate = async (formData: NoticeFormData) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    setGeneratedData(null);
    setLastFormData(formData);
    setProgress(5);
    setLoadingStep(0);
    
    // Simulate progress while waiting for AI
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        const jump = Math.floor(Math.random() * 5) + 2;
        return Math.min(prev + jump, 95);
      });
    }, 1200);

    const messageInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 3000);
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, targetDoc: 'legalNotice' }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate notices');
      }

      const data = await res.json();
      if (data.error) {
         throw new Error(data.error);
      }
      
      setProgress(100);
      setGeneratedData({ legalNotice: data.legalNotice });
      setSuccessMsg('Legal Notice drafted successfully! Other drafts will load on click.');
      
      // Scroll to result smoothly
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

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', pb: 10 }}>
      {/* Theme Toggle Button */}
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
        <IconButton onClick={colorMode.toggleColorMode} color="inherit" disabled={loading} sx={{ 
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            border: '1px solid',
            borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
            '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
          }}>
          {theme.palette.mode === 'dark' ? <Sun size={20} color={theme.palette.primary.light} /> : <Moon size={20} color={theme.palette.primary.main} />}
        </IconButton>
      </Box>

      {/* Background Orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0) 70%)',
          borderRadius: '50%',
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(139,92,246,0) 70%)',
          borderRadius: '50%',
          zIndex: -1,
        }}
      />
      
      <Container maxWidth="md" sx={{ pt: { xs: 8, md: 12 } }}>
        <Box textAlign="center" mb={6} className="animate-fade-in">
          <Box display="flex" justifyContent="center" gap={2} mb={3}>
            <Box p={2} borderRadius="50%" bgcolor="rgba(99,102,241,0.1)" color="primary.main">
               <Scale size={32} />
            </Box>
            <Box p={2} borderRadius="50%" bgcolor="rgba(16,185,129,0.1)" color="success.main">
               <ShieldCheck size={32} />
            </Box>
            <Box p={2} borderRadius="50%" bgcolor="rgba(139,92,246,0.1)" color="secondary.main">
               <FileSignature size={32} />
            </Box>
          </Box>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)' : 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.5rem', md: '4rem' }
            }}
          >
            AI Legal Notice Generator
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto', fontWeight: 400, opacity: 0.8 }}>
            Empowering individuals and SMEs across India. Instantly generate perfectly formatted
            legal notices, consumer court complaints, and WhatsApp demands.
          </Typography>
        </Box>

        <Paper 
          elevation={0}
          className="glass-panel animate-fade-in"
          sx={{ 
            p: { xs: 3, md: 5 }, 
            borderRadius: 4,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
            }
          }}
        >
          <Typography variant="h5" color="text.primary" fontWeight="600" mb={1} display="flex" alignItems="center" gap={1}>
             Draft Your Notice
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Fill in the details below. Our AI will automatically generate culturally and legally appropriate Indian drafts for you.
          </Typography>
          
          <NoticeForm onSubmit={handleGenerate} loading={loading} />
        </Paper>

        {loading && (
          <Box mt={6} display="flex" flexDirection="column" alignItems="center" className="animate-fade-in" sx={{ width: '100%' }}>
            <Box sx={{ width: '100%', mb: 4, position: 'relative' }}>
               <Box 
                 sx={{ 
                   height: 10, 
                   width: '100%', 
                   bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                   borderRadius: 5,
                   overflow: 'hidden'
                 }}
               >
                 <Box 
                   sx={{ 
                     height: '100%', 
                     width: `${progress}%`, 
                     background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
                     transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                     boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)'
                   }} 
                 />
               </Box>
               <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'right', fontWeight: 600, color: 'primary.main', opacity: 0.8 }}>
                 {progress}% Completed
               </Typography>
            </Box>

            <Box 
              p={4} 
              borderRadius={4} 
              bgcolor={theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)'} 
              border="1px solid" 
              borderColor="divider"
              sx={{ 
                width: '100%', 
                textAlign: 'center',
                boxShadow: theme.palette.mode === 'dark' ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(99, 102, 241, 0.05)',
                backdropFilter: 'blur(10px)'
              }}
            >
               <CircularProgress size={32} thickness={5} sx={{ color: 'primary.main', mb: 3 }} />
               <Typography variant="h6" color="text.primary" fontWeight={700} mb={1}>
                 {loadingMessages[loadingStep]}
               </Typography>
               <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
                 Our AI Senior Advocate is analyzing Indian Penal Code sections and formulating your official notice. 
                 This usually takes 20-40 seconds for high-precision legal drafting.
               </Typography>
            </Box>
          </Box>
        )}

        {generatedData && !loading && lastFormData && (
          <Box mt={5}>
            <NoticeOutput initialData={generatedData} formData={lastFormData} />
          </Box>
        )}
      </Container>
      
      <Snackbar open={!!error || !!successMsg} autoHideDuration={6000} onClose={() => { setError(null); setSuccessMsg(null); }} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert 
          severity={error ? "error" : "success"} 
          onClose={() => { setError(null); setSuccessMsg(null); }} 
          sx={{ width: '100%', borderRadius: 2, fontWeight: 500 }}
          variant="filled"
        >
          {error || successMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
