import { Box, Container, Typography } from '@mui/material';
import { Scale } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
};

export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Box sx={{ display: 'inline-flex', p: 2, borderRadius: 4, bgcolor: 'rgba(79,70,229,0.1)', color: '#4f46e5', mb: 3 }}>
          <Scale size={36} />
        </Box>
        <Typography variant="h2" fontWeight={800} mb={2}>
          About My Legal Notice
        </Typography>
      </Box>

      <Box sx={{ typography: 'body1', color: 'text.secondary', lineHeight: 1.8, '& p': { mb: 3 } }}>
        <Typography paragraph>
          My Legal Notice is a free AI-powered tool built to help everyday Indians draft basic legal notices quickly and affordably.
        </Typography>
        <Typography paragraph>
          Our platform was created by tech enthusiasts with legal domain knowledge. We are a Delhi-based initiative striving to democratize access to high-quality legal drafting for everyone—because protecting your rights shouldn't be locked behind a paywall or confusing legal jargon.
        </Typography>
        <Typography paragraph>
          By leveraging modern AI models tailored to the Indian justice system (like the BNS 2023), we streamline the initial drafting process so you can get clarity on your legal standing in seconds, leaving professional advocates to seamlessly review and enforce your rights.
        </Typography>
        
        <Box sx={{ mt: 6, p: 4, borderRadius: 4, bgcolor: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.1)' }}>
          <Typography variant="h6" fontWeight={700} color="text.primary" mb={1}>
            Get in Touch
          </Typography>
          <Typography>
            Reach out to our team at <strong>hello@mylegalnotice.in</strong> for any general inquiries.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
