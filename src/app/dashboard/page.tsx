"use client"

import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent, Button, Divider, Skeleton, IconButton } from '@mui/material';
import { useSession } from 'next-auth/react';
import { FileText, MessageSquare, History, ArrowRight, Zap, Scale, FilePenLine, Plus } from 'lucide-react';
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

const TYPE_META: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  legalNotice: { color: '#1a237e', label: 'Legal Notice', icon: <FileText size={16} /> },
  whatsappMessage: { color: '#2e7d32', label: 'WhatsApp Draft', icon: <MessageSquare size={16} /> },
  complaintDraft: { color: '#6a1b9a', label: 'Complaint Draft', icon: <FilePenLine size={16} /> },
};

export default function Dashboard() {
  const { data: session } = useSession();
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

  const formatMemberSince = (dateStr: string | null) => {
    if (!dateStr) return 'Recently';
    return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  };

  const statCards = [
    {
      title: 'Legal Notices',
      value: stats?.legalNotices ?? 0,
      icon: <FileText size={20} />,
      color: '#1a237e',
    },
    {
      title: 'WhatsApp Drafts',
      value: stats?.whatsappDrafts ?? 0,
      icon: <MessageSquare size={20} />,
      color: '#2e7d32',
    },
    {
      title: 'Complaint Drafts',
      value: stats?.complaintDrafts ?? 0,
      icon: <FilePenLine size={20} />,
      color: '#6a1b9a',
    },
    {
      title: 'Member Since',
      value: formatMemberSince(stats?.memberSince ?? null),
      icon: <History size={20} />,
      color: '#b45309',
      isText: true,
    },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Welcome Back, {session?.user?.name?.split(' ')[0] || 'Advocate'}! 👋
        </Typography>
        <Typography color="text.secondary">
          Track your legal documents and manage your AI-powered drafting history.
        </Typography>
      </Box>

      {/* Summary Stats */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {statCards.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
            <Card sx={{
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
              height: '100%',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 24px ${stat.color}18`
              }
            }}>
              <CardContent sx={{ p: 3.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Box sx={{
                    p: 1.5, borderRadius: 2.5,
                    bgcolor: `${stat.color}15`,
                    color: stat.color,
                    display: 'flex'
                  }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                    {stat.title}
                  </Typography>
                </Box>
                {loading ? (
                  <Skeleton variant="text" width={60} height={40} />
                ) : (
                  <Typography variant={stat.isText ? 'h6' : 'h4'} sx={{ fontWeight: 800, color: stat.color }}>
                    {stat.value}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Recent Activity */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Recent Activity</Typography>
            {recent.length > 0 && (
              <Button
                component={Link}
                href="/history"
                size="small"
                endIcon={<ArrowRight size={16} />}
                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
              >
                View All
              </Button>
            )}
          </Box>

          <Paper sx={{
            borderRadius: 4, border: '1px solid', borderColor: 'divider',
            minHeight: 300, overflow: 'hidden', bgcolor: 'background.paper'
          }}>
            {loading ? (
              <Box p={3} display="flex" flexDirection="column" gap={2}>
                {[1, 2, 3].map(i => (
                  <Box key={i} display="flex" gap={2} alignItems="center">
                    <Skeleton variant="rounded" width={36} height={36} />
                    <Box flex={1}>
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="40%" />
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : recent.length === 0 ? (
              <Box
                sx={{
                  minHeight: 300, display: 'flex', flexDirection: 'column',
                  justifyContent: 'center', alignItems: 'center', textAlign: 'center', p: 4
                }}
              >
                <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: '50%', mb: 2 }}>
                  <Scale size={40} color="rgba(0,0,0,0.2)" />
                </Box>
                <Typography variant="h6" sx={{ mb: 1 }}>Your history is empty</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Generate your first AI-legal notice to see it here.
                </Typography>
                <Button
                  variant="contained"
                  component={Link}
                  href="/"
                  startIcon={<Zap size={18} />}
                  sx={{ borderRadius: 2, px: 4, py: 1.2, fontWeight: 700, background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)' }}
                >
                  Start New Draft
                </Button>
              </Box>
            ) : (
              <Box>
                {recent.map((notice, i) => {
                  const meta = TYPE_META[notice.type] || { color: '#6366f1', label: notice.type, icon: <FileText size={16} /> };
                  return (
                    <React.Fragment key={notice.id}>
                      <Box sx={{
                        px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 2,
                        '&:hover': { bgcolor: 'action.hover' }, transition: 'background 0.15s'
                      }}>
                        <Box sx={{ p: 1, bgcolor: `${meta.color}15`, color: meta.color, borderRadius: 2, display: 'flex' }}>
                          {meta.icon}
                        </Box>
                        <Box flex={1} minWidth={0}>
                          <Typography variant="subtitle2" fontWeight={700} noWrap>{notice.title || 'Untitled Notice'}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {meta.label} · {new Date(notice.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </Typography>
                        </Box>
                        <IconButton component={Link} href="/history" size="small" sx={{ flexShrink: 0 }}>
                          <ArrowRight size={16} />
                        </IconButton>
                      </Box>
                      {i < recent.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
                <Divider />
                <Box p={2} textAlign="center">
                  <Button
                    component={Link}
                    href="/history"
                    size="small"
                    endIcon={<ArrowRight size={16} />}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    View all {stats?.totalNotices || ''} notices
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Quick Actions</Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            {[
              { name: 'New Legal Notice', desc: 'Draft a formal legal notice', path: '/', color: '#1a237e', icon: <Plus size={18} /> },
              { name: 'Cheque Bounce Notice', desc: 'NI Act Section 138', path: '/', color: '#c62828', icon: <FileText size={18} /> },
              { name: 'Consumer Court Complaint', desc: 'Consumer Protection Act 2019', path: '/', color: '#2e7d32', icon: <FilePenLine size={18} /> },
              { name: 'WhatsApp Demand Draft', desc: 'Quick informal demand message', path: '/', color: '#b45309', icon: <MessageSquare size={18} /> },
            ].map((item) => (
              <Card
                key={item.name}
                component={Link}
                href={item.path}
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'none',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: `${item.color}08`,
                    borderColor: `${item.color}40`,
                    transform: 'translateX(4px)'
                  }
                }}
              >
                <CardContent sx={{ py: 2, px: 2.5, display: 'flex', alignItems: 'center', gap: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ p: 1, bgcolor: `${item.color}15`, color: item.color, borderRadius: 2, display: 'flex' }}>
                    {item.icon}
                  </Box>
                  <Box flex={1}>
                    <Typography variant="subtitle2" fontWeight={700}>{item.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{item.desc}</Typography>
                  </Box>
                  <ArrowRight size={18} color={item.color} />
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* Legal Disclaimer note at bottom of dashboard */}
      <Box mt={6} p={3} borderRadius={3} bgcolor="rgba(99,102,241,0.04)" border="1px solid" borderColor="rgba(99,102,241,0.15)">
        <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
          ⚖️ Documents generated here are AI-drafted templates for informational purposes only.
          They do not constitute legal advice. Always consult a qualified advocate before sending any legal notice.
        </Typography>
      </Box>
    </Box>
  );
}
