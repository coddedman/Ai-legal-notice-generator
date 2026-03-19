import { Box, Container, Typography, Card, CardContent } from '@mui/material';
import { Mail, MessageSquare, Briefcase } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
};

export default function ContactPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
      <Typography variant="h2" fontWeight={800} textAlign="center" mb={2}>
        Contact Us
      </Typography>
      <Typography variant="h6" color="text.secondary" textAlign="center" mb={6}>
        We’d love to hear from you. Drop us a line if you have feedback, bug reports, or partnership ideas.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'rgba(79,70,229,0.1)', color: '#4f46e5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
              <Mail size={28} />
            </Box>
            <Typography variant="h6" fontWeight={700} mb={1}>General Email</Typography>
            <Typography color="text.secondary" mb={2}>For general inquiries or help with your generated notices.</Typography>
            <Typography fontWeight={600} color="primary.main">hello@mylegalnotice.in</Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
              <Briefcase size={28} />
            </Box>
            <Typography variant="h6" fontWeight={700} mb={1}>Partnerships & Feedback</Typography>
            <Typography color="text.secondary" mb={2}>Are you an advocate or business looking to integrate with our APIS?</Typography>
            <Typography fontWeight={600} color="success.main">support@mylegalnotice.in</Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
