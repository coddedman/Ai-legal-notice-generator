"use client"

import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Divider,
  Skeleton, Chip, Avatar, Grid
} from '@mui/material';
import { useSession, signIn } from 'next-auth/react';
import {
  FileText, MessageSquare, History, Scale,
  FilePenLine, Plus, LogIn, Sparkles, ChevronRight,
  Clock, ShieldCheck, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';

type Stats = {
  totalNotices: number;
  whatsappDrafts: number;
  legalNotices: number;
  complaintDrafts: number;
  memberSince: string | null;
};

type RecentNotice = {
  id: string;
  title: string;
  type: string;
  language: string;
  createdAt: string;
};

const TYPE_META: Record<string, { color: string; bg: string; label: string; icon: React.ReactNode }> = {
  legalNotice: { color: '#4f46e5', bg: 'rgba(79,70,229,0.1)', label: 'Legal Notice', icon: <FileText size={16} /> },
  whatsappMessage: { color: '#059669', bg: 'rgba(5,150,105,0.1)', label: 'WhatsApp Draft', icon: <MessageSquare size={16} /> },
  complaintDraft: { color: '#d97706', bg: 'rgba(217,119,6,0.1)', label: 'Complaint Draft', icon: <FilePenLine size={16} /> },
};

const QUICK_ACTIONS = [
  { name: 'Formal Legal Notice', desc: 'BNS 2023 compliant notice format', path: '/generate', icon: <FileText size={20} color="#4f46e5" />, bg: 'rgba(79,70,229,0.06)' },
  { name: 'Cheque Bounce', desc: 'NI Act Section 138 demand', path: '/generate', icon: <TrendingUp size={20} color="#dc2626" />, bg: 'rgba(220,38,38,0.06)' },
  { name: 'Consumer Court', desc: 'Consumer Protection complaint', path: '/generate', icon: <ShieldCheck size={20} color="#059669" />, bg: 'rgba(5,150,105,0.06)' },
  { name: 'WhatsApp Demand', desc: 'Short demand message', path: '/generate', icon: <MessageSquare size={20} color="#d97706" />, bg: 'rgba(217,119,6,0.06)' },
];

function TrendingUp(props: any) {
  // SVG icon definition inline as we don't have it imported at top level properly due to missing export possibly
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
}

function StatCard({ title, value, icon, color, bg, loading, badge }: {
  title: string; value: string | number; icon: React.ReactNode;
  color: string; bg: string; loading: boolean; badge?: string;
}) {
  return (
    <Card sx={{
      borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
      backgroundImage: 'none', height: '100%',
      transition: 'all 0.2s', '&:hover': { borderColor: color, transform: 'translateY(-2px)' }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box sx={{ width: 42, height: 42, borderRadius: 2, background: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
          </Box>
          {badge && <Chip label={badge} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, bgcolor: 'rgba(0,0,0,0.04)', color: 'text.secondary' }} />}
        </Box>
        {loading ? (
          <Skeleton variant="text" width={60} height={36} sx={{ mb: 0.5 }} />
        ) : (
          <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5, color: 'text.primary', letterSpacing: '-0.02em' }}>{value}</Typography>
        )}
        <Typography variant="body2" color="text.secondary" fontWeight={500}>{title}</Typography>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const theme = useTheme();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentNotice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, historyRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/history?limit=5')
        ]);
        if (statsRes.ok) setStats(await statsRes.json());
        if (historyRes.ok) {
          const h = await historyRes.json();
          setRecent(h.notices || []);
        }
      } catch (e) {
        console.error('Dashboard fetch error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const isDark = theme.palette.mode === 'dark';

  if (status === 'unauthenticated') {
    return (
      <Box sx={{ pb: 8, maxWidth: 1100, mx: 'auto' }}>
        <Box sx={{
          borderRadius: { xs: 4, md: 6 }, mt: 2, mb: 6, p: { xs: 4, md: 8 },
          textAlign: 'center', position: 'relative', overflow: 'hidden',
          bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          border: '1px solid', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
        }}>
          <Box sx={{ display: 'inline-flex', p: 2, borderRadius: 4, bgcolor: 'rgba(79,70,229,0.1)', color: '#4f46e5', mb: 3 }}>
            <Scale size={36} />
          </Box>
          <Typography variant="h2" fontWeight={800} sx={{ mb: 2, letterSpacing: '-0.03em', color: 'text.primary' }}>
            My Legal Notice India
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 5, maxWidth: 640, mx: 'auto', fontWeight: 400, lineHeight: 1.6 }}>
            Professional AI-powered legal drafting. Generate formal notices, consumer complaints, and demand messages compliant with BNS 2023.
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
            <Button
              variant="contained" size="large" onClick={() => signIn()} startIcon={<LogIn size={18} />}
              sx={{ bgcolor: '#4f46e5', color: 'white', fontWeight: 600, borderRadius: 3, px: 4, py: 1.4, '&:hover': { bgcolor: '#4338ca' } }}
            >
              Sign In to Save Documents
            </Button>
            <Button
              component={Link} href="/generate" variant="outlined" size="large" endIcon={<ArrowRight size={18} />}
              sx={{ borderColor: 'divider', color: 'text.primary', fontWeight: 600, borderRadius: 3, px: 4, py: 1.4, '&:hover': { bgcolor: 'action.hover' } }}
            >
              Try Guest Mode
            </Button>
          </Box>
        </Box>

        <Typography variant="h5" fontWeight={700} textAlign="center" mb={4}>Why use our platform?</Typography>
        <Grid container spacing={4}>
          {[
            { title: 'Format Perfect', desc: 'Structured exactly how Indian courts and advocates expect. Professional from start to finish.', icon: <FileText size={24} color="#4f46e5" />, bg: 'rgba(79,70,229,0.1)' },
            { title: 'BNS 2023 Compliant', desc: 'Automatically cites the newest Bharatiya Nyaya Sanhita sections and Consumer Protection laws.', icon: <ShieldCheck size={24} color="#059669" />, bg: 'rgba(5,150,105,0.1)' },
            { title: '10+ Languages', desc: 'Draft legal notices directly in Hindi, Marathi, Bengali, Tamil, and other regional languages.', icon: <MessageSquare size={24} color="#d97706" />, bg: 'rgba(217,119,6,0.1)' },
          ].map((f, i) => (
            <Grid key={i} size={{ xs: 12, md: 4 }}>
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none', height: '100%', bgcolor: 'transparent' }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box sx={{ width: 56, height: 56, borderRadius: '50%', background: f.bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>{f.icon}</Box>
                  <Typography variant="h6" fontWeight={700} mb={1}>{f.title}</Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.6}>{f.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  const greeting = new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', pb: 8 }}>
      {/* Premium Header Profile */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', mb: 5, gap: 3 }}>
        <Box display="flex" alignItems="center" gap={3}>
          <Avatar src={session?.user?.image || ''} sx={{ width: 64, height: 64, fontSize: '1.5rem', fontWeight: 600, bgcolor: 'primary.main', border: '2px solid', borderColor: 'divider' }}>
            {session?.user?.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body1" color="text.secondary" fontWeight={500} mb={0.5}>{greeting},</Typography>
            <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ letterSpacing: '-0.02em', mb: 0.5 }}>
              {session?.user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Sparkles size={14} color="#4f46e5" /> Premium AI Drafter
            </Typography>
          </Box>
        </Box>
        <Box display="flex" gap={1.5}>
          <Button component={Link} href="/history" variant="outlined" startIcon={<History size={16} />} sx={{ borderRadius: 2.5, fontWeight: 600, borderColor: 'divider', color: 'text.primary', px: 2.5 }}>
            History
          </Button>
          <Button component={Link} href="/generate" variant="contained" startIcon={<Plus size={16} />} sx={{ borderRadius: 2.5, fontWeight: 600, bgcolor: '#4f46e5', color: 'white', px: 2.5, '&:hover': { bgcolor: '#4338ca' } }}>
            Draft Notice
          </Button>
        </Box>
      </Box>

      {/* Stats Row */}
      <Grid container spacing={2.5} sx={{ mb: 5 }}>
        {[
          { title: 'Total Notices', value: loading ? '—' : (stats?.totalNotices ?? 0), color: '#4f46e5', bg: 'rgba(79,70,229,0.1)', icon: <Layers size={20} /> },
          { title: 'Legal Drafts', value: loading ? '—' : (stats?.legalNotices ?? 0), color: '#0284c7', bg: 'rgba(2,132,199,0.1)', icon: <FileText size={20} /> },
          { title: 'Consumer Complaints', value: loading ? '—' : (stats?.complaintDrafts ?? 0), color: '#059669', bg: 'rgba(5,150,105,0.1)', icon: <FilePenLine size={20} /> },
          { title: 'WhatsApp Demands', value: loading ? '—' : (stats?.whatsappDrafts ?? 0), color: '#d97706', bg: 'rgba(217,119,6,0.1)', icon: <MessageSquare size={20} />, badge: 'Fastest' },
        ].map(s => (
          <Grid key={s.title} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...s} loading={loading} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Recent Activity */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={700}>Recent Documents</Typography>
            {recent.length > 0 && (
              <Button component={Link} href="/history" size="small" endIcon={<ArrowRight size={14} />} sx={{ textTransform: 'none', fontWeight: 600 }}>
                View All
              </Button>
            )}
          </Box>

          <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', backgroundImage: 'none' }}>
            {loading ? (
              <Box p={3} display="flex" flexDirection="column" gap={3}>
                {[1, 2, 3].map(i => (
                  <Box key={i} display="flex" gap={2} alignItems="center">
                    <Skeleton variant="rounded" width={42} height={42} sx={{ borderRadius: 2 }} />
                    <Box flex={1}>
                      <Skeleton variant="text" width="50%" height={24} />
                      <Skeleton variant="text" width="30%" height={16} />
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : recent.length === 0 ? (
              <Box sx={{ py: 8, px: 3, textAlign: 'center' }}>
                <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <History size={28} style={{ opacity: 0.3 }} />
                </Box>
                <Typography variant="subtitle1" fontWeight={700} mb={1}>No documents found</Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>Looks like you haven't generated any drafts yet.</Typography>
                <Button component={Link} href="/generate" variant="outlined" sx={{ borderRadius: 2, fontWeight: 600, borderColor: 'divider', color: 'text.primary' }}>
                  Create Your First Draft
                </Button>
              </Box>
            ) : (
              <Box>
                {recent.map((notice, i) => {
                  const meta = TYPE_META[notice.type] || { color: '#4f46e5', bg: 'rgba(79,70,229,0.1)', label: notice.type, icon: <FileText size={16} /> };
                  return (
                    <Box key={notice.id}>
                      <Box component={Link} href="/history" sx={{
                        px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 2.5,
                        textDecoration: 'none', color: 'inherit', transition: 'background 0.2s',
                        '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }
                      }}>
                        <Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: meta.bg, color: meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {meta.icon}
                        </Box>
                        <Box flex={1} minWidth={0}>
                          <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ mb: 0.25 }}>
                            {notice.title || 'Untitled Notice'}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="caption" sx={{ color: meta.color, fontWeight: 600 }}>{meta.label}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.5 }}>•</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Clock size={12} /> {new Date(notice.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </Typography>
                          </Box>
                        </Box>
                        <ChevronRight size={18} style={{ opacity: 0.4 }} />
                      </Box>
                      {i < recent.length - 1 && <Divider />}
                    </Box>
                  );
                })}
              </Box>
            )}
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>Quick Start</Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            {QUICK_ACTIONS.map(action => (
              <Box key={action.name} component={Link} href={action.path} sx={{
                display: 'flex', alignItems: 'center', gap: 2.5, p: 2, borderRadius: 3,
                border: '1px solid', borderColor: 'divider', bgcolor: 'transparent',
                textDecoration: 'none', color: 'inherit', transition: 'all 0.2s',
                '&:hover': { borderColor: 'primary.main', bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', transform: 'translateX(4px)' }
              }}>
                <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {action.icon}
                </Box>
                <Box flex={1}>
                  <Typography variant="subtitle2" fontWeight={700} mb={0.25}>{action.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{action.desc}</Typography>
                </Box>
                <ArrowRight size={16} color="#94a3b8" />
              </Box>
            ))}
          </Box>
          <Box mt={3} p={2} borderRadius={3} sx={{ bgcolor: isDark ? 'rgba(239,68,68,0.05)' : 'rgba(239,68,68,0.05)', border: '1px dashed', borderColor: 'rgba(239,68,68,0.2)' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>⚖️</span>
              <span><strong>Remember:</strong> AI-generated forms are templates only. Review sections before sending. See <Link href="/terms" style={{ color: '#ef4444', textDecoration: 'underline' }}>Terms</Link>.</span>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

function Layers(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>;
}
