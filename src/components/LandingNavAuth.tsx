"use client"

import { Button } from '@mui/material';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';

/** Tiny client island — only the auth buttons need client-side session */
export default function LandingNavAuth() {
  const { status } = useSession();

  if (status === 'authenticated') {
    return (
      <Button component={Link} href="/dashboard" variant="contained" size="small"
        sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, boxShadow: 'none', '&:hover': { opacity: 0.9 } }}>
        Go to Dashboard
      </Button>
    );
  }

  return (
    <>
      <Button size="small" variant="text" onClick={() => signIn()}
        sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
        Sign In
      </Button>
      <Button component={Link} href="/dashboard" variant="contained" size="small"
        sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, boxShadow: 'none', '&:hover': { opacity: 0.9 } }}>
        Try Free →
      </Button>
    </>
  );
}
