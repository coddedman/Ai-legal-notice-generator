'use client';

import { Container, Typography, Box, Paper, Divider } from '@mui/material';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: '1. Information We Collect',
      content: [
        'Account Information: When you sign in with Google, we collect your name, email address, and profile picture provided by Google OAuth.',
        'Notice Data: When you generate legal notices, we store the document type, language, and a copy of the generated document in our secure database.',
        'Form Inputs: Details you enter (party names, addresses, dispute descriptions, amounts) are processed to generate your documents. This data is stored only if you are signed in.',
        'Usage Data: We collect standard server logs including IP address, browser type, and pages visited to improve our service.'
      ]
    },
    {
      title: '2. How We Use Your Information',
      content: [
        'To generate and save your legal notice drafts.',
        'To display your document history when you sign in.',
        'To improve the AI drafting quality and user experience.',
        'To communicate service updates or important notices.',
        'We do NOT sell, rent, or share your personal data with third parties for marketing purposes.'
      ]
    },
    {
      title: '3. Data Storage & Security',
      content: [
        'Your data is stored in a secure, encrypted PostgreSQL database hosted on Supabase.',
        'We use industry-standard TLS/SSL encryption for all data in transit.',
        'Access to your data is restricted to authenticated sessions only.',
        'We retain your data for as long as your account is active. You may request deletion at any time.'
      ]
    },
    {
      title: '4. Cookies & Tracking',
      content: [
        'Session Cookies: We use cookies to maintain your authenticated session via NextAuth.js.',
        'Analytics: We use Google Analytics (GA4) to collect anonymised usage statistics to understand how users interact with our service.',
        'You may disable cookies in your browser settings, but this will affect your ability to sign in.'
      ]
    },
    {
      title: '5. Third-Party Services',
      content: [
        'Google OAuth: Used for sign-in. Governed by Google\'s Privacy Policy (policies.google.com).',
        'Gemini AI (Google): Documents are processed using Google Gemini models. Inputs are sent to Google\'s AI API.',
        'OpenRouter: Used as a fallback AI provider. Inputs may be processed by OpenRouter and its model providers.',
        'We recommend you do not include highly sensitive personal information (e.g., Aadhaar numbers, bank account details) in the evidence/description fields.'
      ]
    },
    {
      title: '6. Your Rights Under DPDP Act 2023',
      content: [
        'Right to Access: You may request a copy of your personal data held by us.',
        'Right to Correction: You may request correction of inaccurate personal data.',
        'Right to Erasure: You may request deletion of your account and associated data.',
        'Right to Grievance Redressal: You may contact our Grievance Officer for any data-related complaints.',
        'To exercise any of these rights, please email us at: privacy@mylegalnotice.in'
      ]
    },
    {
      title: '7. Children\'s Privacy',
      content: [
        'Our service is not intended for persons under 18 years of age.',
        'We do not knowingly collect personal information from minors.'
      ]
    },
    {
      title: '8. Changes to This Policy',
      content: [
        'We may update this Privacy Policy from time to time.',
        'We will notify registered users of material changes via email.',
        'Continued use of the service after changes constitutes acceptance of the updated policy.'
      ]
    },
    {
      title: '9. Contact Us',
      content: [
        'Grievance Officer: privacy@mylegalnotice.in',
        'For legal correspondence: My Legal Notice, India.',
        'Response time: We will respond to all requests within 72 hours.'
      ]
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', py: 8, px: 2, bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        <Box textAlign="center" mb={6}>
          <Box display="flex" justifyContent="center" mb={2}>
            <Box p={2} borderRadius="50%" bgcolor="rgba(99,102,241,0.1)">
              <Shield size={40} color="#6366f1" />
            </Box>
          </Box>
          <Typography variant="h3" fontWeight={800} mb={1}>Privacy Policy</Typography>
          <Typography variant="body1" color="text.secondary">
            Last updated: 19 March 2026
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            This policy applies to <strong>My Legal Notice India</strong> (mylegalnotice.in)
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            mb: 4
          }}
        >
          <Box
            sx={{
              p: 3,
              bgcolor: 'rgba(99,102,241,0.05)',
              borderRadius: 2,
              border: '1px solid rgba(99,102,241,0.2)',
              mb: 4
            }}
          >
            <Typography variant="body2" color="text.primary" fontWeight={500}>
              We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains
              how we collect, use, and protect your information in compliance with the{' '}
              <strong>Information Technology Act, 2000</strong>, the{' '}
              <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, and applicable Indian regulations.
            </Typography>
          </Box>

          {sections.map((section, i) => (
            <Box key={i} mb={4}>
              <Typography variant="h6" fontWeight={700} color="primary" mb={2}>{section.title}</Typography>
              <Box component="ul" sx={{ pl: 3, m: 0 }}>
                {section.content.map((item, j) => (
                  <Typography key={j} component="li" variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.8 }}>
                    {item}
                  </Typography>
                ))}
              </Box>
              {i < sections.length - 1 && <Divider sx={{ mt: 3 }} />}
            </Box>
          ))}
        </Paper>

        <Box textAlign="center" pb={4}>
          <Typography variant="body2" color="text.secondary">
            By using My Legal Notice, you agree to this Privacy Policy.{' '}
            <Link href="/terms" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>
              View Terms of Service →
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
