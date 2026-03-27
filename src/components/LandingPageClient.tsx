"use client"

import { Box, Typography, Button, Container, Grid, Chip, Avatar } from '@mui/material';
import { ArrowRight, Sparkles, Scale, BookOpen, Clock, Shield, FileText, Search, CheckCircle2, Zap, Star } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';
import { useSession, signIn } from 'next-auth/react';

export default function LandingPageClient() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { data: session, status } = useSession();

  // Theme-aware palette
  const primary = theme.palette.primary.main;
  const primaryDark = theme.palette.primary.dark;
  const gold = theme.palette.secondary.main;
  const bg = theme.palette.background.default;
  const paper = theme.palette.background.paper;
  const textPrimary = theme.palette.text.primary;
  const textSecondary = theme.palette.text.secondary;
  const divider = theme.palette.divider;

  // Gradient helpers
  const heroGradient = isDark
    ? `linear-gradient(135deg, ${primary}18 0%, rgba(212,175,55,0.06) 100%)`
    : `linear-gradient(135deg, #f8fafc 0%, rgba(26,35,126,0.06) 50%, rgba(197,160,89,0.04) 100%)`;

  const btnGradient = isDark
    ? `linear-gradient(135deg, ${primary} 0%, ${primaryDark} 100%)`
    : `linear-gradient(135deg, #1a237e 0%, #311b92 100%)`;

  const glowColor = isDark ? `${primary}40` : 'rgba(26,35,126,0.2)';

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: bg, color: textPrimary }}>

      {/* ── ANIMATED BACKGROUND ─────────────────────────────────────────── */}
      <Box sx={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <Box sx={{
          position: 'absolute', top: '-15%', left: '-5%',
          width: { xs: 300, md: 700 }, height: { xs: 300, md: 700 },
          background: isDark
            ? `radial-gradient(circle, ${primary}14 0%, transparent 70%)`
            : 'radial-gradient(circle, rgba(26,35,126,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'lpPulse1 8s ease-in-out infinite',
          '@keyframes lpPulse1': { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.08) translate(30px,20px)' } },
        }} />
        <Box sx={{
          position: 'absolute', bottom: '-10%', right: '-8%',
          width: { xs: 250, md: 600 }, height: { xs: 250, md: 600 },
          background: isDark
            ? 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(197,160,89,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'lpPulse2 10s ease-in-out infinite',
          '@keyframes lpPulse2': { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.1) translate(-20px,-30px)' } },
        }} />
        {/* Subtle grid */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: isDark
            ? `linear-gradient(${primary}08 1px, transparent 1px), linear-gradient(90deg, ${primary}08 1px, transparent 1px)`
            : 'linear-gradient(rgba(26,35,126,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(26,35,126,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </Box>

      {/* ── NAVBAR ────────────────────────────────────────────────────────── */}
      <Box component="nav" sx={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        px: { xs: 3, md: 6 }, py: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backdropFilter: 'blur(20px)',
        background: isDark ? 'rgba(10,11,16,0.85)' : 'rgba(248,250,252,0.85)',
        borderBottom: `1px solid ${divider}`,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: '10px',
            background: btnGradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 16px ${glowColor}`,
          }}>
            <Scale size={18} color="white" />
          </Box>
          <Typography fontWeight={800} fontSize="1.1rem" sx={{ letterSpacing: '-0.02em', color: textPrimary }}>
            My Legal Notice
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
          {[['Features', '#features'], ['How it works', '#how'], ['Templates', '/dashboard/templates']].map(([label, href]) => (
            <Typography key={label} component={Link} href={href} variant="body2" fontWeight={500}
              sx={{ color: textSecondary, textDecoration: 'none', transition: 'color 0.2s', '&:hover': { color: primary } }}>
              {label}
            </Typography>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          {status === 'authenticated' ? (
            <Button component={Link} href="/dashboard" variant="contained" size="small"
              sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, background: btnGradient, boxShadow: 'none', '&:hover': { opacity: 0.9, boxShadow: `0 0 20px ${glowColor}` } }}>
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button size="small" variant="text" onClick={() => signIn()}
                sx={{ textTransform: 'none', fontWeight: 600, color: textSecondary, '&:hover': { color: primary } }}>
                Sign In
              </Button>
              <Button component={Link} href="/dashboard" variant="contained" size="small"
                sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, background: btnGradient, boxShadow: `0 0 16px ${glowColor}`, '&:hover': { opacity: 0.9, boxShadow: `0 0 24px ${glowColor}` } }}>
                Try Free →
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <Box sx={{
        position: 'relative', zIndex: 1,
        pt: { xs: 18, md: 26 }, pb: { xs: 12, md: 20 },
        textAlign: 'center',
        background: heroGradient,
      }}>
        <Container maxWidth="lg">
          {/* Badge */}
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.8,
            borderRadius: '999px', mb: 5,
            bgcolor: isDark ? `${primary}15` : 'rgba(26,35,126,0.06)',
            border: `1px solid ${isDark ? `${primary}30` : 'rgba(26,35,126,0.12)'}`,
          }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: theme.palette.success.main, animation: 'lpBlink 1.5s ease-in-out infinite', '@keyframes lpBlink': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } } }} />
            <Typography variant="body2" fontWeight={600} sx={{ color: textSecondary, fontSize: '0.82rem' }}>
              🇮🇳 Built for Indian Advocates — BNS 2023 Ready
            </Typography>
          </Box>

          {/* Headline */}
          <Typography variant="h1" fontWeight={900} sx={{
            fontSize: { xs: '2.6rem', sm: '3.5rem', md: '5rem' },
            lineHeight: 1.08, letterSpacing: '-0.04em', mb: 4,
          }}>
            Draft Legal Notices<br />
            <Box component="span" sx={{
              background: isDark
                ? `linear-gradient(90deg, ${primary} 0%, ${gold} 100%)`
                : `linear-gradient(90deg, #1a237e 0%, #c5a059 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              10× Faster with AI
            </Box>
          </Typography>

          <Typography sx={{
            fontSize: { xs: '1.05rem', md: '1.2rem' }, color: textSecondary,
            maxWidth: 580, mx: 'auto', lineHeight: 1.8, mb: 6,
          }}>
            Generate BNS 2023-compliant legal notices, court complaints & agreements in seconds.
            No templates. Just describe your case.
          </Typography>

          {/* CTAs */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 8 }}>
            <Button
              component={Link} href="/dashboard" variant="contained" size="large" endIcon={<ArrowRight size={18} />}
              sx={{
                px: { xs: 4, md: 6 }, py: 2, borderRadius: '14px', fontSize: '1.05rem', fontWeight: 700,
                textTransform: 'none', background: btnGradient,
                boxShadow: `0 8px 32px ${glowColor}`,
                '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 16px 40px ${glowColor}` },
                transition: 'all 0.25s',
              }}
            >
              Start Drafting — It&apos;s Free
            </Button>
            <Button
              component={Link} href="/dashboard/templates" variant="outlined" size="large"
              sx={{
                px: { xs: 4, md: 5 }, py: 2, borderRadius: '14px', fontSize: '1.05rem', fontWeight: 600,
                textTransform: 'none', color: textPrimary, borderColor: divider,
                '&:hover': { borderColor: primary, bgcolor: isDark ? `${primary}10` : 'rgba(26,35,126,0.04)', transform: 'translateY(-2px)' },
                transition: 'all 0.25s',
              }}
            >
              Browse Templates
            </Button>
          </Box>

          {/* Stats */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: { xs: 4, md: 8 } }}>
            {[
              { value: '5,000+', label: 'Notices Drafted' },
              { value: '1,200+', label: 'Advocates Onboarded' },
              { value: '17', label: 'Indian Languages' },
              { value: '9.4/10', label: 'Avg Satisfaction' },
            ].map(s => (
              <Box key={s.value} sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' }, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1, color: textPrimary }}>
                  {s.value}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: textSecondary, fontWeight: 500, mt: 0.5 }}>
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── PRODUCT DEMO CARD ──────────────────────────────────────────── */}
      <Box sx={{ position: 'relative', zIndex: 1, pb: { xs: 10, md: 14 } }}>
        <Container maxWidth="lg">
          <Box sx={{
            borderRadius: '24px', overflow: 'hidden',
            border: `1px solid ${divider}`,
            bgcolor: paper,
            boxShadow: isDark ? '0 40px 80px rgba(0,0,0,0.5)' : '0 40px 80px rgba(26,35,126,0.08)',
            p: { xs: 3, md: 5 },
          }}>
            {/* Browser Bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              {['#ff5f57', '#febc2e', '#28c840'].map(c => (
                <Box key={c} sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: c }} />
              ))}
              <Box sx={{ ml: 2, flex: 1, height: 28, borderRadius: '6px', bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', px: 2 }}>
                <Typography sx={{ fontSize: '0.72rem', color: textSecondary }}>www.mylegalnotice.in/generate</Typography>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 5 }}>
                <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)', borderRadius: '12px', p: 3, border: `1px solid ${divider}` }}>
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: primary, mb: 2, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Case Facts</Typography>
                  {['Notice type: Legal Notice under BNS § 420', 'Sender: Advocate Meera Sharma', 'Respondent: ABC Pvt. Ltd.', 'Amount: ₹4,50,000 due since 90 days', 'Jurisdiction: Delhi High Court'].map(line => (
                    <Box key={line} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
                      <CheckCircle2 size={13} color={theme.palette.success.main} style={{ marginTop: 2, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: '0.78rem', color: textSecondary, lineHeight: 1.5 }}>{line}</Typography>
                    </Box>
                  ))}
                  <Button fullWidth variant="contained" size="small" startIcon={<Zap size={14} />}
                    sx={{ mt: 2.5, borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: '0.82rem', background: btnGradient, boxShadow: `0 4px 16px ${glowColor}` }}>
                    Generate Draft
                  </Button>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 7 }}>
                <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)', borderRadius: '12px', p: 3, border: `1px solid ${divider}`, height: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: theme.palette.success.main, letterSpacing: '0.08em', textTransform: 'uppercase' }}>✓ Draft Generated in 2.3s</Typography>
                    <Chip label="BNS § 420" size="small" sx={{ bgcolor: `${primary}15`, color: primary, fontSize: '0.68rem', height: 20 }} />
                  </Box>
                  {['Subject: Legal Notice Under Bharatiya Nyaya Sanhita, 2023', '', 'Without Prejudice', '', 'To,', 'The Directors, ABC Private Limited, New Delhi.', '', 'Under instructions from my client, Advocate Meera Sharma, I hereby...', 'You are directed to pay ₹4,50,000 within 15 days of this notice...', '', 'Failing compliance, my client shall be constrained to initiate...'].map((line, i) => (
                    <Box key={i} sx={{ height: line === '' ? 8 : 'auto', mb: line === '' ? 0 : 0.5 }}>
                      {line !== '' && <Box sx={{ height: 10, borderRadius: '4px', bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(26,35,126,0.05)', width: line.length > 50 ? '100%' : `${Math.max(30, line.length * 1.3)}%` }} />}
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <Box id="how" sx={{ position: 'relative', zIndex: 1, py: { xs: 10, md: 16 }, bgcolor: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(26,35,126,0.015)' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Chip label="HOW IT WORKS" size="small" sx={{ bgcolor: `${primary}15`, color: primary, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', mb: 2 }} />
            <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: '-0.03em', fontSize: { xs: '2rem', md: '3rem' } }}>
              From facts to court-ready draft<br />in under 60 seconds
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {[
              { step: '01', title: 'Describe your case', desc: 'Tell the AI your case facts, parties involved, and the type of legal document you need.', color: primary, icon: <FileText size={22} /> },
              { step: '02', title: 'AI drafts instantly', desc: 'Our model applies BNS 2023, BNSS, IEA, and CPC automatically. Zero hallucinations.', color: gold, icon: <Zap size={22} /> },
              { step: '03', title: 'Refine & export', desc: 'Edit in the workspace, chat with AI to refine clauses, export as PDF with your letterhead.', color: theme.palette.success.main, icon: <ArrowRight size={22} /> },
            ].map((s) => (
              <Grid size={{ xs: 12, md: 4 }} key={s.step}>
                <Box sx={{
                  position: 'relative', p: 4, borderRadius: '20px', height: '100%',
                  bgcolor: paper, border: `1px solid ${divider}`,
                  transition: 'all 0.3s',
                  boxShadow: isDark ? 'none' : '0 4px 20px rgba(26,35,126,0.04)',
                  '&:hover': { transform: 'translateY(-4px)', borderColor: `${s.color}40`, boxShadow: `0 20px 40px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(26,35,126,0.08)'}` },
                }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: '14px', mb: 3, bgcolor: `${s.color}12`, border: `1px solid ${s.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                    {s.icon}
                  </Box>
                  <Typography sx={{ fontSize: '4rem', fontWeight: 900, color: s.color, opacity: 0.08, lineHeight: 1, position: 'absolute', top: 16, right: 24, fontFamily: 'monospace' }}>{s.step}</Typography>
                  <Typography variant="h6" fontWeight={800} mb={1.5}>{s.title}</Typography>
                  <Typography sx={{ color: textSecondary, lineHeight: 1.8, fontSize: '0.92rem' }}>{s.desc}</Typography>
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
            <Chip label="FEATURES" size="small" sx={{ bgcolor: `${gold}20`, color: gold, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', mb: 2 }} />
            <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: '-0.03em', fontSize: { xs: '2rem', md: '3rem' } }}>
              Everything your chamber needs
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {[
              { title: 'BNS 2023 Drafting', desc: 'Notices, NDAs, plaints & petitions grounded in Bharatiya Nyaya Sanhita, IEA, and CPC.', icon: <Scale size={22} />, color: primary },
              { title: 'Deep Legal Intelligence', desc: 'No hallucinations. AI arguments backed by verified Indian Supreme Court judgments.', icon: <BookOpen size={22} />, color: gold },
              { title: 'Save 10+ Hours/Week', desc: 'Upload any PDF and instantly extract key clauses, arguments, and legal summaries.', icon: <Clock size={22} />, color: theme.palette.success.main },
              { title: 'Indian Law Research', desc: 'Ask any question about Indian law — get cited answers with section references.', icon: <Search size={22} />, color: '#0284c7' },
              { title: '17 Regional Languages', desc: 'Draft in Hindi, Tamil, Telugu, Marathi, Bengali and 12 more regional languages.', icon: <FileText size={22} />, color: '#d97706' },
              { title: 'Bank-grade Encryption', desc: 'All client data and drafts encrypted. SOC 2 compliant infrastructure.', icon: <Shield size={22} />, color: isDark ? theme.palette.primary.light : primaryDark },
            ].map((f) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={f.title}>
                <Box sx={{
                  p: 3.5, borderRadius: '18px', height: '100%',
                  bgcolor: paper, border: `1px solid ${divider}`,
                  boxShadow: isDark ? 'none' : '0 2px 12px rgba(26,35,126,0.03)',
                  transition: 'all 0.3s',
                  '&:hover': { transform: 'translateY(-3px)', borderColor: `${f.color}30` },
                }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: '12px', mb: 2.5, bgcolor: `${f.color}12`, border: `1px solid ${f.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color }}>
                    {f.icon}
                  </Box>
                  <Typography fontWeight={800} mb={1} sx={{ fontSize: '1rem' }}>{f.title}</Typography>
                  <Typography sx={{ color: textSecondary, lineHeight: 1.75, fontSize: '0.875rem' }}>{f.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <Box sx={{ position: 'relative', zIndex: 1, py: { xs: 10, md: 14 }, bgcolor: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(26,35,126,0.015)' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: '-0.03em', fontSize: { xs: '1.8rem', md: '2.6rem' } }}>
              Trusted by advocates across India
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {[
              { name: 'Adv. Priya Mehta', location: 'Mumbai High Court', text: 'I used to spend 3 hours drafting each legal notice. Now it takes 5 minutes. My client turnaround has doubled.', stars: 5 },
              { name: 'Adv. Rakesh Kumar', location: 'Delhi District Court', text: 'The BNS 2023 compliance is spot-on. No more worrying about outdated IPC sections.', stars: 5 },
              { name: 'Adv. Sunita Rao', location: 'Hyderabad HC', text: 'My junior advocates use it for first drafts, I review and sign. We handle 3× more cases every month.', stars: 5 },
            ].map((t) => (
              <Grid size={{ xs: 12, md: 4 }} key={t.name}>
                <Box sx={{
                  p: 4, borderRadius: '20px', height: '100%',
                  bgcolor: paper, border: `1px solid ${divider}`,
                  boxShadow: isDark ? 'none' : '0 4px 20px rgba(26,35,126,0.04)',
                  transition: 'all 0.3s',
                  '&:hover': { transform: 'translateY(-3px)' },
                }}>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} size={16} fill={gold} color={gold} />
                    ))}
                  </Box>
                  <Typography sx={{ color: textSecondary, lineHeight: 1.8, fontSize: '0.92rem', mb: 3, fontStyle: 'italic' }}>
                    &ldquo;{t.text}&rdquo;
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 36, height: 36, background: btnGradient, fontSize: '0.8rem', fontWeight: 700 }}>
                      {t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{t.name}</Typography>
                      <Typography sx={{ color: textSecondary, fontSize: '0.75rem' }}>{t.location}</Typography>
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
            background: isDark
              ? `linear-gradient(135deg, ${primary}20 0%, rgba(212,175,55,0.1) 100%)`
              : 'linear-gradient(135deg, #1a237e 0%, #311b92 100%)',
            border: `1px solid ${isDark ? divider : 'transparent'}`,
            boxShadow: isDark ? '0 40px 80px rgba(0,0,0,0.4)' : '0 40px 80px rgba(26,35,126,0.25)',
            position: 'relative', overflow: 'hidden',
          }}>
            <Box sx={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: `radial-gradient(circle, ${isDark ? `${primary}25` : 'rgba(255,255,255,0.08)'} 0%, transparent 70%)`, borderRadius: '50%' }} />
            <Box sx={{ position: 'relative' }}>
              <Chip label="FREE TO START" size="small" sx={{ bgcolor: isDark ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.15)', color: isDark ? '#4ade80' : 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', mb: 3 }} />
              <Typography variant="h3" fontWeight={900} sx={{ color: isDark ? textPrimary : 'white', mb: 2, letterSpacing: '-0.03em', fontSize: { xs: '1.8rem', md: '2.8rem' } }}>
                Ready to transform your<br />legal practice?
              </Typography>
              <Typography sx={{ color: isDark ? textSecondary : 'rgba(255,255,255,0.7)', mb: 5, lineHeight: 1.8, maxWidth: 480, mx: 'auto' }}>
                No credit card needed. Start drafting your first AI-powered legal notice in under 60 seconds.
              </Typography>
              <Button component={Link} href="/dashboard" variant="contained" size="large" endIcon={<ArrowRight size={18} />}
                sx={{
                  px: 6, py: 2, borderRadius: '14px', fontSize: '1.05rem', fontWeight: 700, textTransform: 'none',
                  background: isDark ? btnGradient : 'white',
                  color: isDark ? 'white' : '#1a237e',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 16px 40px rgba(0,0,0,0.4)' },
                  transition: 'all 0.25s',
                }}>
                Start Drafting Free
              </Button>
              <Typography sx={{ mt: 3, fontSize: '0.8rem', color: isDark ? textSecondary : 'rgba(255,255,255,0.5)' }}>
                ✓ No sign-up required &nbsp;&nbsp; ✓ 500 free credits &nbsp;&nbsp; ✓ Cancel anytime
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <Box sx={{
        position: 'relative', zIndex: 1, py: 4, px: { xs: 3, md: 6 },
        borderTop: `1px solid ${divider}`,
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 28, height: 28, borderRadius: '8px', background: btnGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Scale size={14} color="white" />
          </Box>
          <Typography fontWeight={700} sx={{ color: textSecondary, fontSize: '0.9rem' }}>My Legal Notice</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {[['Privacy Policy', '#'], ['Terms of Use', '/terms-of-use'], ['Contact', 'mailto:support@mylegalnotice.in']].map(([label, href]) => (
            <Typography key={label} component={Link} href={href} sx={{ fontSize: '0.82rem', color: textSecondary, textDecoration: 'none', '&:hover': { color: primary }, transition: 'color 0.2s' }}>
              {label}
            </Typography>
          ))}
        </Box>
        <Typography sx={{ fontSize: '0.82rem', color: textSecondary }}>© {new Date().getFullYear()} My Legal Notice</Typography>
      </Box>

    </Box>
  );
}
