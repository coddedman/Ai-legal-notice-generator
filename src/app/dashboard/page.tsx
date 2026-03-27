"use client"
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Grid, Avatar, LinearProgress, Paper
} from '@mui/material';
import { useSession, signOut, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Sparkles, FileSearch, UploadCloud, Search, FileText,
  MessageSquare, LayoutGrid, ArrowRight, ShieldCheck, Scale, History,
  TrendingUp, CreditCard, Clock, CheckCircle, Activity, LogOut
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import GuestBanner from '@/components/GuestBanner';

// Horizontal Style Feature Card
function ActionCard({ title, desc, icon, path, primary = false }: { title: string, desc: string, icon: React.ReactNode, path: string, primary?: boolean }) {
  return (
    <Card 
      component={Link} 
      href={path}
      sx={{
        borderRadius: '24px', 
        border: '1px solid', 
        borderColor: primary ? 'rgba(79,70,229,0.2)' : 'rgba(0,0,0,0.04)', 
        background: primary ? 'linear-gradient(135deg, #ffffff 0%, #f5f3ff 100%)' : '#ffffff',
        boxShadow: primary ? '0 12px 32px rgba(79, 70, 229, 0.08)' : '0 4px 12px rgba(0,0,0,0.02)',
        height: '100%',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        p: { xs: 2.5, md: 3 },
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&::before': primary ? {
          content: '""', position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
          background: 'linear-gradient(to bottom, #4f46e5, #818cf8)'
        } : {},
        '&:hover': {
          borderColor: primary ? '#4f46e5' : 'rgba(0,0,0,0.08)',
          transform: 'translateY(-4px)',
          boxShadow: primary ? '0 20px 40px rgba(79, 70, 229, 0.15)' : '0 12px 24px rgba(0,0,0,0.04)',
          '& .icon-wrapper': {
            transform: 'scale(1.05) rotate(-3deg)',
            bgcolor: primary ? '#4338ca' : 'rgba(79,70,229,0.08)'
          },
          '& .arrow': {
            transform: 'translateX(4px)',
            color: '#4f46e5'
          }
        }
      }}
    >
      <Box className="icon-wrapper" sx={{ 
        width: 64, height: 64, borderRadius: '16px', 
        bgcolor: primary ? '#4f46e5' : 'rgba(79,70,229,0.06)', 
        color: primary ? 'white' : '#4f46e5', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        flexShrink: 0, mr: 3,
        transition: 'all 0.3s ease'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight={700} sx={{ color: 'text.primary', mb: 0.5, letterSpacing: '-0.01em' }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {desc}
        </Typography>
      </Box>
      <Box className="arrow" sx={{ color: primary ? '#4f46e5' : 'text.disabled', ml: 2, transition: 'all 0.3s ease' }}>
        <ArrowRight size={22} />
      </Box>
    </Card>
  );
}

// Vertical Style Feature Card for Secondary Actions
function ToolCard({ title, icon, path }: { title: string, icon: React.ReactNode, path: string }) {
  return (
    <Card 
      component={Link} 
      href={path}
      sx={{
        borderRadius: '24px', 
        border: '1px solid', 
        borderColor: 'rgba(0,0,0,0.04)', 
        background: '#ffffff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 3,
        py: 4,
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: 'rgba(79,70,229,0.2)',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 20px rgba(79, 70, 229, 0.06)',
          '& .icon': {
            color: '#4f46e5',
            transform: 'translateY(-2px)'
          }
        }
      }}
    >
      <Box className="icon" sx={{ color: '#64748b', mb: 2, transition: 'all 0.3s ease' }}>
        {icon}
      </Box>
      <Typography variant="subtitle2" fontWeight={700} color="text.primary">
        {title}
      </Typography>
    </Card>
  );
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
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
    if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <Box p={6} display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" gap={2}>
        <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          <Scale size={22} color="white" />
        </Box>
        <Typography color="text.secondary" fontWeight={600}>Loading your workspace...</Typography>
        <Typography variant="caption" color="text.disabled">Setting up your legal AI desk</Typography>
      </Box>
    );
  }

  const firstName = session?.user?.name?.split(' ')[0] || 'Advocate';

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)',
      position: 'relative'
    }}>
      {/* Background decoration */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40vh', background: 'linear-gradient(180deg, rgba(79,70,229,0.04) 0%, rgba(255,255,255,0) 100%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Guest banner */}
      {isGuest && <GuestBanner />}

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 3, md: 5 }, width: '100%', pb: 10, zIndex: 1, position: 'relative' }}>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 7, pb: 3, borderBottom: '1px solid', borderColor: 'rgba(0,0,0,0.06)' }}>

          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{ p: 1, bgcolor: '#4f46e5', borderRadius: 2, color: 'white' }}>
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
              // Guest header actions
              <>
                <Button component={Link} href="/" variant="text"
                  sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'none' }}>Home</Button>
                <Button variant="contained" onClick={() => signIn()}
                  sx={{ fontWeight: 700, textTransform: 'none', borderRadius: '8px', bgcolor: '#4f46e5',
                    boxShadow: 'none', '&:hover': { bgcolor: '#4338ca' } }}>
                  Sign In Free
                </Button>
              </>
            ) : (
              // Authenticated header actions
              <>
                <Button component={Link} href="/history" variant="text" startIcon={<History size={18} />}
                  sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'none' }}>Session History</Button>
                <Button variant="outlined" startIcon={<LogOut size={16} />}
                  onClick={() => signOut({ callbackUrl: '/' })}
                  sx={{ fontWeight: 600, textTransform: 'none', fontSize: '0.85rem', color: '#64748b',
                    borderColor: '#e2e8f0', borderRadius: '8px',
                    '&:hover': { bgcolor: '#fef2f2', borderColor: '#fca5a5', color: '#ef4444' } }}>
                  Sign Out
                </Button>
                <Avatar src={session?.user?.image || ''} sx={{ width: 40, height: 40, border: '2px solid', borderColor: 'divider' }}>
                  {firstName.charAt(0)}
                </Avatar>
              </>
            )}
          </Box>
        </Box>

        {/* User Stats — authenticated only */}
        {!isGuest && <Grid container spacing={3} sx={{ mb: 7 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>

            <Card sx={{ borderRadius: 5, background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)', color: 'white', p: 1, height: '100%', border: 'none', boxShadow: '0 12px 24px rgba(79,70,229,0.2)' }}>
                <CardContent sx={{ pb: '16px !important' }}>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <CreditCard size={22} style={{ opacity: 0.9 }} />
                        <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Available Credits</Typography>
                    </Box>
                    <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.03em' }}>{stats?.credits || 0}</Typography>
                    <Box sx={{ mt: 3 }}>
                        <LinearProgress 
                            variant="determinate" 
                            value={((stats?.credits || 0) / 500) * 100} 
                            sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: 'white', borderRadius: 3 } }} 
                        />
                    </Box>
                    <Typography variant="caption" sx={{ mt: 1.5, display: 'block', opacity: 0.8, fontWeight: 500 }}>of 500 remaining</Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderRadius: 5, height: '100%', border: '1px solid', borderColor: 'rgba(0,0,0,0.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <CardContent sx={{ pb: '16px !important' }}>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <TrendingUp size={22} color="#10b981" />
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>Total Drafts</Typography>
                    </Box>
                    <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.02em', color: 'text.primary' }}>{stats?.totalNotices || 0}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontWeight: 500 }}>All legal instruments created</Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderRadius: 5, height: '100%', border: '1px solid', borderColor: 'rgba(0,0,0,0.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <CardContent sx={{ pb: '16px !important' }}>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <CheckCircle size={22} color="#3b82f6" />
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>Plan Status</Typography>
                    </Box>
                    <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.02em', color: 'text.primary', mt: 1 }}>Free Tier</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontWeight: 500 }}>Basic legal automation</Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderRadius: 5, height: '100%', border: '1px solid', borderColor: 'rgba(0,0,0,0.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <CardContent sx={{ pb: '16px !important' }}>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Clock size={22} color="#f59e0b" />
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>Notice Count</Typography>
                    </Box>
                    <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.02em', color: 'text.primary' }}>{stats?.legalNotices || 0}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontWeight: 500 }}>Official notices drafted</Typography>
                </CardContent>
            </Card>
        </Grid>
        </Grid>}

        {/* Welcome Section */}
        {!isGuest && (
          <Box sx={{ mb: 6, mt: 2 }}>
            <Typography variant="h3" fontWeight={800} sx={{ color: 'text.primary', letterSpacing: '-0.03em', mb: 1 }}>
              Welcome back, {firstName}.
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={500} sx={{ maxWidth: 600 }}>
              Manage your legal drafting history and usage limits here. What would you like to build today?
            </Typography>
          </Box>
        )}
        {isGuest && (
          <Box sx={{ mb: 6, mt: 2 }}>
            <Typography variant="h3" fontWeight={800} sx={{ color: 'text.primary', letterSpacing: '-0.03em', mb: 1 }}>
              Explore Legal AI Tools
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={500} sx={{ maxWidth: 600 }}>
              Try any tool below — sign in free to save your work and access your full drafting history.
            </Typography>
          </Box>
        )}

        {/* Primary Actions */}
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

        {/* Specialized Tools */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" fontWeight={800} mb={3} sx={{ color: 'text.primary', letterSpacing: '-0.01em' }}>Specialized Legal Tools</Typography>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}><ToolCard title="Legal Memo" icon={<FileText size={28} />} path="/dashboard/memo" /></Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}><ToolCard title="Build Arguments" icon={<ShieldCheck size={28} />} path="/dashboard/arguments" /></Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}><ToolCard title="Upload PDF" icon={<UploadCloud size={28} />} path="/dashboard/upload" /></Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}><ToolCard title="Templates" icon={<LayoutGrid size={28} />} path="/dashboard/templates" /></Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}><ToolCard title="Research" icon={<Search size={28} />} path="/dashboard/research" /></Grid>
          </Grid>
        </Box>

        {/* Recent Activity — authenticated only */}
        {!isGuest && (
          <Box sx={{ mt: 8 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight={700} sx={{ color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Activity size={20} color="#4f46e5" /> Recent Usage
              </Typography>
            </Box>
            <Paper sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', boxShadow: 'none' }}>
              {(!stats?.transactions || stats.transactions.length === 0) ? (
                <Box p={4} textAlign="center">
                  <Typography color="text.secondary">No recent credit activity.</Typography>
                </Box>
              ) : (
                stats.transactions.map((tx: any, idx: number) => (
                  <Box key={tx.id} sx={{ p: 2, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderBottom: idx === stats.transactions.length - 1 ? 'none' : '1px solid', borderColor: 'divider',
                    bgcolor: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.01)' }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {tx.type === 'chat' ? <MessageSquare size={16} /> : <FileText size={16} />}
                        {tx.docType === 'legalNotice' ? 'Legal Notice' : tx.docType === 'complaintDraft' ? 'Criminal Complaint' : tx.docType === 'chat-assistant' ? 'AI Co-pilot' : tx.docType}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {tx.tokens ? `${tx.tokens.toLocaleString()} tokens processed • ` : ''}
                        {tx.createdAt ? formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true }) : ''}
                      </Typography>
                    </Box>
                    <Box sx={{ px: 1.5, py: 0.5, borderRadius: 2, fontWeight: 700, fontSize: '0.85rem',
                      color: tx.amount < 0 ? '#ef4444' : '#10b981',
                      bgcolor: tx.amount < 0 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)' }}>
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
