"use client"

import React from 'react';
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

// Horizontal Style Feature Card
function ActionCard({ title, desc, icon, path, primary = false }: { title: string, desc: string, icon: React.ReactNode, path: string, primary?: boolean }) {
  return (
    <Card 
      component={Link} 
      href={path}
      sx={{
        borderRadius: 4, 
        border: '1px solid', 
        borderColor: primary ? '#4f46e5' : 'divider', 
        bgcolor: primary ? 'rgba(79,70,229,0.03)' : 'background.paper',
        boxShadow: primary ? '0 8px 24px rgba(79, 70, 229, 0.12)' : '0 2px 10px rgba(0,0,0,0.02)',
        height: '100%',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        p: 2,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: '#4f46e5',
          bgcolor: primary ? 'rgba(79,70,229,0.06)' : 'background.paper',
          boxShadow: '0 12px 28px rgba(79, 70, 229, 0.15)',
          transform: 'translateY(-3px)'
        }
      }}
    >
      <Box sx={{ 
        width: 60, height: 60, 
        borderRadius: 3, 
        bgcolor: primary ? '#4f46e5' : 'rgba(79,70,229,0.08)', 
        color: primary ? 'white' : '#4f46e5', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flexShrink: 0,
        mr: 3
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ color: 'text.primary', mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
          {desc}
        </Typography>
      </Box>
      <Box sx={{ color: primary ? '#4f46e5' : 'text.disabled', ml: 2 }}>
        <ArrowRight size={20} />
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
        borderRadius: 4, 
        border: '1px solid', 
        borderColor: 'divider', 
        boxShadow: 'none',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 3,
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'rgba(79,70,229,0.02)'
        }
      }}
    >
      <Box sx={{ color: 'text.secondary', mb: 1.5 }}>
        {icon}
      </Box>
      <Typography variant="subtitle2" fontWeight={600} color="text.primary">
        {title}
      </Typography>
    </Card>
  );
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      signIn();
      return;
    }
    if (status === 'authenticated') {
      fetch('/api/stats')
        .then(res => res.json())
        .then(data => { setStats(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [status]);

  if (status === 'loading' || (status === 'authenticated' && loading)) {
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
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 3, md: 5 }, minHeight: '100vh', pb: 10 }}>
      
      {/* Top Navigation / Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 6,
        pb: 3,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Box display="flex" alignItems="center" gap={2}>
           <Box sx={{ p: 1, bgcolor: '#4f46e5', borderRadius: 2, color: 'white' }}>
             <Scale size={24} />
           </Box>
           <Box>
             <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: '-0.02em', lineHeight: 1 }}>
               AI Legal Desk
             </Typography>
             <Typography variant="caption" color="text.secondary" fontWeight={500}>
               Premium Workspace
             </Typography>
           </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Button 
            component={Link}
            href="/history"
            variant="text" 
            startIcon={<History size={18} />}
            sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'none' }}
          >
            Session History
          </Button>
          <Button
            variant="outlined"
            startIcon={<LogOut size={16} />}
            onClick={() => signOut({ callbackUrl: '/' })}
            sx={{
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.85rem',
              color: '#64748b',
              borderColor: '#e2e8f0',
              borderRadius: '8px',
              '&:hover': { bgcolor: '#fef2f2', borderColor: '#fca5a5', color: '#ef4444' },
            }}
          >
            Sign Out
          </Button>
          <Avatar 
            src={session?.user?.image || ''} 
            sx={{ width: 40, height: 40, border: '2px solid', borderColor: 'divider' }}
          >
            {firstName.charAt(0)}
          </Avatar>
        </Box>
      </Box>

      {/* User Stats Summary */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderRadius: 4, bgcolor: '#4f46e5', color: 'white', p: 1, height: '100%' }}>
                <CardContent sx={{ pb: '16px !important' }}>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <CreditCard size={20} />
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>AI Credits</Typography>
                    </Box>
                    <Typography variant="h4" fontWeight={800}>{stats?.credits || 0}</Typography>
                    <Box sx={{ mt: 2 }}>
                        <LinearProgress 
                            variant="determinate" 
                            value={((stats?.credits || 0) / 500) * 100} 
                            sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }} 
                        />
                    </Box>
                    <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.8 }}>of 500 remaining</Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <TrendingUp size={20} color="#10b981" />
                        <Typography variant="caption" color="text.secondary">Total Drafts</Typography>
                    </Box>
                    <Typography variant="h4" fontWeight={800}>{stats?.totalNotices || 0}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>All legal instruments</Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <CheckCircle size={20} color="#3b82f6" />
                        <Typography variant="caption" color="text.secondary">Plan Status</Typography>
                    </Box>
                    <Typography variant="h4" fontWeight={800}>Free</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>Basic legal automation</Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Clock size={20} color="#f59e0b" />
                        <Typography variant="caption" color="text.secondary">Notice Count</Typography>
                    </Box>
                    <Typography variant="h4" fontWeight={800}>{stats?.legalNotices || 0}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>Official notices drafted</Typography>
                </CardContent>
            </Card>
        </Grid>
      </Grid>

      {/* Welcome Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight={800} sx={{ color: 'text.primary', letterSpacing: '-0.03em', mb: 1 }}>
          Welcome back, {firstName}.
        </Typography>
        <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ maxWidth: 600 }}>
          Manage your legal drafting history and usage limits here. What would you like to build today?
        </Typography>
      </Box>

      {/* Primary Actions (Horizontal Cards) */}
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
            title="Session History" 
            desc={`You have drafted ${stats?.totalNotices || 0} documents so far. View your latest work.`}
            icon={<History size={28} />}
            path="/history"
          />
        </Grid>
      </Grid>

      {/* Specialized Tools */}
      <Box>
        <Typography variant="h6" fontWeight={700} mb={3} sx={{ color: 'text.primary' }}>
          Specialized Legal Tools
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
            <ToolCard 
              title="Legal Memo" 
              icon={<FileText size={24} />}
              path="/dashboard/memo"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
            <ToolCard 
              title="Build Arguments" 
              icon={<ShieldCheck size={24} />}
              path="/dashboard/arguments"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
            <ToolCard 
              title="Upload PDF" 
              icon={<UploadCloud size={24} />}
              path="/dashboard/upload"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
            <ToolCard 
              title="Templates" 
              icon={<LayoutGrid size={24} />}
              path="/dashboard/templates"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
            <ToolCard 
              title="Research" 
              icon={<Search size={24} />}
              path="/dashboard/research"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Recent Activity & Billing */}
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
                    <Box 
                        key={tx.id} 
                        sx={{ 
                            p: 2, px: 3, 
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            borderBottom: idx === stats.transactions.length - 1 ? 'none' : '1px solid',
                            borderColor: 'divider',
                            bgcolor: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.01)'
                        }}
                    >
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
                        
                        <Box sx={{ 
                            px: 1.5, py: 0.5, borderRadius: 2, 
                            fontWeight: 700, fontSize: '0.85rem',
                            color: tx.amount < 0 ? '#ef4444' : '#10b981',
                            bgcolor: tx.amount < 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'
                        }}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount} cr
                        </Box>
                    </Box>
                ))
            )}
        </Paper>
      </Box>

    </Box>
  );
}
