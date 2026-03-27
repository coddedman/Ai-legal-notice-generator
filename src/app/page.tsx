"use client"

import React from 'react';
import { Box, Typography, Button, Container, Grid, Chip } from '@mui/material';
import { ArrowRight, Sparkles, Scale, BookOpen, Clock, Shield, FileText, Search } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';
import { useSession, signIn } from 'next-auth/react';

export default function LandingPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { data: session, status } = useSession();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── NAVBAR ────────────────────────────────────────────────────────── */}
      <Box
        component="nav"
        sx={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          px: { xs: 3, md: 6 }, py: 1.5,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          bgcolor: isDark ? 'rgba(15,12,41,0.85)' : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid',
          borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box sx={{
            width: 34, height: 34, borderRadius: '9px',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Scale size={18} color="white" />
          </Box>
          <Typography fontWeight={800} fontSize="1.1rem" sx={{ color: 'text.primary', letterSpacing: '-0.02em' }}>
            My Legal Notice
          </Typography>
        </Box>

        {/* Nav links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
          {['Features', 'Templates', 'Pricing'].map(item => (
            <Typography
              key={item}
              component={Link}
              href={item === 'Templates' ? '/dashboard/templates' : '#'}
              variant="body2"
              fontWeight={600}
              sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: '#4f46e5' }, transition: 'color 0.15s' }}
            >
              {item}
            </Typography>
          ))}
        </Box>

        {/* Auth CTA */}
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          {status === 'authenticated' ? (
            <Button
              component={Link}
              href="/dashboard"
              variant="contained"
              size="small"
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' }, boxShadow: 'none' }}
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button
                size="small"
                variant="text"
                onClick={() => signIn()}
                sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
              >
                Sign In
              </Button>
              <Button
                component={Link}
                href="/generate"
                variant="contained"
                size="small"
                sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' }, boxShadow: 'none' }}
              >
                Try Free
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDark
          ? 'linear-gradient(135deg, rgba(79,70,229,0.08) 0%, rgba(236,72,153,0.05) 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
        pt: { xs: 16, md: 24 },
        pb: { xs: 10, md: 16 },
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow blobs */}
        <Box sx={{ position: 'absolute', top: '10%', left: '20%', width: { xs: 200, md: 400 }, height: { xs: 200, md: 400 }, bgcolor: 'rgba(79,70,229,0.15)', borderRadius: '50%', filter: 'blur(100px)', zIndex: 0 }} />
        <Box sx={{ position: 'absolute', bottom: '10%', right: '20%', width: { xs: 200, md: 400 }, height: { xs: 200, md: 400 }, bgcolor: 'rgba(236,72,153,0.15)', borderRadius: '50%', filter: 'blur(100px)', zIndex: 0 }} />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1, px: 2.5, py: 1,
            borderRadius: '999px', bgcolor: 'rgba(79,70,229,0.1)', mb: 4,
            border: '1px solid rgba(79,70,229,0.2)',
          }}>
            <Sparkles size={16} color="#4f46e5" />
            <Typography variant="body2" fontWeight={600} color="#4f46e5">
              The AI Co-Pilot for Indian Advocates
            </Typography>
          </Box>

          <Typography variant="h2" fontWeight={900} sx={{
            color: 'text.primary',
            letterSpacing: '-0.04em',
            mb: 3,
            lineHeight: 1.1,
            fontSize: { xs: '3rem', md: '5rem' },
          }}>
            Automate Drafting.<br />
            <Box component="span" sx={{
              background: 'linear-gradient(90deg, #4f46e5, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block', mt: 1,
            }}>
              Empower Your Law Firm.
            </Box>
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 5, fontWeight: 400, maxWidth: 620, mx: 'auto', lineHeight: 1.7 }}>
            Generate BNS 2023-compliant legal notices, court complaints & agreements in seconds. Built exclusively for Indian advocates.
          </Typography>

          {/* Feature pills */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mb: 5 }}>
            {['⚡ BNS / BNSS 2023', '🇮🇳 17 Languages', '📄 PDF Export', '🔒 Secure & Private', '🤖 AI Refinement'].map(f => (
              <Chip key={f} label={f} size="small" sx={{ fontWeight: 600, fontSize: '0.78rem', bgcolor: isDark ? 'rgba(255,255,255,0.07)' : 'white', border: '1px solid', borderColor: 'divider' }} />
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link}
              href="/generate"
              variant="contained"
              size="large"
              endIcon={<ArrowRight />}
              sx={{
                bgcolor: '#4f46e5', color: 'white',
                px: 5, py: 1.8,
                borderRadius: '999px',
                fontSize: '1.05rem', fontWeight: 700,
                boxShadow: '0 10px 30px -10px rgba(79,70,229,0.5)',
                textTransform: 'none',
                '&:hover': { bgcolor: '#4338ca', transform: 'translateY(-2px)', boxShadow: '0 15px 35px -10px rgba(79,70,229,0.6)' },
                transition: 'all 0.2s',
              }}
            >
              Start Drafting — It&apos;s Free
            </Button>
            <Button
              component={Link}
              href="/dashboard/templates"
              variant="outlined"
              size="large"
              sx={{
                px: 5, py: 1.8,
                borderRadius: '999px',
                fontSize: '1.05rem', fontWeight: 600,
                textTransform: 'none',
                borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)',
                color: 'text.primary',
                '&:hover': { bgcolor: 'action.hover', borderColor: '#4f46e5' },
              }}
            >
              Browse Templates
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: isDark ? 'rgba(255,255,255,0.01)' : '#f8fafc' }}>
        <Container maxWidth="md">
          <Typography variant="overline" fontWeight={700} color="#4f46e5" textAlign="center" display="block" letterSpacing="0.1em" mb={1}>
            HOW IT WORKS
          </Typography>
          <Typography variant="h4" fontWeight={800} textAlign="center" mb={6} sx={{ letterSpacing: '-0.02em', color: 'text.primary' }}>
            Draft in 3 simple steps
          </Typography>
          <Grid container spacing={3}>
            {[
              { step: '01', title: 'Describe your case', desc: 'Tell the AI the facts, parties involved, and what legal document you need.', color: '#4f46e5' },
              { step: '02', title: 'AI drafts it instantly', desc: 'Our model applies BNS 2023, IEA, and CPC to generate a court-ready draft.', color: '#7c3aed' },
              { step: '03', title: 'Refine & export', desc: 'Edit in the workspace, chat with AI to refine, then export as PDF or .docx.', color: '#ec4899' },
            ].map((s) => (
              <Grid size={{ xs: 12, md: 4 }} key={s.step}>
                <Box sx={{ p: 4, borderRadius: 4, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'white', border: '1px solid', borderColor: 'divider', height: '100%' }}>
                  <Typography sx={{ fontSize: '2.5rem', fontWeight: 900, color: s.color, opacity: 0.18, lineHeight: 1, mb: 2 }}>{s.step}</Typography>
                  <Typography variant="h6" fontWeight={800} mb={1} color="text.primary">{s.title}</Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{s.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={800} textAlign="center" mb={6} sx={{ letterSpacing: '-0.02em', color: 'text.primary' }}>
            Everything you need, in one place.
          </Typography>
          <Grid container spacing={3}>
            {[
              { title: 'Generative Drafting', desc: 'BNS 2023 compliant notices, NDAs, plaints, and petitions based on simple facts.', icon: <Scale size={26} color="#4f46e5" />, bg: '#ede9fe' },
              { title: 'Deep Legal Intelligence', desc: 'No hallucinations. Grounded in valid Indian judgments and Supreme Court decisions.', icon: <BookOpen size={26} color="#ec4899" />, bg: '#fce7f3' },
              { title: 'Save 10+ Hours A Week', desc: 'Upload PDFs and extract the clauses or argument summaries you need in seconds.', icon: <Clock size={26} color="#059669" />, bg: '#d1fae5' },
              { title: 'Legal Research', desc: 'Ask any question about Indian law — get cited, structured answers with case references.', icon: <Search size={26} color="#0284c7" />, bg: '#e0f2fe' },
              { title: '17 Indian Languages', desc: 'Draft notices in Hindi, Tamil, Telugu, Marathi, Bengali and 12 more regional languages.', icon: <FileText size={26} color="#d97706" />, bg: '#fef3c7' },
              { title: 'Bank-grade Security', desc: 'All drafts encrypted in transit and at rest. Your client data stays private.', icon: <Shield size={26} color="#7c3aed" />, bg: '#f5f3ff' },
            ].map((f) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={f.title}>
                <Box sx={{
                  p: 4, borderRadius: 4,
                  bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'white',
                  border: '1px solid', borderColor: 'divider',
                  height: '100%',
                  boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.03)',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-3px)' },
                }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                    {f.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={800} mb={1} sx={{ color: 'text.primary' }}>{f.title}</Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{f.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <Box sx={{
        py: { xs: 8, md: 10 },
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        textAlign: 'center',
      }}>
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight={900} color="white" mb={2} sx={{ letterSpacing: '-0.02em' }}>
            Ready to draft your first notice?
          </Typography>
          <Typography color="rgba(255,255,255,0.6)" mb={4} lineHeight={1.7}>
            No sign-up required to get started. Create your first AI-drafted legal document in under 60 seconds.
          </Typography>
          <Button
            component={Link}
            href="/generate"
            variant="contained"
            size="large"
            endIcon={<ArrowRight />}
            sx={{
              bgcolor: 'white', color: '#4f46e5',
              px: 5, py: 1.8,
              borderRadius: '999px',
              fontSize: '1rem', fontWeight: 700,
              textTransform: 'none',
              '&:hover': { bgcolor: '#f0f4ff', transform: 'translateY(-2px)' },
              transition: 'all 0.2s',
            }}
          >
            Start Drafting Free
          </Button>
        </Container>
      </Box>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <Box sx={{ py: 4, px: { xs: 3, md: 6 }, borderTop: '1px solid', borderColor: 'divider', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 24, height: 24, borderRadius: '6px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Scale size={13} color="white" />
          </Box>
          <Typography variant="body2" fontWeight={700} color="text.secondary">My Legal Notice</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {[['Privacy Policy', '#'], ['Terms of Use', '/terms-of-use'], ['Contact', 'mailto:support@mylegalnotice.in']].map(([label, href]) => (
            <Typography key={label} component={Link} href={href} variant="body2" color="text.disabled" fontWeight={500}
              sx={{ textDecoration: 'none', '&:hover': { color: '#4f46e5' } }}>
              {label}
            </Typography>
          ))}
        </Box>
        <Typography variant="body2" color="text.disabled">© {new Date().getFullYear()} My Legal Notice</Typography>
      </Box>

    </Box>
  );
}
