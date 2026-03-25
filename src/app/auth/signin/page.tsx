"use client"

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Typography, Button, Container, Card, CircularProgress } from '@mui/material';
import { signIn } from 'next-auth/react';
import { Scale, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <Suspense fallback={
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    }>
      <SignInContent />
    </Suspense>
  );
}

function SignInContent() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const handleSignIn = (provider: string) => {
    setLoadingProvider(provider);
    signIn(provider, { callbackUrl });
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3,
      background: isDark
        ? 'linear-gradient(135deg, #0a0b10 0%, #171923 100%)'
        : 'linear-gradient(135deg, #f0f2ff 0%, #ffffff 100%)',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Decorative Orbs */}
      <Box sx={{ position: 'absolute', top: '-10%', right: '-5%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }} />
      <Box sx={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '30vw', height: '30vw', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }} />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1, px: 0 }}>
        <Card sx={{
          p: { xs: 4, sm: 5 }, borderRadius: 5,
          border: '1px solid', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          bgcolor: isDark ? 'rgba(18,20,28,0.7)' : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)', boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
        }}>
          {/* Logo & Header */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
            <Box sx={{
              width: 56, height: 56, borderRadius: 3, mb: 3,
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(79,70,229,0.3)', color: 'white'
            }}>
              <Scale size={32} />
            </Box>
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.02em', mb: 1, textAlign: 'center' }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Sign in to save and manage your legal documents securely.
            </Typography>
          </Box>

          {/* Social Sign In Buttons */}
          <Box display="flex" flexDirection="column" gap={2}>
            {/* GOOGLE */}
            <Button
              fullWidth
              onClick={() => handleSignIn('google')}
              disabled={!!loadingProvider}
              sx={{
                py: 1.5, px: 2, borderRadius: 3,
                bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                color: 'text.primary', border: '1px solid',
                borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                fontWeight: 600, fontSize: '0.95rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5,
                textTransform: 'none', transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#f8fafc',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.06)'
                }
              }}
            >
              {loadingProvider === 'google' ? <CircularProgress size={24} color="inherit" /> : (
                <>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.37 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.72 17.57V20.34H19.29C21.37 18.42 22.56 15.58 22.56 12.25Z" fill="#4285F4"/>
                    <path d="M12 23C14.97 23 17.46 22.02 19.29 20.34L15.72 17.57C14.73 18.23 13.48 18.63 12 18.63C9.13 18.63 6.7 16.69 5.81 14.07H2.12V16.94C3.94 20.55 7.68 23 12 23Z" fill="#34A853"/>
                    <path d="M5.81 14.07C5.58 13.39 5.45 12.67 5.45 11.93C5.45 11.19 5.58 10.47 5.81 9.79V6.92H2.12C1.37 8.42 0.95 10.12 0.95 11.93C0.95 13.74 1.37 15.44 2.12 16.94L5.81 14.07Z" fill="#FBBC05"/>
                    <path d="M12 5.23C13.62 5.23 15.06 5.79 16.2 6.88L19.38 3.7C17.45 1.9 14.97 0.83 12 0.83C7.68 0.83 3.94 3.32 2.12 6.92L5.81 9.79C6.7 7.17 9.13 5.23 12 5.23Z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>
          </Box>

          {/* Privacy Note */}
          <Box display="flex" alignItems="center" gap={1} mt={4} justifyContent="center" sx={{ opacity: 0.7 }}>
            <ShieldCheck size={16} />
            <Typography variant="caption" fontWeight={600}>
              256-bit encrypted & secure
            </Typography>
          </Box>
        </Card>

        {/* Back navigation */}
        <Box mt={4} textAlign="center">
          <Button component={Link} href="/dashboard" startIcon={<ArrowLeft size={16} />} sx={{ color: 'text.secondary', fontWeight: 600, '&:hover': { color: 'text.primary' } }}>
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
