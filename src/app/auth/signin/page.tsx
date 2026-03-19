"use client"

import React, { useState } from 'react';
import { Box, Typography, Button, Container, Card, CircularProgress } from '@mui/material';
import { signIn } from 'next-auth/react';
import { Scale, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';

export default function SignInPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleSignIn = (provider: string) => {
    setLoadingProvider(provider);
    signIn(provider, { callbackUrl: '/dashboard' });
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

            {/* GITHUB */}
            <Button
              fullWidth
              onClick={() => handleSignIn('github')}
              disabled={!!loadingProvider}
              sx={{
                py: 1.5, px: 2, borderRadius: 3,
                bgcolor: '#24292e', color: '#ffffff',
                border: '1px solid', borderColor: '#24292e',
                fontWeight: 600, fontSize: '0.95rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5,
                textTransform: 'none', transition: 'all 0.2s',
                '&:hover': { bgcolor: '#1b1f23', transform: 'translateY(-2px)', boxShadow: '0 6px 16px rgba(0,0,0,0.1)' }
              }}
            >
              {loadingProvider === 'github' ? <CircularProgress size={24} color="inherit" /> : (
                <>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 19.725 8.838 20.91C9.338 21.002 9.52 20.693 9.52 20.435C9.52 20.205 9.511 19.664 9.506 18.948C6.726 19.552 6.139 17.608 6.139 17.608C5.684 16.452 5.029 16.145 5.029 16.145C4.122 15.526 5.097 15.539 5.097 15.539C6.1 15.609 6.627 16.568 6.627 16.568C7.518 18.094 8.966 17.653 9.54 17.394C9.63 16.742 9.892 16.3 10.182 16.046C7.962 15.793 5.63 14.935 5.63 11.196C5.63 10.132 6.01 9.262 6.627 8.572C6.527 8.318 6.19 7.33 6.722 5.968C6.722 5.968 7.535 5.708 9.506 7.043C10.278 6.828 11.109 6.72 11.936 6.716C12.763 6.72 13.593 6.828 14.366 7.043C16.336 5.708 17.148 5.968 17.148 5.968C17.681 7.33 17.344 8.318 17.245 8.572C17.863 9.262 18.242 10.132 18.242 11.196C18.242 14.95 15.908 15.79 13.682 16.038C14.045 16.352 14.369 16.971 14.369 17.925C14.369 19.294 14.357 20.395 14.357 20.435C14.357 20.695 14.538 21.006 15.044 20.91C19.015 19.723 21.879 16.417 21.879 12C21.879 6.477 17.402 2 11.936 2H12Z" />
                  </svg>
                  Continue with GitHub
                </>
              )}
            </Button>

            {/* DISCORD */}
            <Button
              fullWidth
              onClick={() => handleSignIn('discord')}
              disabled={!!loadingProvider}
              sx={{
                py: 1.5, px: 2, borderRadius: 3,
                bgcolor: '#5865F2', color: '#ffffff',
                border: '1px solid', borderColor: '#5865F2',
                fontWeight: 600, fontSize: '0.95rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5,
                textTransform: 'none', transition: 'all 0.2s',
                '&:hover': { bgcolor: '#4752C4', transform: 'translateY(-2px)', boxShadow: '0 6px 16px rgba(88,101,242,0.3)' }
              }}
            >
              {loadingProvider === 'discord' ? <CircularProgress size={24} color="inherit" /> : (
                <>
                  <svg width="22" height="22" viewBox="0 0 127.14 96.36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.08 0 72.37 72.37 0 0 0-3.36-6.83 105.15 105.15 0 0 0-26.23 8.07C2.86 32.55-3.08 56.41 1.05 80a105.73 105.73 0 0 0 32.17 16.36 77.7 77.7 0 0 0 6.89-11.23 68.42 68.42 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2a75.57 75.57 0 0 0 64.32 0c.87.71 1.76 1.39 2.66 2a68.68 68.68 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.22A105.25 105.25 0 0 0 126.1 80c4.85-28.53-2.61-51.52-18.4-71.93ZM42.49 65.16c-5.36 0-9.76-4.88-9.76-10.88s4.35-10.88 9.76-10.88c5.44 0 9.8 4.91 9.76 10.88 0 6-4.32 10.88-9.76 10.88Zm42.16 0c-5.36 0-9.76-4.88-9.76-10.88s4.35-10.88 9.76-10.88c5.44 0 9.8 4.91 9.76 10.88 0 6-4.32 10.88-9.76 10.88Z" />
                  </svg>
                  Continue with Discord
                </>
              )}
            </Button>

            {/* TWITTER / X */}
            <Button
              fullWidth
              onClick={() => handleSignIn('twitter')}
              disabled={!!loadingProvider}
              sx={{
                py: 1.5, px: 2, borderRadius: 3,
                bgcolor: '#000000', color: '#ffffff',
                border: '1px solid', borderColor: '#000000',
                fontWeight: 600, fontSize: '0.95rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5,
                textTransform: 'none', transition: 'all 0.2s',
                '&:hover': { bgcolor: '#222222', transform: 'translateY(-2px)', boxShadow: '0 6px 16px rgba(0,0,0,0.1)' }
              }}
            >
              {loadingProvider === 'twitter' ? <CircularProgress size={24} color="inherit" /> : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Continue with X / Twitter
                </>
              )}
            </Button>

            {/* APPLE */}
            <Button
              fullWidth
              onClick={() => handleSignIn('apple')}
              disabled={!!loadingProvider}
              sx={{
                py: 1.5, px: 2, borderRadius: 3,
                bgcolor: isDark ? '#ffffff' : '#000000',
                color: isDark ? '#000000' : '#ffffff',
                border: '1px solid', borderColor: isDark ? '#ffffff' : '#000000',
                fontWeight: 600, fontSize: '0.95rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5,
                textTransform: 'none', transition: 'all 0.2s',
                '&:hover': { 
                  bgcolor: isDark ? '#e2e8f0' : '#222222', 
                  transform: 'translateY(-2px)', 
                  boxShadow: isDark ? '0 6px 16px rgba(255,255,255,0.1)' : '0 6px 16px rgba(0,0,0,0.1)' 
                }
              }}
            >
              {loadingProvider === 'apple' ? <CircularProgress size={24} color="inherit" /> : (
                <>
                  <svg width="22" height="22" viewBox="0 0 384 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.3 49.7-1.1 90.7-84.2 102.3-120.3-69.3-26.7-61.9-106.8-61.4-106.3zM286.4 75.7c31.1-40.2 12.8-82.6 10.6-85.7-27.5 1.7-68 18.2-87.7 41.7-14.4 16.7-33 46.1-27.2 82.6 30.6 3.3 67.5-12.8 104.3-38.6z"/>
                  </svg>
                  Continue with Apple
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
