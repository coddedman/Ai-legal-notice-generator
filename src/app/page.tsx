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
    legalNotice: string;
    whatsappMessage: string;
    complaintDraft: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleGenerate = async (formData: NoticeFormData) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    setGeneratedData(null);
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to generate notices');
      }

      const data = await res.json();
      if (data.error) {
         throw new Error(data.error);
      }
      
      setGeneratedData(data);
      setSuccessMsg('Legal Notice drafted successfully!');
      
      // Scroll to result smoothly
      setTimeout(() => {
         window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 300);
      
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', pb: 10 }}>
      {/* Theme Toggle Button */}
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
        <IconButton onClick={colorMode.toggleColorMode} color="inherit" sx={{ 
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
          <Box mt={6} display="flex" flexDirection="column" alignItems="center" className="animate-fade-in">
            <CircularProgress size={40} thickness={4} sx={{ color: 'primary.main', mb: 3 }} />
            <Box p={3} borderRadius={3} bgcolor={theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.02)'} border="1px solid" borderColor="divider">
               <Typography variant="h6" color="text.primary" fontWeight={600} mb={1}>
                 Drafting Official Notice
               </Typography>
               <Typography variant="body2" color="text.secondary">
                 Our AI is formulating the exact legal terminology and consequences based on your detailed input...
               </Typography>
            </Box>
          </Box>
        )}

        {generatedData && !loading && (
          <Box mt={5}>
            <NoticeOutput data={generatedData} />
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
