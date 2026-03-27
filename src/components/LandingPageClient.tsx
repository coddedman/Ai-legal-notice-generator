"use client"

import { Box, Typography, Button, Container, Grid, Chip, Avatar } from '@mui/material';
import { ArrowRight, Sparkles, Scale, BookOpen, Clock, Shield, FileText, Search, CheckCircle2, Zap, Users, Star } from 'lucide-react';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';

const INDIGO = '#4f46e5';
const VIOLET = '#7c3aed';
const PINK = '#ec4899';

export default function LandingPageClient() {
  const { data: session, status } = useSession();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#060918', color: 'white' }}>

      {/* ── ANIMATED BACKGROUND ─────────────────────────────────────────── */}
      <Box sx={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden',
      }}>
        <Box sx={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: { xs: 400, md: 800 }, height: { xs: 400, md: 800 },
          background: 'radial-gradient(circle, rgba(79,70,229,0.18) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulse1 8s ease-in-out infinite',
          '@keyframes pulse1': {
            '0%, 100%': { transform: 'scale(1) translate(0,0)' },
            '50%': { transform: 'scale(1.1) translate(40px, 30px)' },
          },
        }} />
        <Box sx={{
          position: 'absolute', bottom: '-10%', right: '-10%',
          width: { xs: 300, md: 700 }, height: { xs: 300, md: 700 },
          background: 'radial-gradient(circle, rgba(236,72,153,0.14) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulse2 10s ease-in-out infinite',
          '@keyframes pulse2': {
            '0%, 100%': { transform: 'scale(1) translate(0,0)' },
            '50%': { transform: 'scale(1.15) translate(-30px, -40px)' },
          },
        }} />
        <Box sx={{
          position: 'absolute', top: '40%', right: '20%',
          width: { xs: 200, md: 400 }, height: { xs: 200, md: 400 },
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        {/* Grid lines */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(79,70,229,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </Box>

      {/* ── NAVBAR ────────────────────────────────────────────────────────── */}
      <Box
        component="nav"
        sx={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          px: { xs: 3, md: 6 }, py: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backdropFilter: 'blur(20px)',
          background: 'rgba(6,9,24,0.8)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: '10px',
            background: `linear-gradient(135deg, ${INDIGO}, ${VIOLET})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 20px rgba(79,70,229,0.4)`,
          }}>
            <Scale size={18} color="white" />
          </Box>
          <Typography fontWeight={800} fontSize="1.1rem" sx={{ letterSpacing: '-0.02em', color: 'white' }}>
            My Legal Notice
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
          {[['Features', '#features'], ['How it works', '#how'], ['Templates', '/dashboard/templates']].map(([label, href]) => (
            <Typography key={label} component={Link} href={href} variant="body2" fontWeight={500}
              sx={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s', '&:hover': { color: 'white' } }}>
              {label}
            </Typography>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          {status === 'authenticated' ? (
            <Button component={Link} href="/dashboard" variant="contained" size="small"
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, background: `linear-gradient(135deg, ${INDIGO}, ${VIOLET})`, boxShadow: 'none', '&:hover': { opacity: 0.9, boxShadow: `0 0 20px rgba(79,70,229,0.4)` } }}>
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button size="small" variant="text" onClick={() => signIn()}
                sx={{ textTransform: 'none', fontWeight: 600, color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.06)' } }}>
                Sign In
              </Button>
              <Button component={Link} href="/dashboard" variant="contained" size="small"
                sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, background: `linear-gradient(135deg, ${INDIGO}, ${VIOLET})`, boxShadow: `0 0 20px rgba(79,70,229,0.3)`, '&:hover': { opacity: 0.9, boxShadow: `0 0 30px rgba(79,70,229,0.5)` } }}>
                Try Free →
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <Box sx={{ position: 'relative', zIndex: 1, pt: { xs: 18, md: 26 }, pb: { xs: 12, md: 20 }, textAlign: 'center' }}>
        <Container maxWidth="lg">

          {/* Badge */}
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.8,
            borderRadius: '999px', mb: 5,
            background: 'rgba(79,70,229,0.12)',
            border: '1px solid rgba(79,70,229,0.3)',
            backdropFilter: 'blur(8px)',
          }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4ade80', animation: 'blink 1.5s ease-in-out infinite', '@keyframes blink': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } } }} />
            <Typography variant="body2" fontWeight={600} sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem' }}>
              🇮🇳 Built for Indian Advocates — BNS 2023 Ready
            </Typography>
          </Box>

          {/* Headline */}
          <Typography variant="h1" fontWeight={900} sx={{
            fontSize: { xs: '2.8rem', sm: '3.8rem', md: '5.5rem' },
            lineHeight: 1.05, letterSpacing: '-0.04em', mb: 4, color: 'white',
          }}>
            Draft Legal Notices<br />
            <Box component="span" sx={{
              background: `linear-gradient(90deg, ${INDIGO} 0%, ${PINK} 60%, #f97316 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}>
              10× Faster with AI
            </Box>
          </Typography>

          <Typography sx={{
            fontSize: { xs: '1.05rem', md: '1.25rem' }, color: 'rgba(255,255,255,0.55)',
            maxWidth: 600, mx: 'auto', lineHeight: 1.8, mb: 6, fontWeight: 400,
          }}>
            Generate BNS 2023-compliant legal notices, court complaints & agreements in seconds.
            No templates. Just describe your case and let AI do the drafting.
          </Typography>

          {/* CTAs */}
          <Box sx={{ display: 'flex', gap: { xs: 1.5, md: 2 }, justifyContent: 'center', flexWrap: 'wrap', mb: 8 }}>
            <Button
              component={Link} href="/dashboard" variant="contained" size="large" endIcon={<ArrowRight size={18} />}
              sx={{
                px: { xs: 4, md: 6 }, py: 2, borderRadius: '14px', fontSize: '1.05rem', fontWeight: 700,
                textTransform: 'none',
                background: `linear-gradient(135deg, ${INDIGO} 0%, ${VIOLET} 100%)`,
                boxShadow: `0 8px 32px rgba(79,70,229,0.45)`,
                '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 16px 40px rgba(79,70,229,0.55)` },
                transition: 'all 0.25s',
              }}
            >
              Start Drafting Free
            </Button>
            <Button
              component={Link} href="/dashboard/templates" variant="outlined" size="large"
              sx={{
                px: { xs: 4, md: 5 }, py: 2, borderRadius: '14px', fontSize: '1.05rem', fontWeight: 600,
                textTransform: 'none',
                color: 'rgba(255,255,255,0.85)',
                borderColor: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                background: 'rgba(255,255,255,0.04)',
                '&:hover': { borderColor: `${INDIGO}`, background: 'rgba(79,70,229,0.1)', transform: 'translateY(-2px)' },
                transition: 'all 0.25s',
              }}
            >
              Browse Templates
            </Button>
          </Box>

          {/* Social Proof */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: { xs: 4, md: 8 } }}>
            {[
              { value: '5,000+', label: 'Notices Drafted' },
              { value: '1,200+', label: 'Advocates Onboarded' },
              { value: '17', label: 'Indian Languages' },
              { value: '9.4/10', label: 'Avg Satisfaction' },
            ].map(s => (
              <Box key={s.value} sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' }, fontWeight: 900, color: 'white', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {s.value}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500, mt: 0.5 }}>
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── PRODUCT SCREENSHOT / DEMO CARD ─────────────────────────────── */}
      <Box sx={{ position: 'relative', zIndex: 1, pb: { xs: 10, md: 14 } }}>
        <Container maxWidth="lg">
          <Box sx={{
            borderRadius: '24px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'linear-gradient(145deg, rgba(79,70,229,0.08) 0%, rgba(124,58,237,0.06) 50%, rgba(236,72,153,0.06) 100%)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
            p: { xs: 3, md: 5 },
          }}>
            {/* Fake Browser Bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              {['#ff5f57', '#febc2e', '#28c840'].map(c => (
                <Box key={c} sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: c }} />
              ))}
              <Box sx={{
                ml: 2, flex: 1, height: 28, borderRadius: '6px',
                bgcolor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', px: 2,
              }}>
                <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>
                  www.mylegalnotice.in/generate
                </Typography>
              </Box>
            </Box>

            {/* Simulated App Content */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 5 }}>
                <Box sx={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', p: 3, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: INDIGO, mb: 2, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Case Facts</Typography>
                  {['Notice type: Legal Notice under BNS § 420', 'Sender: Advocate Meera Sharma', 'Respondent: ABC Pvt. Ltd.', 'Amount: ₹4,50,000 due since 90 days', 'Jurisdiction: Delhi High Court'].map(line => (
                    <Box key={line} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
                      <CheckCircle2 size={13} color="#4ade80" style={{ marginTop: 2, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{line}</Typography>
                    </Box>
                  ))}
                  <Button fullWidth variant="contained" size="small" startIcon={<Zap size={14} />}
                    sx={{ mt: 2.5, borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: '0.82rem', background: `linear-gradient(135deg, ${INDIGO}, ${VIOLET})`, boxShadow: `0 4px 16px rgba(79,70,229,0.4)` }}>
                    Generate Draft
                  </Button>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 7 }}>
                <Box sx={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', p: 3, border: '1px solid rgba(255,255,255,0.06)', height: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#4ade80', letterSpacing: '0.08em', textTransform: 'uppercase' }}>✓ Draft Generated in 2.3s</Typography>
                    <Chip label="BNS § 420 Compliant" size="small" sx={{ bgcolor: 'rgba(79,70,229,0.2)', color: 'rgba(255,255,255,0.7)', fontSize: '0.68rem', height: 20 }} />
                  </Box>
                  {['Subject: Legal Notice Under Bharatiya Nyaya Sanhita, 2023', '',
                    'Without Prejudice',
                    '',
                    'To,',
                    'The Directors, ABC Private Limited, New Delhi.',
                    '',
                    'Under instructions from my client, Advocate Meera Sharma, I hereby...',
                    'You are directed to pay ₹4,50,000 within 15 days of this notice...',
                    '',
                    'Failing compliance, my client shall be constrained to initiate...'
                  ].map((line, i) => (
                    <Box key={i} sx={{
                      height: line === '' ? 8 : 'auto', mb: line === '' ? 0 : 0.5,
                    }}>
                      {line !== '' && (
                        <Box sx={{ height: 10, borderRadius: '4px', bgcolor: 'rgba(255,255,255,0.07)', width: line.length > 50 ? '100%' : `${Math.max(30, line.length * 1.3)}%` }} />
                      )}
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <Box id="how" sx={{ position: 'relative', zIndex: 1, py: { xs: 10, md: 16 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Chip label="HOW IT WORKS" size="small" sx={{ bgcolor: 'rgba(79,70,229,0.15)', color: INDIGO, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', mb: 2 }} />
            <Typography variant="h3" fontWeight={900} sx={{ color: 'white', letterSpacing: '-0.03em', fontSize: { xs: '2rem', md: '3rem' } }}>
              From facts to court-ready draft<br />in under 60 seconds
            </Typography>
          </Box>
          <Grid container spacing={4} alignItems="stretch">
            {[
              { step: '01', title: 'Describe your case', desc: 'Tell the AI your case facts, parties involved, and the type of legal document you need — in plain English or Hindi.', color: INDIGO, icon: <FileText size={22} /> },
              { step: '02', title: 'AI drafts instantly', desc: 'Our model applies BNS 2023, BNSS, IEA, and CPC automatically. Zero hallucinations. Grounded in Indian law.', color: VIOLET, icon: <Zap size={22} /> },
              { step: '03', title: 'Refine & export', desc: 'Edit in the workspace, chat with AI to refine clauses, and export as PDF with your advocate letterhead.', color: PINK, icon: <ArrowRight size={22} /> },
            ].map((s, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={s.step}>
                <Box sx={{
                  position: 'relative', p: 4, borderRadius: '20px', height: '100%',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.04)',
                    borderColor: `${s.color}40`,
                    transform: 'translateY(-4px)',
                    boxShadow: `0 20px 40px rgba(0,0,0,0.3)`,
                  }
                }}>
                  <Box sx={{
                    width: 48, height: 48, borderRadius: '14px', mb: 3,
                    background: `${s.color}18`,
                    border: `1px solid ${s.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: s.color,
                  }}>
                    {s.icon}
                  </Box>
                  <Typography sx={{ fontSize: '4rem', fontWeight: 900, color: s.color, opacity: 0.1, lineHeight: 1, position: 'absolute', top: 16, right: 24, fontFamily: 'monospace' }}>
                    {s.step}
                  </Typography>
                  <Typography variant="h6" fontWeight={800} mb={1.5} sx={{ color: 'white' }}>{s.title}</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, fontSize: '0.92rem' }}>{s.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <Box id="features" sx={{ position: 'relative', zIndex: 1, py: { xs: 10, md: 14 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Chip label="FEATURES" size="small" sx={{ bgcolor: 'rgba(236,72,153,0.15)', color: PINK, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', mb: 2 }} />
            <Typography variant="h3" fontWeight={900} sx={{ color: 'white', letterSpacing: '-0.03em', fontSize: { xs: '2rem', md: '3rem' } }}>
              Everything your chamber needs
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {[
              { title: 'BNS 2023 Drafting', desc: 'Notices, NDAs, plaints & petitions grounded in Bharatiya Nyaya Sanhita, IEA, and CPC.', icon: <Scale size={22} />, color: INDIGO },
              { title: 'Deep Legal Intelligence', desc: 'No hallucinations. AI-generated arguments backed by verified Indian Supreme Court judgments.', icon: <BookOpen size={22} />, color: PINK },
              { title: 'Save 10+ Hours/Week', desc: 'Upload any PDF and instantly extract key clauses, arguments, and legal summaries.', icon: <Clock size={22} />, color: '#059669' },
              { title: 'Indian Law Research', desc: 'Ask any question — get structured, cited answers with section references and case laws.', icon: <Search size={22} />, color: '#0284c7' },
              { title: '17 Regional Languages', desc: 'Draft in Hindi, Tamil, Telugu, Marathi, Bengali and 12 more Indian regional languages natively.', icon: <FileText size={22} />, color: '#d97706' },
              { title: 'Bank-grade Encryption', desc: 'All client data and drafts are encrypted end-to-end. SOC 2 compliant infrastructure.', icon: <Shield size={22} />, color: VIOLET },
            ].map((f) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={f.title}>
                <Box sx={{
                  p: 3.5, borderRadius: '18px', height: '100%',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.04)',
                    borderColor: `${f.color}30`,
                    transform: 'translateY(-3px)',
                  },
                }}>
                  <Box sx={{
                    width: 44, height: 44, borderRadius: '12px', mb: 2.5,
                    background: `${f.color}18`, border: `1px solid ${f.color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: f.color,
                  }}>
                    {f.icon}
                  </Box>
                  <Typography fontWeight={800} mb={1} sx={{ color: 'white', fontSize: '1rem' }}>{f.title}</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, fontSize: '0.875rem' }}>{f.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <Box sx={{ position: 'relative', zIndex: 1, py: { xs: 10, md: 14 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" fontWeight={900} sx={{ color: 'white', letterSpacing: '-0.03em', fontSize: { xs: '1.8rem', md: '2.6rem' } }}>
              Trusted by advocates across India
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {[
              { name: 'Adv. Priya Mehta', location: 'Mumbai High Court', text: 'I used to spend 3 hours drafting each legal notice. Now it takes 5 minutes. My client turnaround has doubled.', stars: 5 },
              { name: 'Adv. Rakesh Kumar', location: 'Delhi District Court', text: 'The BNS 2023 compliance is spot-on. No more worrying about outdated sections — the AI always picks the right law.', stars: 5 },
              { name: 'Adv. Sunita Rao', location: 'Hyderabad HC', text: 'My junior advocates use it for first drafts, I just review and sign. We handle 3× more cases every month now.', stars: 5 },
            ].map((t) => (
              <Grid size={{ xs: 12, md: 4 }} key={t.name}>
                <Box sx={{
                  p: 4, borderRadius: '20px', height: '100%',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.3s',
                  '&:hover': { transform: 'translateY(-3px)', borderColor: 'rgba(255,255,255,0.12)' },
                }}>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, fontSize: '0.92rem', mb: 3, fontStyle: 'italic' }}>
                    "{t.text}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 36, height: 36, background: `linear-gradient(135deg, ${INDIGO}, ${VIOLET})`, fontSize: '0.8rem', fontWeight: 700 }}>
                      {t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </Avatar>
                    <Box>
                      <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>{t.name}</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{t.location}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <Box sx={{ position: 'relative', zIndex: 1, py: { xs: 10, md: 16 } }}>
        <Container maxWidth="md">
          <Box sx={{
            textAlign: 'center', p: { xs: 5, md: 10 }, borderRadius: '28px',
            background: `linear-gradient(135deg, rgba(79,70,229,0.2) 0%, rgba(124,58,237,0.15) 50%, rgba(236,72,153,0.12) 100%)`,
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
            position: 'relative', overflow: 'hidden',
          }}>
            <Box sx={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: `radial-gradient(circle, rgba(79,70,229,0.3) 0%, transparent 70%)`, borderRadius: '50%' }} />
            <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 150, height: 150, background: `radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)`, borderRadius: '50%' }} />
            <Box sx={{ position: 'relative' }}>
              <Chip label="FREE TO START" size="small" sx={{ bgcolor: 'rgba(74,222,128,0.15)', color: '#4ade80', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', mb: 3, border: '1px solid rgba(74,222,128,0.2)' }} />
              <Typography variant="h3" fontWeight={900} sx={{ color: 'white', mb: 2, letterSpacing: '-0.03em', fontSize: { xs: '1.8rem', md: '2.8rem' } }}>
                Ready to transform your<br />legal practice?
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.55)', mb: 5, lineHeight: 1.8, maxWidth: 480, mx: 'auto' }}>
                No credit card required. Start drafting your first AI-powered legal notice in under 60 seconds.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button component={Link} href="/dashboard" variant="contained" size="large" endIcon={<ArrowRight size={18} />}
                  sx={{
                    px: 6, py: 2, borderRadius: '14px', fontSize: '1.05rem', fontWeight: 700, textTransform: 'none',
                    background: 'white', color: INDIGO,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    '&:hover': { background: '#f0f4ff', transform: 'translateY(-2px)', boxShadow: '0 16px 40px rgba(0,0,0,0.4)' },
                    transition: 'all 0.25s',
                  }}>
                  Start Drafting Free
                </Button>
              </Box>
              <Typography sx={{ mt: 3, fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>
                ✓ No sign-up required &nbsp;&nbsp; ✓ 500 free credits &nbsp;&nbsp; ✓ Cancel anytime
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <Box sx={{
        position: 'relative', zIndex: 1,
        py: 4, px: { xs: 3, md: 6 },
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 28, height: 28, borderRadius: '8px', background: `linear-gradient(135deg, ${INDIGO}, ${VIOLET})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Scale size={14} color="white" />
          </Box>
          <Typography fontWeight={700} sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>My Legal Notice</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {[['Privacy Policy', '#'], ['Terms of Use', '/terms-of-use'], ['Contact', 'mailto:support@mylegalnotice.in']].map(([label, href]) => (
            <Typography key={label} component={Link} href={href} sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', '&:hover': { color: 'rgba(255,255,255,0.7)' }, transition: 'color 0.2s' }}>
              {label}
            </Typography>
          ))}
        </Box>
        <Typography sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.25)' }}>
          © {new Date().getFullYear()} My Legal Notice
        </Typography>
      </Box>

    </Box>
  );
}
