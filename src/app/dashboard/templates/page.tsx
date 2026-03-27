'use client';


import { Box, Typography, Button, Grid, Card, CardContent, Chip, Divider } from '@mui/material';
import { LayoutGrid, ArrowLeft, ArrowRight, Scale, Home, Briefcase, Users, FileText, ShieldCheck, Search, BookOpen, Building } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import GuestBanner from '@/components/GuestBanner';

const TEMPLATES = [
  { title: 'Cheque Bounce Notice', desc: 'Formal notice under Section 138 NI Act for dishonoured cheques.', tag: 'Recovery', color: '#ef4444', bg: '#fef2f2', icon: <FileText size={18} color="#ef4444" />, prompt: 'Draft a legal notice under Section 138 of the Negotiable Instruments Act for dishonour of cheque due to insufficient funds.' },
  { title: 'Property Dispute Notice', desc: 'Legal notice for illegal possession or encroachment of property.', tag: 'Property', color: '#f59e0b', bg: '#fffbeb', icon: <Home size={18} color="#f59e0b" />, prompt: 'Draft a legal notice for illegal encroachment and trespass on private property under Transfer of Property Act and BNS 2023.' },
  { title: 'Consumer Complaint', desc: 'Complaint to consumer forum for defective goods or deficient services.', tag: 'Consumer', color: '#10b981', bg: '#ecfdf5', icon: <Users size={18} color="#10b981" />, prompt: 'Draft a consumer complaint notice under the Consumer Protection Act 2019 for deficiency in service and unfair trade practice.' },
  { title: 'Termination Notice', desc: 'Notice from employer for termination of employment with proper grounds.', tag: 'Employment', color: '#3b82f6', bg: '#eff6ff', icon: <Briefcase size={18} color="#3b82f6" />, prompt: 'Draft an employment termination notice citing misconduct and non-performance, complying with Indian labour laws and the Industrial Disputes Act.' },
  { title: 'Rent Eviction Notice', desc: 'Notice to tenant for non-payment of rent or lease violation.', tag: 'Rent', color: '#8b5cf6', bg: '#f5f3ff', icon: <Building size={18} color="#8b5cf6" />, prompt: 'Draft a legal eviction notice to tenant for non-payment of rent under relevant state Rent Control Act and Transfer of Property Act.' },
  { title: 'Demand for Payment', desc: 'General demand notice for recovery of outstanding dues.', tag: 'Recovery', color: '#ef4444', bg: '#fef2f2', icon: <Scale size={18} color="#ef4444" />, prompt: 'Draft a formal demand notice for recovery of outstanding dues and unpaid amounts under the Contract Act 1872.' },
  { title: 'Defamation Notice', desc: 'Legal notice for false statements damaging reputation.', tag: 'Civil', color: '#64748b', bg: '#f8fafc', icon: <ShieldCheck size={18} color="#64748b" />, prompt: 'Draft a defamation legal notice for false and defamatory statements made against my client under BNS 2023 and common law.' },
  { title: 'RTI Application', desc: 'Draft a Right to Information request to a public authority.', tag: 'Govt', color: '#0ea5e9', bg: '#f0f9ff', icon: <Search size={18} color="#0ea5e9" />, prompt: 'Draft a Right to Information (RTI) application under the RTI Act 2005 requesting specific government documents and records.' },
  { title: 'FIR Quashing Petition', desc: 'Petition to High Court for quashing of frivolous FIR.', tag: 'Criminal', color: '#6d28d9', bg: '#f5f3ff', icon: <BookOpen size={18} color="#6d28d9" />, prompt: 'Draft a petition under Section 528 BNSS (formerly Section 482 CrPC) for quashing of an FIR filed on frivolous and false grounds.' },
];

export default function TemplatesPage() {
  const { status } = useSession();
  const isGuest = status === 'unauthenticated';
  const router = useRouter();

  const handleUse = (prompt: string) => {
    localStorage.setItem('template_prompt', prompt);
    router.push('/generate');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {isGuest && <GuestBanner />}
      <Box sx={{ maxWidth: 1100, mx: 'auto', p: { xs: 3, md: 5 }, width: '100%' }}>
        <Button component={Link} href={isGuest ? '/' : '/dashboard'} startIcon={<ArrowLeft size={16} />}
          sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 600, mb: 3, pl: 0 }}>
          {isGuest ? 'Back to Home' : 'Back to Dashboard'}
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LayoutGrid size={22} color="#4f46e5" />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>Legal Templates</Typography>
            <Typography variant="body2" color="text.secondary">Pre-built prompts for common legal notices — one click to generate</Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 3 }} />

        <Grid container spacing={2.5}>
          {TEMPLATES.map((t) => (
            <Grid key={t.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{
                borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'none', height: '100%',
                display: 'flex', flexDirection: 'column', transition: 'all 0.2s',
                '&:hover': { borderColor: '#c7d2fe', boxShadow: '0 4px 20px rgba(79,70,229,0.08)', transform: 'translateY(-2px)' },
              }}>
                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: '9px', bgcolor: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {t.icon}
                    </Box>
                    <Chip label={t.tag} size="small" sx={{ bgcolor: t.bg, color: t.color, fontWeight: 700, fontSize: '0.7rem', height: 22 }} />
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700} mb={0.8} sx={{ color: '#1e293b' }}>{t.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{t.desc}</Typography>
                </CardContent>
                <Box sx={{ px: 2.5, pb: 2.5 }}>
                  <Button fullWidth variant="outlined" endIcon={<ArrowRight size={15} />}
                    onClick={() => handleUse(t.prompt)}
                    sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: '0.82rem', borderColor: '#e2e8f0', color: '#4f46e5', '&:hover': { bgcolor: '#ede9fe', borderColor: '#c4b5fd' } }}>
                    Use Template
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
