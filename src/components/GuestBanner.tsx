'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Sparkles } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function GuestBanner() {
  return (
    <Box sx={{
      bgcolor: '#1e1b4b',
      px: { xs: 2, md: 4 },
      py: 1.2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 1,
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#818cf8', flexShrink: 0 }} />
        <Typography sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>
          You&apos;re browsing as a guest. Sign in to save your work &amp; unlock all features.
        </Typography>
      </Box>
      <Button
        size="small"
        variant="contained"
        onClick={() => signIn()}
        startIcon={<Sparkles size={14} />}
        sx={{
          borderRadius: '8px', textTransform: 'none', fontWeight: 700,
          fontSize: '0.8rem', px: 2, py: 0.6,
          bgcolor: '#4f46e5', boxShadow: 'none',
          '&:hover': { bgcolor: '#4338ca' },
        }}
      >
        Sign In Free
      </Button>
    </Box>
  );
}
