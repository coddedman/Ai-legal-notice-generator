"use client"
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Grid, Avatar, LinearProgress, Paper
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSession, signOut, signIn } from 'next-auth/react';
import {
  Sparkles, UploadCloud, Search, FileText,
  MessageSquare, LayoutGrid, ArrowRight, ShieldCheck, Scale, History,
  TrendingUp, CreditCard, Clock, CheckCircle, Activity, LogOut
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import GuestBanner from '@/components/GuestBanner';

// ── Action Card (Horizontal) ─────────────────────────────────────────────
function ActionCard({ title, desc, icon, path, primary = false }: { title: string; desc: string; icon: React.ReactNode; path: string; primary?: boolean }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accent = theme.palette.primary.main;

  return (
    <Card
      component={Link} href={path}
      sx={{
        borderRadius: '20px', border: '1px solid', textDecoration: 'none',
        borderColor: primary ? `${accent}30` : 'divider',
        bgcolor: 'background.paper',
        boxShadow: primary
          ? (isDark ? `0 8px 24px ${accent}15` : `0 8px 24px ${accent}10`)
          : 'none',
        height: '100%', display: 'flex', alignItems: 'center',
        p: { xs: 2.5, md: 3 }, position: 'relative', overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&::before': primary ? {
          content: '""', position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
          background: isDark
            ? `linear-gradient(to bottom, ${accent}, ${theme.palette.secondary.main})`
            : 'linear-gradient(to bottom, #1a237e, #c5a059)',
        } : {},
        '&:hover': {
          borderColor: primary ? accent : `${accent}30`,
          transform: 'translateY(-4px)',
          boxShadow: isDark ? `0 16px 40px ${accent}20` : `0 16px 40px ${accent}12`,
          '& .icon-wrapper': { transform: 'scale(1.05) rotate(-3deg)' },
          '& .arrow': { transform: 'translateX(4px)', color: accent },
        },
      }}
    >
      <Box className="icon-wrapper" sx={{
        width: 60, height: 60, borderRadius: '16px',
        bgcolor: primary ? (isDark ? accent : '#1a237e') : `${accent}10`,
        color: primary ? 'white' : accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, mr: 3, transition: 'all 0.3s ease',
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5, letterSpacing: '-0.01em' }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{desc}</Typography>
      </Box>
      <Box className="arrow" sx={{ color: 'text.disabled', ml: 2, transition: 'all 0.3s ease' }}>
        <ArrowRight size={22} />
      </Box>
    </Card>
  );
}

// ── Tool Card (Vertical) ──────────────────────────────────────────────────
function ToolCard({ title, icon, path }: { title: string; icon: React.ReactNode; path: string }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accent = theme.palette.primary.main;

  return (
    <Card
      component={Link} href={path}
      sx={{
        borderRadius: '20px', border: '1px solid', borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: 'none', textDecoration: 'none',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center',
        p: 3, py: 4, height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: `${accent}30`,
          transform: 'translateY(-4px)',
          boxShadow: isDark ? `0 12px 24px rgba(0,0,0,0.3)` : `0 12px 24px ${accent}08`,
          '& .icon': { color: accent, transform: 'translateY(-2px)' },
        },
      }}
    >
      <Box className="icon" sx={{ color: 'text.secondary', mb: 2, transition: 'all 0.3s ease' }}>
        {icon}
      </Box>
      <Typography variant="subtitle2" fontWeight={700}>{title}</Typography>
    </Card>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, subtext, highlight }: { icon: React.ReactNode; label: string; value: string | number; subtext: string; highlight?: boolean }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (highlight) {
    return (
      <Card sx={{
        borderRadius: '20px', p: 1, height: '100%', border: 'none',
        background: isDark
          ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
          : 'linear-gradient(135deg, #1a237e 0%, #311b92 100%)',
        color: 'white',
        boxShadow: isDark ? `0 12px 24px ${theme.palette.primary.main}30` : '0 12px 24px rgba(26,35,126,0.2)',
      }}>
        <CardContent sx={{ pb: '16px !important' }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            {icon}
            <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {label}
            </Typography>
          </Box>
          <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.03em' }}>{value}</Typography>
          <Box sx={{ mt: 3 }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, (Number(value) / 500) * 100)}
              sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: 'white', borderRadius: 3 } }}
            />
          </Box>
          <Typography variant="caption" sx={{ mt: 1.5, display: 'block', opacity: 0.8, fontWeight: 500 }}>{subtext}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{
      borderRadius: '20px', height: '100%', border: '1px solid', borderColor: 'divider',
      bgcolor: 'background.paper', boxShadow: 'none',
    }}>
      <CardContent sx={{ pb: '16px !important' }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          {icon}
          <Typography variant="caption" color="text.secondary" fontWeight={600}>{label}</Typography>
        </Box>
        <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>{value}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontWeight: 500 }}>{subtext}</Typography>
      </CardContent>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  DASHBOARD PAGE
// ══════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accent = theme.palette.primary.main;
  const gold = theme.palette.secondary.main;

  const { data: session, status } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isGuest = status === 'unauthenticated';

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/stats')
        .then(res => res.json())
        .then(data => { setStats(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
    if (status === 'unauthenticated') setLoading(false);
  }, [status]);

  if (status === 'loading') {
    return (
      <Box p={6} display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh" gap={2}>
        <Box sx={{
          width: 44, height: 44, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1,
          background: isDark
            ? `linear-gradient(135deg, ${accent}, ${theme.palette.primary.dark})`
            : 'linear-gradient(135deg, #1a237e, #311b92)',
        }}>
          <Scale size={22} color="white" />
        </Box>
        <Typography color="text.secondary" fontWeight={600}>Loading your workspace…</Typography>
        <Typography variant="caption" color="text.disabled">Setting up your legal AI desk</Typography>
      </Box>
    );
  }

  const firstName = session?.user?.name?.split(' ')[0] || 'Advocate';

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      position: 'relative',
    }}>
      {/* Background decoration */}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '40vh',
        background: isDark
          ? `linear-gradient(180deg, ${accent}08 0%, transparent 100%)`
          : 'linear-gradient(180deg, rgba(26,35,126,0.03) 0%, transparent 100%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {isGuest && <GuestBanner />}

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 3, md: 5 }, width: '100%', pb: 10, zIndex: 1, position: 'relative' }}>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <Box sx={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          mb: 7, pb: 3, borderBottom: '1px solid', borderColor: 'divider',
        }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{
              p: 1, borderRadius: 2, color: 'white',
              background: isDark
                ? `linear-gradient(135deg, ${accent}, ${theme.palette.primary.dark})`
                : 'linear-gradient(135deg, #1a237e, #311b92)',
            }}>
              <Scale size={24} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: '-0.02em', lineHeight: 1 }}>AI Legal Desk</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {isGuest ? 'Explore our legal tools' : 'Premium Workspace'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            {isGuest ? (
              <>
                <Button component={Link} href="/" variant="text"
                  sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'none' }}>Home</Button>
                <Button variant="contained" onClick={() => signIn()}
                  sx={{
                    fontWeight: 700, textTransform: 'none', borderRadius: '10px',
                    background: isDark ? `linear-gradient(135deg, ${accent}, ${theme.palette.primary.dark})` : 'linear-gradient(135deg, #1a237e, #311b92)',
                    boxShadow: 'none', '&:hover': { opacity: 0.9 },
                  }}>
                  Sign In Free
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} href="/history" variant="text" startIcon={<History size={18} />}
                  sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'none' }}>Session History</Button>
                <Button variant="outlined" startIcon={<LogOut size={16} />}
                  onClick={() => signOut({ callbackUrl: '/' })}
                  sx={{
                    fontWeight: 600, textTransform: 'none', fontSize: '0.85rem',
                    color: 'text.secondary', borderColor: 'divider', borderRadius: '10px',
                    '&:hover': { bgcolor: 'error.main', borderColor: 'error.main', color: 'white' },
                  }}>
                  Sign Out
                </Button>
                <Avatar src={session?.user?.image || ''} sx={{
                  width: 40, height: 40, border: '2px solid', borderColor: 'divider',
                }}>
                  {firstName.charAt(0)}
                </Avatar>
              </>
            )}
          </Box>
        </Box>

        {/* ── Stats (authenticated) ───────────────────────────────────── */}
        {!isGuest && (
          <Grid container spacing={3} sx={{ mb: 7 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard highlight icon={<CreditCard size={22} style={{ opacity: 0.9 }} />} label="Available Credits" value={stats?.credits || 0} subtext="of 500 remaining" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard icon={<TrendingUp size={22} color={theme.palette.success.main} />} label="Total Drafts" value={stats?.totalNotices || 0} subtext="All legal instruments created" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard icon={<CheckCircle size={22} color={accent} />} label="Plan Status" value="Free Tier" subtext="Basic legal automation" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard icon={<Clock size={22} color={gold} />} label="Notice Count" value={stats?.legalNotices || 0} subtext="Official notices drafted" />
            </Grid>
          </Grid>
        )}

        {/* ── Welcome ─────────────────────────────────────────────────── */}
        <Box sx={{ mb: 6, mt: !isGuest ? 0 : 2 }}>
          <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.03em', mb: 1 }}>
            {isGuest ? 'Explore Legal AI Tools' : `Welcome back, ${firstName}.`}
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={500} sx={{ maxWidth: 600 }}>
            {isGuest
              ? 'Try any tool below — sign in free to save your work and access your full drafting history.'
              : 'Manage your legal drafting history and usage limits here. What would you like to build today?'
            }
          </Typography>
        </Box>

        {/* ── Primary Actions ─────────────────────────────────────────── */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <ActionCard
              primary
              title="Start New AI Draft"
              desc="Generate notices, consumer complaints, and agreements using advanced legal AI."
              icon={<Sparkles size={28} />}
              path="/generate"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ActionCard
              title={isGuest ? 'Browse Templates' : 'Session History'}
              desc={isGuest ? 'Pick from 9+ pre-built templates for common Indian legal notices.' : `You have drafted ${stats?.totalNotices || 0} documents so far. View your latest work.`}
              icon={isGuest ? <LayoutGrid size={28} /> : <History size={28} />}
              path={isGuest ? '/dashboard/templates' : '/history'}
            />
          </Grid>
        </Grid>

        {/* ── Specialized Tools ────────────────────────────────────────── */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" fontWeight={800} mb={3} sx={{ letterSpacing: '-0.01em' }}>Specialized Legal Tools</Typography>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}><ToolCard title="Legal Memo" icon={<FileText size={28} />} path="/dashboard/memo" /></Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}><ToolCard title="Build Arguments" icon={<ShieldCheck size={28} />} path="/dashboard/arguments" /></Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}><ToolCard title="Upload PDF" icon={<UploadCloud size={28} />} path="/dashboard/upload" /></Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}><ToolCard title="Templates" icon={<LayoutGrid size={28} />} path="/dashboard/templates" /></Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}><ToolCard title="Research" icon={<Search size={28} />} path="/dashboard/research" /></Grid>
          </Grid>
        </Box>

        {/* ── Recent Activity (authenticated) ──────────────────────────── */}
        {!isGuest && (
          <Box sx={{ mt: 8 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Activity size={20} color={accent} /> Recent Usage
              </Typography>
            </Box>
            <Paper sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', overflow: 'hidden', boxShadow: 'none' }}>
              {(!stats?.transactions || stats.transactions.length === 0) ? (
                <Box p={4} textAlign="center">
                  <Typography color="text.secondary">No recent credit activity.</Typography>
                </Box>
              ) : (
                stats.transactions.map((tx: any, idx: number) => (
                  <Box key={tx.id} sx={{
                    p: 2, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderBottom: idx === stats.transactions.length - 1 ? 'none' : '1px solid',
                    borderColor: 'divider',
                    bgcolor: idx % 2 === 0 ? 'transparent' : (isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)'),
                  }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {tx.type === 'chat' ? <MessageSquare size={16} /> : <FileText size={16} />}
                        {tx.docType === 'legalNotice' ? 'Legal Notice' : tx.docType === 'complaintDraft' ? 'Criminal Complaint' : tx.docType === 'chat-assistant' ? 'AI Co-pilot' : tx.docType}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {tx.tokens ? `${tx.tokens.toLocaleString()} tokens processed • ` : ''}
                        {tx.createdAt ? formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true }) : ''}
                      </Typography>
                    </Box>
                    <Box sx={{
                      px: 1.5, py: 0.5, borderRadius: 2, fontWeight: 700, fontSize: '0.85rem',
                      color: tx.amount < 0 ? 'error.main' : 'success.main',
                      bgcolor: tx.amount < 0 ? (isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)') : (isDark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.08)'),
                    }}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount} cr
                    </Box>
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
