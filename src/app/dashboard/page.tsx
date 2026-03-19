"use client"

import React from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent, Button, Divider } from '@mui/material';
import { useSession } from 'next-auth/react';
import { FileText, MessageSquare, History, ArrowRight, Zap, Scale } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { data: session } = useSession();

  const stats = [
    { title: 'Notices Generated', value: '12', icon: <FileText size={20} />, color: '#1a237e' },
    { title: 'WhatsApp Drafts', value: '5', icon: <MessageSquare size={20} />, color: '#2e7d32' },
    { title: 'Member Since', value: 'Mar 2026', icon: <History size={20} />, color: '#6a1b9a' },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Welcome Back, {session?.user?.name || 'Advocate'}!
        </Typography>
        <Typography color="text.secondary">
          Track your legal documents and manage your AI-powered drafting history.
        </Typography>
      </Box>

      {/* Summary Stats */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={4} key={stat.title}>
            <Card sx={{ 
              borderRadius: 4, 
              border: '1px solid', 
              borderColor: 'divider',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: 3, 
                    bgcolor: `${stat.color}15`, 
                    color: stat.color,
                    display: 'flex'
                  }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Quick Actions */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Recent Activity
          </Typography>
          <Paper sx={{ 
            borderRadius: 4, 
            border: '1px solid', 
            borderColor: 'divider',
            p: 4,
            minHeight: 300,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            bgcolor: 'background.paper'
          }}>
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: '50%', mb: 2 }}>
              <Scale size={48} color="rgba(0,0,0,0.2)" />
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
              sx={{ borderRadius: 2, px: 4, py: 1.2, fontWeight: 700 }}
            >
              Start New Draft
            </Button>
          </Paper>
        </Grid>

        {/* Templates/Categories */}
        <Grid item xs={12} md={5}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Popular Generators
          </Typography>
          {[
            { name: 'Cheque Bounce Notice', type: 'Payment', color: '#1a237e' },
            { name: 'Tenant Eviction', type: 'Property', color: '#c62828' },
            { name: 'Consumer Court Draft', type: 'Service', color: '#2e7d32' }
          ].map((cat) => (
            <Card key={cat.name} sx={{ 
              mb: 2, 
              borderRadius: 3, 
              border: '1px solid', 
              borderColor: 'divider',
              boxShadow: 'none',
              '&:hover': { bgcolor: 'action.hover' }
            }}>
              <CardContent sx={{ py: 2, px: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{cat.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{cat.type}</Typography>
                </Box>
                <IconButton size="small">
                  <ArrowRight size={18} />
                </IconButton>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}
