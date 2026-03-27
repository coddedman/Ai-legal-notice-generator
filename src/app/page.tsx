import { Metadata } from 'next';
import Link from 'next/link';
import { Box, Typography, Button, Container, Grid, Chip, Avatar } from '@mui/material';
import LandingNavAuth from '@/components/LandingNavAuth';

export const metadata: Metadata = {
  title: 'My Legal Notice | #1 Accurate Legal AI for Indian Lawyers',
  description: 'Draft legal notices, build arguments, create memos, research case law & extract clauses from PDFs — all powered by BNS 2023-compliant AI. Try free today.',
  keywords: ['legal notice generator', 'AI legal drafting', 'BNS 2023', 'Indian lawyer AI', 'legal document automation', 'court complaint generator', 'advocate AI tool'],
  openGraph: {
    title: 'My Legal Notice | #1 Accurate Legal AI for Indian Lawyers',
    description: 'Draft any legal document expertly in minutes with AI. BNS 2023 compliant. Try free — no sign-up required.',
    url: 'https://www.mylegalnotice.in',
    siteName: 'My Legal Notice',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Legal Notice | #1 Accurate Legal AI for Indian Lawyers',
    description: 'Draft any legal document expertly in minutes with AI. BNS 2023 compliant. Try free today.',
  },
  alternates: { canonical: 'https://www.mylegalnotice.in' },
  robots: { index: true, follow: true },
};

// JSON-LD Structured Data for Google Rich Results
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'My Legal Notice',
  applicationCategory: 'LegalService',
  description: 'AI-powered legal document drafting platform for Indian advocates. Generate BNS 2023-compliant notices, court complaints, and agreements in seconds.',
  url: 'https://www.mylegalnotice.in',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', description: 'Free tier with 500 credits' },
  operatingSystem: 'Web',
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', ratingCount: '1200', bestRating: '5' },
};

// ── Static data ──────────────────────────────────────────────────────────
const STEPS = [
  { step: '01', title: 'Describe your case', desc: 'Tell the AI your case facts, parties involved, and the type of legal document you need.' },
  { step: '02', title: 'AI drafts instantly', desc: 'Our model applies BNS 2023, BNSS, IEA, and CPC automatically. Zero hallucinations.' },
  { step: '03', title: 'Refine & export', desc: 'Edit in the workspace, chat with AI to refine clauses, export as PDF with your letterhead.' },
];

const FEATURES = [
  { title: 'BNS 2023 Drafting', desc: 'Notices, NDAs, plaints & petitions grounded in Bharatiya Nyaya Sanhita, IEA, and CPC.' },
  { title: 'Deep Legal Intelligence', desc: 'No hallucinations. AI arguments backed by verified Indian Supreme Court judgments.' },
  { title: 'Save 10+ Hours/Week', desc: 'Upload any PDF and instantly extract key clauses, arguments, and legal summaries.' },
  { title: 'Indian Law Research', desc: 'Ask any question about Indian law — get cited answers with section references.' },
  { title: '17 Regional Languages', desc: 'Draft in Hindi, Tamil, Telugu, Marathi, Bengali and 12 more regional languages.' },
  { title: 'Bank-grade Encryption', desc: 'All client data and drafts encrypted end-to-end. SOC 2 compliant infrastructure.' },
];

const TESTIMONIALS = [
  { name: 'Adv. Priya Mehta', location: 'Mumbai High Court', text: 'I used to spend 3 hours drafting each legal notice. Now it takes 5 minutes. My client turnaround has doubled.' },
  { name: 'Adv. Rakesh Kumar', location: 'Delhi District Court', text: 'The BNS 2023 compliance is spot-on. No more worrying about outdated IPC sections.' },
  { name: 'Adv. Sunita Rao', location: 'Hyderabad HC', text: 'My junior advocates use it for first drafts, I review and sign. We handle 3× more cases every month.' },
];

const STATS = [
  { value: '5,000+', label: 'Notices Drafted' },
  { value: '1,200+', label: 'Advocates Onboarded' },
  { value: '17', label: 'Indian Languages' },
  { value: '9.4/10', label: 'Avg Satisfaction' },
];

const DEMO_LINES = [
  'Notice type: Legal Notice under BNS § 420',
  'Sender: Advocate Meera Sharma',
  'Respondent: ABC Pvt. Ltd.',
  'Amount: ₹4,50,000 due since 90 days',
  'Jurisdiction: Delhi High Court',
];

// ── Shared style tokens ──────────────────────────────────────────────────
const card = {
  p: 3.5, borderRadius: '18px', height: '100%',
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
  transition: 'all 0.3s',
  '&:hover': { transform: 'translateY(-3px)' },
};

// ══════════════════════════════════════════════════════════════════════════
//  PAGE — 100 % Server Component (SSR)
// ══════════════════════════════════════════════════════════════════════════
export default function Page() {
  return (
    <>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Box sx={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        bgcolor: 'background.default', color: 'text.primary',
        // Counteract the global Providers wrapper padding for full-bleed layout
        mx: { xs: -2, md: -4 }, mt: { xs: -2, md: -4 }, mb: { xs: -2, md: -4 },
      }}>

        {/* ── BACKGROUND ──────────────────────────────────────────────── */}
        <Box sx={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <Box sx={{
            position: 'absolute', top: '-15%', left: '-5%',
            width: { xs: 300, md: 700 }, height: { xs: 300, md: 700 },
            background: 'radial-gradient(circle, rgba(26,35,126,0.07) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
          <Box sx={{
            position: 'absolute', bottom: '-10%', right: '-8%',
            width: { xs: 250, md: 600 }, height: { xs: 250, md: 600 },
            background: 'radial-gradient(circle, rgba(197,160,89,0.05) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
          <Box sx={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(26,35,126,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(26,35,126,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </Box>

        {/* ── NAVBAR ──────────────────────────────────────────────────── */}
        <Box component="nav" sx={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          px: { xs: 3, md: 6 }, py: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backdropFilter: 'blur(20px)',
          bgcolor: 'rgba(248,250,252,0.85)',
          borderBottom: '1px solid', borderColor: 'divider',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: '10px',
              background: 'linear-gradient(135deg, #1a237e 0%, #311b92 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(26,35,126,0.2)',
            }}>
              <Typography sx={{ fontSize: '1.1rem' }}>⚖️</Typography>
            </Box>
            <Typography fontWeight={800} fontSize="1.1rem" sx={{ letterSpacing: '-0.02em' }}>
              My Legal Notice
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
            {[['Features', '#features'], ['How it works', '#how'], ['Templates', '/dashboard/templates']].map(([label, href]) => (
              <Link key={label} href={href} style={{ textDecoration: 'none' }}>
                <Typography variant="body2" fontWeight={500}
                  sx={{ color: 'text.secondary', transition: 'color 0.2s', '&:hover': { color: 'primary.main' } }}>
                  {label}
                </Typography>
              </Link>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <LandingNavAuth />
          </Box>
        </Box>

        {/* ── HERO ────────────────────────────────────────────────────── */}
        <Box component="section" sx={{
          position: 'relative', zIndex: 1,
          pt: { xs: 18, md: 26 }, pb: { xs: 12, md: 20 },
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(248,250,252,1) 0%, rgba(26,35,126,0.04) 50%, rgba(197,160,89,0.03) 100%)',
        }}>
          <Container maxWidth="lg">
            {/* Badge */}
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.8,
              borderRadius: '999px', mb: 5,
              bgcolor: 'rgba(26,35,126,0.06)', border: '1px solid rgba(26,35,126,0.12)',
            }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
              <Typography variant="body2" fontWeight={600} sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
                🇮🇳 Built for Indian Advocates — BNS 2023 Ready
              </Typography>
            </Box>

            <Typography component="h1" variant="h1" fontWeight={900} sx={{
              fontSize: { xs: '2.6rem', sm: '3.5rem', md: '5rem' },
              lineHeight: 1.08, letterSpacing: '-0.04em', mb: 4,
            }}>
              Your Complete Legal AI<br />
              <Box component="span" sx={{
                background: 'linear-gradient(90deg, #1a237e 0%, #c5a059 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Toolkit for Advocates
              </Box>
            </Typography>

            <Typography component="p" sx={{
              fontSize: { xs: '1.05rem', md: '1.2rem' }, color: 'text.secondary',
              maxWidth: 600, mx: 'auto', lineHeight: 1.8, mb: 6,
            }}>
              Draft legal notices, build arguments, create memos, research case law &amp; extract clauses from PDFs — all powered by BNS 2023-compliant AI.
            </Typography>

            {/* CTAs */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 8 }}>
              <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                <Button variant="contained" size="large"
                  sx={{
                    px: { xs: 4, md: 6 }, py: 2, borderRadius: '14px', fontSize: '1.05rem', fontWeight: 700,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #1a237e 0%, #311b92 100%)',
                    boxShadow: '0 8px 32px rgba(26,35,126,0.25)',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 16px 40px rgba(26,35,126,0.35)' },
                    transition: 'all 0.25s',
                  }}>
                  Explore Tools — It&apos;s Free →
                </Button>
              </Link>
              <Link href="/dashboard/templates" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" size="large"
                  sx={{
                    px: { xs: 4, md: 5 }, py: 2, borderRadius: '14px', fontSize: '1.05rem', fontWeight: 600,
                    textTransform: 'none', borderColor: 'divider', color: 'text.primary',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(26,35,126,0.04)', transform: 'translateY(-2px)' },
                    transition: 'all 0.25s',
                  }}>
                  Browse Templates
                </Button>
              </Link>
            </Box>

            {/* Stats */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: { xs: 4, md: 8 } }}>
              {STATS.map(s => (
                <Box key={s.value} sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' }, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>
                    {s.value}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', fontWeight: 500, mt: 0.5 }}>
                    {s.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        {/* ── PRODUCT DEMO ────────────────────────────────────────────── */}
        <Box component="section" sx={{ position: 'relative', zIndex: 1, pb: { xs: 10, md: 14 } }}>
          <Container maxWidth="lg">
            <Box sx={{
              borderRadius: '24px', overflow: 'hidden',
              border: '1px solid', borderColor: 'divider',
              bgcolor: 'background.paper',
              boxShadow: '0 40px 80px rgba(26,35,126,0.08)',
              p: { xs: 3, md: 5 },
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                {['#ff5f57', '#febc2e', '#28c840'].map(c => (
                  <Box key={c} sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: c }} />
                ))}
                <Box sx={{ ml: 2, flex: 1, height: 28, borderRadius: '6px', bgcolor: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', px: 2 }}>
                  <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>www.mylegalnotice.in/generate</Typography>
                </Box>
              </Box>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Box sx={{ bgcolor: 'rgba(0,0,0,0.015)', borderRadius: '12px', p: 3, border: '1px solid', borderColor: 'divider' }}>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'primary.main', mb: 2, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Case Facts</Typography>
                    {DEMO_LINES.map(line => (
                      <Box key={line} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
                        <Box sx={{ width: 13, height: 13, borderRadius: '50%', bgcolor: 'success.main', mt: '3px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography sx={{ fontSize: '0.55rem', color: 'white', lineHeight: 1 }}>✓</Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', lineHeight: 1.5 }}>{line}</Typography>
                      </Box>
                    ))}
                    <Button fullWidth variant="contained" size="small"
                      sx={{ mt: 2.5, borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: '0.82rem', background: 'linear-gradient(135deg, #1a237e 0%, #311b92 100%)', boxShadow: '0 4px 16px rgba(26,35,126,0.2)' }}>
                      ⚡ Generate Draft
                    </Button>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 7 }}>
                  <Box sx={{ bgcolor: 'rgba(0,0,0,0.015)', borderRadius: '12px', p: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'success.main', letterSpacing: '0.08em', textTransform: 'uppercase' }}>✓ Draft Generated in 2.3s</Typography>
                      <Chip label="BNS § 420" size="small" sx={{ bgcolor: 'rgba(26,35,126,0.08)', color: 'primary.main', fontSize: '0.68rem', height: 20 }} />
                    </Box>
                    {['Subject: Legal Notice Under Bharatiya Nyaya Sanhita, 2023', '', 'Without Prejudice', '', 'To,', 'The Directors, ABC Private Limited, New Delhi.', '', 'Under instructions from my client, Advocate Meera Sharma...', 'You are directed to pay ₹4,50,000 within 15 days...', '', 'Failing compliance, my client shall initiate...'].map((line, i) => (
                      <Box key={i} sx={{ height: line === '' ? 8 : 'auto', mb: line === '' ? 0 : 0.5 }}>
                        {line !== '' && <Box sx={{ height: 10, borderRadius: '4px', bgcolor: 'rgba(26,35,126,0.04)', width: line.length > 50 ? '100%' : `${Math.max(30, line.length * 1.3)}%` }} />}
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>

        {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
        <Box component="section" id="how" sx={{ position: 'relative', zIndex: 1, py: { xs: 10, md: 16 }, bgcolor: 'rgba(26,35,126,0.015)' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 10 }}>
              <Chip label="HOW IT WORKS" size="small" sx={{ bgcolor: 'rgba(26,35,126,0.08)', color: 'primary.main', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', mb: 2 }} />
              <Typography component="h2" variant="h3" fontWeight={900} sx={{ letterSpacing: '-0.03em', fontSize: { xs: '2rem', md: '3rem' } }}>
                From facts to court-ready draft<br />in under 60 seconds
              </Typography>
            </Box>
            <Grid container spacing={4}>
              {STEPS.map((s, i) => {
                const colors = ['#1a237e', '#c5a059', '#00796b'];
                return (
                  <Grid size={{ xs: 12, md: 4 }} key={s.step}>
                    <Box sx={{
                      ...card, position: 'relative', p: 4, borderRadius: '20px',
                      boxShadow: '0 4px 20px rgba(26,35,126,0.04)',
                      '&:hover': { transform: 'translateY(-4px)', borderColor: `${colors[i]}40`, boxShadow: '0 20px 40px rgba(26,35,126,0.08)' },
                    }}>
                      <Box sx={{ width: 48, height: 48, borderRadius: '14px', mb: 3, bgcolor: `${colors[i]}12`, border: `1px solid ${colors[i]}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography sx={{ fontSize: '1.2rem' }}>{['📋', '⚡', '📤'][i]}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: '4rem', fontWeight: 900, color: colors[i], opacity: 0.06, lineHeight: 1, position: 'absolute', top: 16, right: 24, fontFamily: 'monospace' }}>{s.step}</Typography>
                      <Typography variant="h6" fontWeight={800} mb={1.5}>{s.title}</Typography>
                      <Typography sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: '0.92rem' }}>{s.desc}</Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Container>
        </Box>

        {/* ── FEATURES ────────────────────────────────────────────────── */}
        <Box component="section" id="features" sx={{ position: 'relative', zIndex: 1, py: { xs: 10, md: 14 } }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 10 }}>
              <Chip label="FEATURES" size="small" sx={{ bgcolor: 'rgba(197,160,89,0.12)', color: 'secondary.main', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', mb: 2 }} />
              <Typography component="h2" variant="h3" fontWeight={900} sx={{ letterSpacing: '-0.03em', fontSize: { xs: '2rem', md: '3rem' } }}>
                Everything your chamber needs
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {FEATURES.map((f, i) => {
                const icons = ['⚖️', '🧠', '⏱️', '🔍', '🌐', '🔒'];
                const colors = ['#1a237e', '#c5a059', '#00796b', '#0284c7', '#d97706', '#311b92'];
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={f.title}>
                    <Box sx={{
                      ...card,
                      boxShadow: '0 2px 12px rgba(26,35,126,0.03)',
                      '&:hover': { transform: 'translateY(-3px)', borderColor: `${colors[i]}30` },
                    }}>
                      <Box sx={{ width: 44, height: 44, borderRadius: '12px', mb: 2.5, bgcolor: `${colors[i]}10`, border: `1px solid ${colors[i]}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography sx={{ fontSize: '1.2rem' }}>{icons[i]}</Typography>
                      </Box>
                      <Typography fontWeight={800} mb={1} sx={{ fontSize: '1rem' }}>{f.title}</Typography>
                      <Typography sx={{ color: 'text.secondary', lineHeight: 1.75, fontSize: '0.875rem' }}>{f.desc}</Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Container>
        </Box>

        {/* ── TESTIMONIALS ────────────────────────────────────────────── */}
        <Box component="section" sx={{ position: 'relative', zIndex: 1, py: { xs: 10, md: 14 }, bgcolor: 'rgba(26,35,126,0.015)' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography component="h2" variant="h3" fontWeight={900} sx={{ letterSpacing: '-0.03em', fontSize: { xs: '1.8rem', md: '2.6rem' } }}>
                Trusted by advocates across India
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {TESTIMONIALS.map((t) => (
                <Grid size={{ xs: 12, md: 4 }} key={t.name}>
                  <Box sx={{
                    ...card, p: 4, borderRadius: '20px',
                    boxShadow: '0 4px 20px rgba(26,35,126,0.04)',
                    '&:hover': { transform: 'translateY(-3px)' },
                  }}>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Typography key={i} sx={{ fontSize: '0.85rem', mr: 0.3 }}>⭐</Typography>
                      ))}
                    </Box>
                    <Typography sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: '0.92rem', mb: 3, fontStyle: 'italic' }}>
                      &ldquo;{t.text}&rdquo;
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #1a237e 0%, #311b92 100%)', fontSize: '0.8rem', fontWeight: 700 }}>
                        {t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{t.name}</Typography>
                        <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>{t.location}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <Box component="section" sx={{ position: 'relative', zIndex: 1, py: { xs: 10, md: 16 } }}>
          <Container maxWidth="md">
            <Box sx={{
              textAlign: 'center', p: { xs: 5, md: 10 }, borderRadius: '28px',
              background: 'linear-gradient(135deg, #1a237e 0%, #311b92 100%)',
              boxShadow: '0 40px 80px rgba(26,35,126,0.25)',
              position: 'relative', overflow: 'hidden',
            }}>
              <Box sx={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
              <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 150, height: 150, background: 'radial-gradient(circle, rgba(197,160,89,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
              <Box sx={{ position: 'relative' }}>
                <Chip label="FREE TO START" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.95)', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', mb: 3 }} />
                <Typography component="h2" variant="h3" fontWeight={900} sx={{ color: 'white', mb: 2, letterSpacing: '-0.03em', fontSize: { xs: '1.8rem', md: '2.8rem' } }}>
                  Ready to transform your<br />legal practice?
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 5, lineHeight: 1.8, maxWidth: 480, mx: 'auto' }}>
                  No credit card needed. Start drafting your first AI-powered legal notice in under 60 seconds.
                </Typography>
                <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                  <Button variant="contained" size="large"
                    sx={{
                      px: 6, py: 2, borderRadius: '14px', fontSize: '1.05rem', fontWeight: 700, textTransform: 'none',
                      background: 'white', color: '#1a237e',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                      '&:hover': { background: '#f0f4ff', transform: 'translateY(-2px)', boxShadow: '0 16px 40px rgba(0,0,0,0.4)' },
                      transition: 'all 0.25s',
                    }}>
                    Get Started Free →
                  </Button>
                </Link>
                <Typography sx={{ mt: 3, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                  ✓ No sign-up required &nbsp;&nbsp; ✓ 500 free credits &nbsp;&nbsp; ✓ Cancel anytime
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>

      </Box>
    </>
  );
}
