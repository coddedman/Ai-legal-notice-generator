"use client"

import React from 'react';
import {
  Box, Typography, Card, CardContent, Button, Grid, Avatar
} from '@mui/material';
import { useSession } from 'next-auth/react';
import {
  Sparkles, FileSearch, UploadCloud, Search, FileText,
  MessageSquare, LayoutGrid, ArrowRight, ShieldCheck, Scale, History
} from 'lucide-react';
import Link from 'next/link';

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

  if (status === 'loading') {
    return (
      <Box p={6} display="flex" justifyContent="center">
         <Typography color="text.secondary" fontWeight={500}>Loading your workspace...</Typography>
      </Box>
    );
  }

  const appName = "AI Legal Desk";
  const firstName = session?.user?.name?.split(' ')[0] || 'Advocate';

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: { xs: 3, md: 5 }, minHeight: '100vh', pb: 10 }}>
      
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
               {appName}
             </Typography>
             <Typography variant="caption" color="text.secondary" fontWeight={500}>
               Professional Suite
             </Typography>
           </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            component={Link}
            href="/history"
            variant="text" 
            startIcon={<History size={18} />}
            sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'none' }}
          >
            History
          </Button>
          <Avatar 
            src={session?.user?.image || ''} 
            sx={{ width: 40, height: 40, border: '2px solid', borderColor: 'divider' }}
          >
            {firstName.charAt(0)}
          </Avatar>
        </Box>
      </Box>

      {/* Welcome Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight={800} sx={{ color: 'text.primary', letterSpacing: '-0.03em', mb: 1 }}>
          Welcome back, {firstName}.
        </Typography>
        <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ maxWidth: 600 }}>
          What would you like to build today? Choose a workflow below to get started.
        </Typography>
      </Box>

      {/* Primary Actions (Horizontal Cards) */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ActionCard 
            primary
            title="Start New AI Draft" 
            desc="Generate notices, consumer complaints, plaints, and agreements using advanced legal AI."
            icon={<Sparkles size={28} />}
            path="/generate"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ActionCard 
            title="Chat with Document (PDF)" 
            desc="Upload massive case files or judgments to instantly extract dates, clauses, and summaries."
            icon={<MessageSquare size={28} />}
            path="/dashboard/chat-pdf"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ActionCard 
            title="AI Legal Research" 
            desc="Search through millions of Indian case laws and acts. Get verified answers without hallucinations."
            icon={<Search size={28} />}
            path="/dashboard/research"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ActionCard 
            title="Review & Optimize Draft" 
            desc="Upload an existing word document to improve grammar, formatting, and legal tone securely."
            icon={<FileSearch size={28} />}
            path="/dashboard/review"
          />
        </Grid>
      </Grid>

      {/* Secondary Tools */}
      <Box>
        <Typography variant="h6" fontWeight={700} mb={3} sx={{ color: 'text.primary' }}>
          Specialized Tools
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
              title="Upload File" 
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
        </Grid>
      </Box>

    </Box>
  );
}
