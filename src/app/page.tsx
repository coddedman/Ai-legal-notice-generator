"use client"

import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { ArrowRight, Sparkles, Scale, BookOpen, Clock } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';

export default function LandingPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Hero Section */}
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: isDark 
          ? 'linear-gradient(135deg, rgba(79,70,229,0.08) 0%, rgba(236,72,153,0.05) 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
        pt: { xs: 12, md: 20 },
        pb: { xs: 10, md: 15 },
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow Effects */}
        <Box sx={{ position: 'absolute', top: '10%', left: '20%', width: {xs: 200, md:400}, height: {xs:200, md:400}, bgcolor: 'rgba(79,70,229,0.15)', borderRadius: '50%', filter: 'blur(100px)', zIndex: 0 }} />
        <Box sx={{ position: 'absolute', bottom: '10%', right: '20%', width: {xs: 200, md:400}, height: {xs:200, md:400}, bgcolor: 'rgba(236,72,153,0.15)', borderRadius: '50%', filter: 'blur(100px)', zIndex: 0 }} />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          
          <Box sx={{ 
            display: 'inline-flex', alignItems: 'center', gap: 1, px: 2.5, py: 1, 
            borderRadius: '999px', bgcolor: 'rgba(79,70,229,0.1)', mb: 4, 
            border: '1px solid rgba(79,70,229,0.2)' 
          }}>
            <Sparkles size={16} color="#4f46e5" />
            <Typography variant="body2" fontWeight={600} color="#4f46e5">
              The Next-Gen Legal Workspace
            </Typography>
          </Box>

          <Typography variant="h2" fontWeight={900} sx={{ 
            color: 'text.primary', 
            letterSpacing: '-0.04em', 
            mb: 3,
            lineHeight: 1.1,
            fontSize: { xs: '3rem', md: '5rem' }
          }}>
            Automate Legal Drafting.<br />
            <Box component="span" sx={{ 
              background: 'linear-gradient(90deg, #4f46e5, #ec4899)', 
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
              mt: 1
            }}>
              Accelerate Research.
            </Box>
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 6, fontWeight: 400, maxWidth: 700, mx: 'auto', lineHeight: 1.6 }}>
            Empower your practice with India's smartest AI Legal Assistant. Draft precise notices, summarize complex 50-page judgments, and unearth exact case laws in seconds.
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link}
              href="/dashboard"
              variant="contained"
              size="large"
              endIcon={<ArrowRight />}
              sx={{
                bgcolor: '#4f46e5',
                color: 'white',
                px: 5,
                py: 2,
                borderRadius: '999px',
                fontSize: '1.1rem',
                fontWeight: 600,
                boxShadow: '0 10px 30px -10px rgba(79,70,229,0.5)',
                '&:hover': {
                  bgcolor: '#4338ca',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 15px 35px -10px rgba(79,70,229,0.6)',
                },
                transition: 'all 0.2s'
              }}
            >
              Let's Start
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                color: 'text.primary',
                px: 5,
                py: 2,
                borderRadius: '999px',
                fontSize: '1.1rem',
                fontWeight: 600,
                bgcolor: 'background.paper',
                '&:hover': {
                  bgcolor: 'action.hover',
                  borderColor: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)'
                }
              }}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Feature Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={800} textAlign="center" mb={6} sx={{ letterSpacing: '-0.02em', color: 'text.primary' }}>
            Everything you need, in one place.
          </Typography>
          <Grid container spacing={4}>
            {[
              { title: 'Generative Drafting', desc: 'Instantly create BNS 2023 compliant notices, NDAs, and plaints based on simple facts.', icon: <Scale size={28} color="#4f46e5" /> },
              { title: 'Deep Legal Intelligence', desc: 'No hallucinations. Sourced from millions of valid Indian judgments and supreme court cases.', icon: <BookOpen size={28} color="#ec4899" /> },
              { title: 'Save 10+ Hours A Week', desc: 'Upload massive PDF judgments and extract exactly the clauses or argument summaries you need.', icon: <Clock size={28} color="#059669" /> }
            ].map((f, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                 <Box sx={{ 
                    p: 5, 
                    borderRadius: 5, 
                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'white',
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                    boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.03)',
                    transition: 'transform 0.2s ease',
                    '&:hover': { transform: 'translateY(-4px)' }
                 }}>
                    <Box sx={{ 
                      width: 64, height: 64, borderRadius: 4, 
                      bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 
                    }}>
                      {f.icon}
                    </Box>
                    <Typography variant="h5" fontWeight={800} mb={1.5} sx={{ letterSpacing: '-0.01em', color: 'text.primary' }}>{f.title}</Typography>
                    <Typography variant="body1" color="text.secondary" lineHeight={1.6}>{f.desc}</Typography>
                 </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

    </Box>
  );
}
