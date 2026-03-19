import { Box, Container, Typography } from '@mui/material';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPolicyPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 8, md: 10 } }}>
      <Typography variant="h3" fontWeight={800} mb={4}>
        Privacy Policy
      </Typography>
      
      <Box sx={{ typography: 'body1', color: 'text.secondary', lineHeight: 1.8, '& p': { mb: 3 } }}>
        <Typography paragraph><strong>Last Updated: March 2026</strong></Typography>
        
        <Typography paragraph>
          My Legal Notice India is committed to protecting your privacy. This Privacy Policy is strictly adapted to the Digital Personal Data Protection (DPDP) Act 2023 and the Information Technology (IT) Rules 2026 amendments regarding Artificial Intelligence transparency.
        </Typography>

        <Typography variant="h5" fontWeight={700} color="text.primary" mt={5} mb={2}>
          1. Data Collection & Temporary Processing
        </Typography>
        <Typography paragraph>
          We collect only the form-input data you explicitly provide (e.g., names, addresses, and dispute details) to generate the requested legal documents.
          This processing happens temporarily during generation.
        </Typography>
        
        <Typography variant="h5" fontWeight={700} color="text.primary" mt={5} mb={2}>
          2. No Permanent Storage Unless Authorized
        </Typography>
        <Typography paragraph>
          For Guest/Unauthenticated users, there is <strong>no permanent storage</strong> of personal data on our servers. The drafted document is immediately discarded from memory once returned to your browser. 
          If you explicitly sign in via Google Authentication to save drafts to your Dashboard, your input data and resulting document will be stored securely on our database. You can delete these at any time.
        </Typography>

        <Typography variant="h5" fontWeight={700} color="text.primary" mt={5} mb={2}>
          3. Secure AI Processing Transparency
        </Typography>
        <Typography paragraph>
          In compliance with the IT Rules 2026, we disclose that your input is processed via strict API protocols with secure external AI LLM providers (e.g., Google Gemini, OpenAI, Anthropic). Our agreements with these API providers strictly prohibit them from using your input details to train their foundational models.
        </Typography>

        <Typography variant="h5" fontWeight={700} color="text.primary" mt={5} mb={2}>
          4. Zero Third-Party Selling
        </Typography>
        <Typography paragraph>
          We absolutely do not sell, rent, or share your personal data with any third-party marketing or advertising services. Your data may only be disclosed if formally requested under a lawful, binding mandate for legal compliance.
        </Typography>

        <Typography variant="h5" fontWeight={700} color="text.primary" mt={5} mb={2}>
          5. Your Rights under the DPDP Act 2023
        </Typography>
        <Typography paragraph>
          Users in India hold full rights under the DPDP Act to query, access, correct, or request the erasure of any personal data stored by us. To exercise these rights as a Data Principal, email us directly at <strong>hello@mylegalnotice.in</strong>.
        </Typography>

        <Typography variant="h5" fontWeight={700} color="text.primary" mt={5} mb={2}>
          6. Cookies Policy
        </Typography>
        <Typography paragraph>
          We employ absolute minimal cookies. Analytics tools (like Google Analytics) are used strictly to measure site bandwidth and metrics via aggregate, anonymized tracking with proper consent banners.
        </Typography>
      </Box>
    </Container>
  );
}
