'use client';

import { useState, useContext, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container, Typography, Box, Paper, Snackbar, Alert,
  CircularProgress, IconButton, Button, Avatar, Menu,
  MenuItem, ListItemIcon, Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from '@/theme/ThemeRegistry';
import SimpleDraftInput from '@/components/SimpleDraftInput';
import DraftingWorkspace from '@/components/DraftingWorkspace';
import { NoticeFormData } from '@/components/NoticeForm';
import { 
  ShieldCheck, 
  Scale, 
  FileSignature, 
  Sun, 
  Moon, 
  LogIn, 
  UserCircle, 
  LogOut, 
  AlertTriangle, 
  ArrowLeft, 
  Sparkles 
} from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

const LOADING_MESSAGES = [
  'Analyzing dispute and context...',
  'Identifying relevant Indian Laws (BNS 2023)...',
  'Drafting your formal Legal Document...',
  'Structuring the formal Court/Police complaint...',
  'Refining legal terminology...',
  'Finalizing drafting workspace...'
];

export default function GeneratePage() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openProfile = Boolean(anchorEl);
  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);

  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [formData, setFormData] = useState<NoticeFormData>({
    senderType: 'self',
    issueType: 'General Legal Issue',
    senderName: '',
    senderAddress: '',
    receiverName: '',
    receiverAddress: '',
    serviceDetails: '',
    amount: '',
    paymentDate: '',
    deliveryDate: '',
    description: '',
    language: 'en',
    courtName: '',
    complaintNumber: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [workspaceMode, setWorkspaceMode] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [recentNotices, setRecentNotices] = useState<any[]>([]);

  // Fetch recent notices for the sidebar
  const fetchNotices = useCallback(async () => {
    if (status !== 'authenticated') return;
    try {
        const res = await fetch('/api/history?limit=10');
        if (res.ok) {
            const data = await res.json();
            setRecentNotices(data.notices.map((n: any) => ({
                id: n.id,
                title: n.title,
                content: n.content,
                formData: n.formData,
                date: new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
            })));
        }
    } catch (err) {}
  }, [status]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const handleGenerate = useCallback(async (inputData: { description: string, language: string, useBNS: boolean, evidenceText?: string, targetDoc: string }) => {
    if (status === 'unauthenticated') {
      localStorage.setItem('draft_initial_input', JSON.stringify(inputData));
      signIn();
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    setLoadingStep(0);

    const messageInterval = setInterval(() => {
      setLoadingStep(prev => (prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev));
    }, 2500);

    try {
      const payload = {
        ...formData,
        description: inputData.description,
        language: inputData.language,
        evidenceText: inputData.evidenceText,
        useBNS: inputData.useBNS,
        targetDoc: inputData.targetDoc || 'legalNotice'
      };

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to generate draft');
      const data = await res.json();
      
      const finalDraft = data[inputData.targetDoc || 'legalNotice'] || Object.values(data)[0];
      setGeneratedContent(finalDraft as string);
      setFormData(prev => ({ ...prev, description: inputData.description, language: inputData.language, targetDoc: inputData.targetDoc }));
      setWorkspaceMode(true);
      setSuccessMsg('Draft generated successfully!');

      // Save to history silently
      fetch('/api/save-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: data.legalNotice,
          type: 'legalDraft',
          language: inputData.language,
          formData: payload,
        })
      }).catch(() => {});

    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      clearInterval(messageInterval);
    }
  }, [status, formData]);

  const handleModify = async (refinement: string): Promise<void> => {
    if (status === 'unauthenticated') {
      signIn();
      return;
    }
    setLoading(true); // Ensure loading is set for workplace-mode refinements
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          refinement, 
          currentDraft: generatedContent,
          targetDoc: (formData as any).targetDoc || 'legalNotice'
        }),
      });

      if (res.status === 401) {
        signIn();
        return;
      }

      if (!res.ok) throw new Error('Failed to refine draft');
      const data = await res.json();
      const finalDraft = data[(formData as any).targetDoc || 'legalNotice'] || Object.values(data)[0];
      setGeneratedContent(finalDraft as string);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem('draft_initial_input');
    if (savedData && status === 'authenticated') {
      localStorage.removeItem('draft_initial_input');
      handleGenerate(JSON.parse(savedData));
    }
  }, [status, handleGenerate]);

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: 2 }}>
        <CircularProgress size={24} />
        <Typography variant="body2" color="text.secondary">Loading secure session...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header / Navbar */}
      <Box sx={{ 
        height: 64, 
        px: 3, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        zIndex: 100
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton component={Link} href={workspaceMode ? '#' : '/dashboard'} onClick={() => workspaceMode && setWorkspaceMode(false)} size="small">
                <ArrowLeft size={20} />
            </IconButton>
            <Typography variant="h6" fontWeight={800} sx={{ color: '#4f46e5' }}>
                AI Legal Desk
            </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          {status === 'authenticated' ? (
            <>
              <IconButton onClick={handleProfileClick} sx={{ p: 0.5, border: '1px solid', borderColor: 'divider' }}>
                <Avatar src={session.user?.image || ''} sx={{ width: 32, height: 32, fontSize: '0.9rem' }}>
                  {session.user?.name?.charAt(0)}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl} open={openProfile} onClose={handleProfileClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{ sx: { mt: 1.5, borderRadius: 3, minWidth: 180 } }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" noWrap>{session.user?.name}</Typography>
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                    {session.user?.email}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <MenuItem component={Link} href="/history" onClick={handleProfileClose}>
                  <ListItemIcon><UserCircle size={18} /></ListItemIcon>
                  My History
                </MenuItem>
                <MenuItem onClick={() => { handleProfileClose(); signOut(); }} sx={{ color: 'error.main' }}>
                  <ListItemIcon><LogOut size={18} color={theme.palette.error.main} /></ListItemIcon>
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button variant="text" onClick={() => signIn()} sx={{ borderRadius: 2 }}>Sign In</Button>
          )}

          <IconButton onClick={colorMode.toggleColorMode} sx={{ border: '1px solid', borderColor: 'divider' }}>
            {theme.palette.mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </IconButton>
        </Box>
      </Box>

       {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, position: 'relative', display: 'flex', bgcolor: '#f8fafc' }}>
        
        {/* Sidebar Sidebar */}
        {status === 'authenticated' && (
            <Sidebar 
                sessions={recentNotices} 
                onSessionSelect={(id) => {
                    const notice = recentNotices.find(n => n.id === id);
                    if (notice) {
                        setGeneratedContent(notice.content || '');
                        if (notice.formData && typeof notice.formData === 'object') {
                             setFormData(prev => ({ ...prev, ...notice.formData }));
                        }
                        setWorkspaceMode(true);
                    }
                }} 
            />
        )}

        {/* The Actionable Content Pane */}
        <Box sx={{ 
            flexGrow: 1, 
            position: 'relative', 
            overflowY: 'auto',
            height: 'calc(100vh - 64px)', // Fixed exact header math
            display: 'flex',
            flexDirection: 'column',
            pb: workspaceMode ? 10 : 0 // Add padding so floating action bar doesn't overlap text
        }}>
            {loading && !workspaceMode && (
                <Box sx={{ 
                    position: 'absolute', inset: 0, zIndex: 10, 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)'
                }}>
                    <Box sx={{ position: 'relative', width: 80, height: 80, mb: 4 }}>
                        <CircularProgress size={80} thickness={2} sx={{ color: '#4f46e5', position: 'absolute' }} />
                        <Sparkles size={32} color="#4f46e5" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                    </Box>
                    <Typography variant="h5" fontWeight={700} mb={1} color="text.primary">
                        {LOADING_MESSAGES[loadingStep] || "Drafting your document..."}
                    </Typography>
                </Box>
            )}

            {!workspaceMode ? (
                <Container maxWidth="md" sx={{ py: 6 }}>
                    <Box textAlign="center" mb={6}>
                        <Typography variant="h3" fontWeight={900} mb={2} sx={{ letterSpacing: '-0.04em', color: '#1e293b' }}>
                            Legal Drafting Desk
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
                            Generate precise legal notices and agreements. Professional results in seconds.
                        </Typography>
                    </Box>
                    
                    <SimpleDraftInput onSubmit={handleGenerate} loading={loading} />
                </Container>
            ) : (
                <DraftingWorkspace 
                    initialContent={generatedContent || ''} 
                    loading={loading}
                    formData={formData}
                    updateFormData={(newData) => setFormData(prev => ({ ...prev, ...newData }))}
                    onSave={async (content) => {
                        if (status === 'unauthenticated') {
                            signIn();
                            return;
                        }
                        setLoading(true);
                        try {
                            const res = await fetch('/api/save-notice', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    content,
                                    type: (formData as any).targetDoc || 'legalNotice',
                                    language: formData.language,
                                    formData: formData,
                                })
                            });
                            if (!res.ok) throw new Error('Failed to save draft');
                            setGeneratedContent(content);
                            setSuccessMsg('Changes saved to your history!');
                            fetchNotices(); // Refresh sidebar after save
                        } catch (err: any) {
                            setError(err.message);
                        } finally {
                            setLoading(false);
                        }
                    }}
                    onModify={handleModify}
                />
            )}
        </Box>
      </Box>

      <Snackbar open={!!error || !!successMsg} autoHideDuration={4000}
        onClose={() => { setError(null); setSuccessMsg(null); }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={error ? 'error' : 'success'} sx={{ width: '100%', borderRadius: 2 }}>
          {error || successMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
