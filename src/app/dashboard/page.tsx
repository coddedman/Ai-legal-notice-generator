"use client"
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Avatar, LinearProgress, Paper, Chip } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { useSession, signOut, signIn } from 'next-auth/react';
import {
  Sparkles, UploadCloud, Search, FileText,
  MessageSquare, LayoutGrid, ArrowRight, ShieldCheck, Scale, History,
  TrendingUp, CreditCard, Clock, CheckCircle, Activity, LogOut, Zap, Crown, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import GuestBanner from '@/components/GuestBanner';

export default function Dashboard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const P = theme.palette.primary.main;
  const G = theme.palette.secondary.main; // Gold

  const { data: session, status } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isGuest = status === 'unauthenticated';

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/stats')
        .then(r => r.json())
        .then(d => { setStats(d); setLoading(false); })
        .catch(() => setLoading(false));
    }
    if (status === 'unauthenticated') setLoading(false);
  }, [status]);

  if (status === 'loading') {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="70vh" gap={2}>
        <Box sx={{ width: 48, height: 48, borderRadius: '14px', background: `linear-gradient(135deg, ${P}, ${G})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Scale size={24} color="white" />
        </Box>
        <Typography color="text.secondary" fontWeight={600}>Loading workspace…</Typography>
      </Box>
    );
  }

  const firstName = session?.user?.name?.split(' ')[0] || 'Advocate';
  const credits = stats?.credits ?? 0;
  const totalDrafts = stats?.totalNotices ?? 0;
  const notices = stats?.legalNotices ?? 0;
  const creditsPercent = Math.min(100, (credits / 500) * 100);

  // Shared card style
  const card = (extra?: object) => ({
    borderRadius: '20px',
    border: '1px solid',
    borderColor: isDark ? alpha('#fff', 0.06) : alpha('#000', 0.06),
    bgcolor: isDark ? alpha('#fff', 0.02) : 'background.paper',
    transition: 'all 0.35s cubic-bezier(.4,0,.2,1)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    ...extra,
  });

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>

      {/* ── Ambient background ────────────────────────────────────── */}
      <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <Box sx={{
          position: 'absolute', top: '-8%', right: '-5%',
          width: { xs: 300, md: 600 }, height: { xs: 300, md: 600 },
          background: `radial-gradient(circle, ${alpha(P, 0.06)} 0%, transparent 70%)`,
          borderRadius: '50%',
        }} />
        <Box sx={{
          position: 'absolute', bottom: '10%', left: '-5%',
          width: { xs: 250, md: 500 }, height: { xs: 250, md: 500 },
          background: `radial-gradient(circle, ${alpha(G, 0.04)} 0%, transparent 70%)`,
          borderRadius: '50%',
        }} />
      </Box>

      {isGuest && <GuestBanner />}

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, pt: { xs: 3, md: 4 }, pb: 8, position: 'relative', zIndex: 1 }}>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/*  HEADER                                                      */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 4, md: 5 } }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{
              width: 44, height: 44, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `linear-gradient(135deg, ${isDark ? P : '#1a237e'} 0%, ${isDark ? theme.palette.primary.dark : '#311b92'} 100%)`,
              boxShadow: `0 4px 16px ${alpha(P, 0.3)}`,
            }}>
              <Scale size={22} color="white" />
            </Box>
            <Box>
              <Typography fontWeight={800} sx={{ fontSize: '1.15rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                AI Legal Desk
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {isGuest ? 'Guest workspace' : 'Premium workspace'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            {isGuest ? (
              <>
                <Button component={Link} href="/" variant="text" size="small"
                  sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'none', display: { xs: 'none', md: 'inline-flex' } }}>Home</Button>
                <Button variant="contained" onClick={() => signIn()} size="small"
                  sx={{ fontWeight: 700, textTransform: 'none', borderRadius: '10px', boxShadow: 'none' }}>
                  Sign In Free
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} href="/history" variant="text" size="small" startIcon={<History size={16} />}
                  sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'none', display: { xs: 'none', md: 'inline-flex' } }}>History</Button>
                <Button variant="outlined" size="small" startIcon={<LogOut size={14} />}
                  onClick={() => signOut({ callbackUrl: '/' })}
                  sx={{ fontWeight: 600, textTransform: 'none', borderRadius: '10px', color: 'text.secondary', borderColor: 'divider',
                    '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.08), borderColor: theme.palette.error.main, color: 'error.main' } }}>
                  Sign Out
                </Button>
                <Avatar src={session?.user?.image || ''} sx={{ width: 38, height: 38, border: '2px solid', borderColor: 'divider', ml: 0.5 }}>
                  {firstName.charAt(0)}
                </Avatar>
              </>
            )}
          </Box>
        </Box>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/*  WELCOME + HERO CTA                                          */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <Box sx={{
          ...card({
            p: { xs: 4, md: 6 }, mb: 4,
            background: isDark
              ? `linear-gradient(135deg, ${alpha(P, 0.12)} 0%, ${alpha(G, 0.06)} 100%)`
              : `linear-gradient(135deg, #1a237e 0%, #283593 60%, ${alpha(G, 0.4)} 100%)`,
            border: isDark ? `1px solid ${alpha(P, 0.15)}` : 'none',
            boxShadow: isDark ? `0 8px 32px ${alpha(P, 0.15)}` : '0 12px 40px rgba(26,35,126,0.25)',
          }),
        }}>
          {/* Decorative accent */}
          <Box sx={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: `radial-gradient(circle, ${alpha(G, isDark ? 0.15 : 0.2)} 0%, transparent 70%)` }} />
          <Box sx={{ position: 'absolute', bottom: -20, left: '30%', width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${alpha(P, 0.1)} 0%, transparent 70%)` }} />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {!isGuest && (
              <Chip
                icon={<Crown size={13} />}
                label="Free Tier · 500 credits"
                size="small"
                sx={{
                  mb: 2.5, fontWeight: 600, fontSize: '0.72rem',
                  bgcolor: isDark ? alpha(G, 0.15) : 'rgba(255,255,255,0.18)',
                  color: isDark ? G : 'rgba(255,255,255,0.9)',
                  border: `1px solid ${isDark ? alpha(G, 0.25) : 'rgba(255,255,255,0.2)'}`,
                  '& .MuiChip-icon': { color: isDark ? G : 'rgba(255,255,255,0.9)' },
                }}
              />
            )}
            <Typography variant="h3" fontWeight={900} sx={{
              color: isDark ? 'text.primary' : 'white',
              letterSpacing: '-0.03em', lineHeight: 1.15, mb: 1.5,
              fontSize: { xs: '1.8rem', md: '2.5rem' },
            }}>
              {isGuest ? 'Explore Legal AI Tools' : `Welcome back, ${firstName}`}
            </Typography>
            <Typography sx={{
              color: isDark ? 'text.secondary' : 'rgba(255,255,255,0.7)',
              maxWidth: 520, lineHeight: 1.7, fontSize: '0.95rem', mb: 3.5,
            }}>
              {isGuest
                ? 'Try any tool below for free. Sign in to save your work and track your drafting history.'
                : 'Your AI-powered legal workspace is ready. Start a new draft or continue where you left off.'}
            </Typography>
            <Link href="/generate" style={{ textDecoration: 'none' }}>
              <Button variant="contained" size="large" endIcon={<Sparkles size={18} />}
                sx={{
                  px: 4, py: 1.5, borderRadius: '12px', fontSize: '0.95rem', fontWeight: 700, textTransform: 'none',
                  background: isDark ? `linear-gradient(135deg, ${P}, ${theme.palette.primary.dark})` : 'white',
                  color: isDark ? 'white' : '#1a237e',
                  boxShadow: isDark ? `0 4px 20px ${alpha(P, 0.4)}` : '0 4px 20px rgba(0,0,0,0.15)',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: isDark ? `0 8px 28px ${alpha(P, 0.5)}` : '0 8px 28px rgba(0,0,0,0.2)' },
                  transition: 'all 0.25s',
                }}>
                Start New AI Draft
              </Button>
            </Link>
          </Box>
        </Box>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/*  STATS BENTO GRID (authenticated)                            */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {!isGuest && (
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {/* Credits — wide card */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{
                ...card({ p: 3.5 }),
                display: 'flex', alignItems: 'center', gap: 3,
                '&:hover': { borderColor: alpha(P, 0.2), boxShadow: `0 8px 24px ${alpha(P, 0.08)}` },
              }}>
                <Box sx={{
                  width: 56, height: 56, borderRadius: '16px', flexShrink: 0,
                  background: `linear-gradient(135deg, ${P} 0%, ${theme.palette.primary.dark || P} 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 4px 16px ${alpha(P, 0.3)}`,
                }}>
                  <CreditCard size={24} color="white" />
                </Box>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="baseline" mb={0.5}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>Credits Available</Typography>
                    <Typography variant="caption" color="text.disabled">{credits}/500</Typography>
                  </Box>
                  <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: '-0.03em', lineHeight: 1, mb: 1.5 }}>{credits}</Typography>
                  <LinearProgress variant="determinate" value={creditsPercent}
                    sx={{
                      height: 8, borderRadius: 4,
                      bgcolor: isDark ? alpha('#fff', 0.06) : alpha('#000', 0.04),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: `linear-gradient(90deg, ${P}, ${G})`,
                      },
                    }}
                  />
                </Box>
              </Box>
            </Grid>

            {/* 3 small stat cards */}
            {[
              { icon: <TrendingUp size={20} />, label: 'Total Drafts', value: totalDrafts, color: theme.palette.success.main },
              { icon: <FileText size={20} />, label: 'Legal Notices', value: notices, color: G },
              { icon: <CheckCircle size={20} />, label: 'Plan', value: 'Free', color: P },
            ].map((s) => (
              <Grid key={s.label} size={{ xs: 4, md: 2 }}>
                <Box sx={{
                  ...card({ p: 2.5, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }),
                  '&:hover': { borderColor: alpha(s.color, 0.3), transform: 'translateY(-2px)' },
                }}>
                  <Box sx={{ color: s.color, mb: 1 }}>{s.icon}</Box>
                  <Typography fontWeight={900} sx={{ fontSize: '1.5rem', letterSpacing: '-0.03em', lineHeight: 1, mb: 0.5 }}>{s.value}</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>{s.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {/* ══════════════════════════════════════════════════════════════ */}
        {/*  TOOLS — BENTO LAYOUT                                        */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <Typography fontWeight={800} sx={{ fontSize: '1.1rem', letterSpacing: '-0.01em', mb: 2.5, mt: 2 }}>
          Legal Tools
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { title: 'AI Draft Generator', desc: 'Generate BNS 2023-compliant notices, complaints & agreements', icon: <Sparkles size={24} />, path: '/generate', featured: true, color: P },
            { title: 'Legal Memo', desc: 'Build structured legal memorandums', icon: <FileText size={24} />, path: '/dashboard/memo', color: '#0284c7' },
            { title: 'Build Arguments', desc: 'AI-assisted legal argument builder', icon: <ShieldCheck size={24} />, path: '/dashboard/arguments', color: G },
            { title: 'Upload PDF', desc: 'Extract clauses from any legal PDF', icon: <UploadCloud size={24} />, path: '/dashboard/upload', color: '#059669' },
            { title: 'Templates', desc: '9+ ready-to-use Indian legal templates', icon: <LayoutGrid size={24} />, path: '/dashboard/templates', color: '#d97706' },
            { title: 'Legal Research', desc: 'AI search across Indian case law', icon: <Search size={24} />, path: '/dashboard/research', color: '#7c3aed' },
          ].map((tool) => (
            <Grid key={tool.title} size={{ xs: 12, sm: 6, md: tool.featured ? 6 : 3 }}>
              <Box
                component={Link} href={tool.path}
                sx={{
                  ...card({
                    p: tool.featured ? 3.5 : 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: tool.featured ? 'row' : 'column',
                    alignItems: tool.featured ? 'center' : 'flex-start',
                    gap: tool.featured ? 3 : 0,
                    textDecoration: 'none',
                    color: 'inherit',
                  }),
                  '&:hover': {
                    borderColor: alpha(tool.color, 0.3),
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 28px ${alpha(tool.color, isDark ? 0.15 : 0.1)}`,
                    '& .tool-icon': { transform: 'scale(1.1) rotate(-5deg)', boxShadow: `0 6px 20px ${alpha(tool.color, 0.3)}` },
                    '& .tool-arrow': { opacity: 1, transform: 'translateX(0)' },
                  },
                }}
              >
                <Box className="tool-icon" sx={{
                  width: tool.featured ? 60 : 48, height: tool.featured ? 60 : 48,
                  borderRadius: tool.featured ? '18px' : '14px', flexShrink: 0,
                  bgcolor: alpha(tool.color, isDark ? 0.15 : 0.08),
                  border: `1px solid ${alpha(tool.color, 0.12)}`,
                  color: tool.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mb: tool.featured ? 0 : 2,
                  transition: 'all 0.3s ease',
                }}>
                  {tool.icon}
                </Box>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography fontWeight={700} sx={{ fontSize: tool.featured ? '1.05rem' : '0.9rem', letterSpacing: '-0.01em', mb: 0.5 }}>
                      {tool.title}
                    </Typography>
                    <Box className="tool-arrow" sx={{ opacity: 0, transform: 'translateX(-6px)', transition: 'all 0.3s ease', color: 'text.disabled' }}>
                      <ChevronRight size={18} />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, fontSize: '0.82rem' }}>
                    {tool.desc}
                  </Typography>
                </Box>
                {tool.featured && (
                  <Chip label="Popular" size="small" sx={{
                    bgcolor: alpha(tool.color, 0.1), color: tool.color,
                    fontWeight: 700, fontSize: '0.68rem', height: 22,
                    border: `1px solid ${alpha(tool.color, 0.15)}`,
                  }} />
                )}
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/*  QUICK ACTIONS ROW                                           */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {!isGuest && (
          <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            {[
              { label: 'Session History', icon: <History size={16} />, path: '/history' },
              { label: 'Browse Templates', icon: <LayoutGrid size={16} />, path: '/dashboard/templates' },
            ].map((q) => (
              <Button key={q.label} component={Link} href={q.path} variant="outlined" size="small" startIcon={q.icon}
                sx={{
                  borderRadius: '10px', textTransform: 'none', fontWeight: 600, fontSize: '0.82rem',
                  borderColor: 'divider', color: 'text.secondary',
                  '&:hover': { borderColor: P, color: P, bgcolor: alpha(P, 0.04) },
                }}>
                {q.label}
              </Button>
            ))}
          </Box>
        )}

        {/* ══════════════════════════════════════════════════════════════ */}
        {/*  RECENT ACTIVITY                                             */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {!isGuest && (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
              <Typography fontWeight={800} sx={{ fontSize: '1.1rem', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Activity size={18} color={P} /> Recent Activity
              </Typography>
            </Box>
            <Paper sx={{
              borderRadius: '16px', border: '1px solid', borderColor: 'divider',
              bgcolor: isDark ? alpha('#fff', 0.02) : 'background.paper',
              overflow: 'hidden', boxShadow: 'none',
            }}>
              {(!stats?.transactions || stats.transactions.length === 0) ? (
                <Box p={5} textAlign="center">
                  <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: alpha(P, 0.06), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                    <Clock size={22} color={P} />
                  </Box>
                  <Typography color="text.secondary" fontWeight={600}>No recent activity</Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>Start a draft to see your usage here</Typography>
                </Box>
              ) : (
                stats.transactions.map((tx: any, idx: number) => (
                  <Box key={tx.id} sx={{
                    p: 2.5, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderBottom: idx === stats.transactions.length - 1 ? 'none' : '1px solid', borderColor: 'divider',
                    transition: 'background 0.15s',
                    '&:hover': { bgcolor: isDark ? alpha('#fff', 0.02) : alpha('#000', 0.01) },
                  }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box sx={{
                        width: 36, height: 36, borderRadius: '10px',
                        bgcolor: tx.type === 'chat' ? alpha('#7c3aed', 0.08) : alpha(P, 0.08),
                        color: tx.type === 'chat' ? '#7c3aed' : P,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        {tx.type === 'chat' ? <MessageSquare size={16} /> : <FileText size={16} />}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {tx.docType === 'legalNotice' ? 'Legal Notice' : tx.docType === 'complaintDraft' ? 'Criminal Complaint' : tx.docType === 'chat-assistant' ? 'AI Co-pilot' : tx.docType}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tx.tokens ? `${tx.tokens.toLocaleString()} tokens · ` : ''}
                          {tx.createdAt ? formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true }) : ''}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={`${tx.amount > 0 ? '+' : ''}${tx.amount} cr`}
                      size="small"
                      sx={{
                        fontWeight: 700, fontSize: '0.78rem', height: 26,
                        color: tx.amount < 0 ? 'error.main' : 'success.main',
                        bgcolor: tx.amount < 0 ? alpha(theme.palette.error.main, 0.08) : alpha(theme.palette.success.main, 0.08),
                        border: `1px solid ${tx.amount < 0 ? alpha(theme.palette.error.main, 0.15) : alpha(theme.palette.success.main, 0.15)}`,
                      }}
                    />
                  </Box>
                ))
              )}
            </Paper>
          </Box>
        )}

      </Box>
    </Box>
  );
}
