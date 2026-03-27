'use client';

import { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Button, Chip, CircularProgress,
  TextField, InputAdornment, IconButton, Tooltip, Divider,
  Alert, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { useSession, signIn } from 'next-auth/react';
import {
  FileText, MessageSquare, FilePenLine, Search, Trash2,
  Download, Copy, Calendar, Globe, RefreshCw, LogIn, Scale
} from 'lucide-react';
import { useTheme } from '@mui/material/styles';

type Notice = {
  id: string;
  title: string;
  type: string;
  language: string;
  content: string;
  formData: any;
  createdAt: string;
};

const TYPE_LABELS: Record<string, { label: string; color: 'primary' | 'success' | 'warning'; icon: React.ReactNode }> = {
  legalNotice: { label: 'Legal Notice', color: 'primary', icon: <FileText size={14} /> },
  whatsappMessage: { label: 'WhatsApp Draft', color: 'success', icon: <MessageSquare size={14} /> },
  complaintDraft: { label: 'Complaint Draft', color: 'warning', icon: <FilePenLine size={14} /> },
};

const LANG_NAMES: Record<string, string> = {
  en: 'English', hi: 'हिंदी', mr: 'मराठी', bn: 'বাংলা',
  ta: 'தமிழ்', te: 'తెలుగు', gu: 'ગુજરાતી', kn: 'ಕನ್ನಡ',
  pa: 'ਪੰਜਾਬੀ', ml: 'മലയാളം'
};

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const theme = useTheme();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setNotices(data.notices || []);
      }
    } catch (e) {
      console.error('Failed to fetch history', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchHistory();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const handleCopy = (id: string, content: string) => {
    const text = content.replace(/<[^>]+>/g, ''); // strip HTML if any
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/history', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteId }),
      });
      if (res.ok) {
        setNotices(prev => prev.filter(n => n.id !== deleteId));
      }
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleDownload = (notice: Notice) => {
    const cleanContent = notice.content.replace(/<[^>]+>/g, '');
    const blob = new Blob([cleanContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${notice.title || 'notice'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = notices.filter(n => {
    const matchType = filter === 'all' || n.type === filter;
    const matchSearch = !search ||
      n.title?.toLowerCase().includes(search.toLowerCase()) ||
      n.formData?.receiverName?.toLowerCase().includes(search.toLowerCase()) ||
      n.formData?.senderName?.toLowerCase().includes(search.toLowerCase()) ||
      n.formData?.description?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  if (status === 'unauthenticated') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', px: 2 }}>
        <Box p={3} bgcolor="rgba(99,102,241,0.1)" borderRadius="50%" mb={3}>
          <Scale size={56} color="#6366f1" />
        </Box>
        <Typography variant="h5" fontWeight={800} mb={1}>Sign In to View History</Typography>
        <Typography color="text.secondary" mb={4} maxWidth={400}>
          Your notice history is saved to your account. Sign in with Google to access all your previously generated documents.
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<LogIn size={20} />}
          onClick={() => signIn('google')}
          sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 700, background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)' }}
        >
          Sign In with Google
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} mb={0.5}>Notice History</Typography>
          <Typography color="text.secondary">All your previously generated legal documents</Typography>
        </Box>
        <Tooltip title="Refresh">
          <IconButton onClick={fetchHistory} sx={{ bgcolor: 'action.hover', borderRadius: 2 }}>
            <RefreshCw size={20} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Search + Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search by name, issue, recipient..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 220, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search size={16} /></InputAdornment>
          }}
        />
        {['all', 'legalNotice', 'whatsappMessage', 'complaintDraft'].map(f => (
          <Chip
            key={f}
            label={f === 'all' ? 'All' : TYPE_LABELS[f]?.label || f}
            onClick={() => setFilter(f)}
            color={filter === f ? 'primary' : 'default'}
            variant={filter === f ? 'filled' : 'outlined'}
            sx={{ fontWeight: 600, cursor: 'pointer' }}
          />
        ))}
      </Box>

      {/* Content */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 8, textAlign: 'center', borderRadius: 4,
            border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper'
          }}
        >
          <Box p={2.5} bgcolor="action.hover" borderRadius="50%" width={80} mx="auto" mb={2}>
            <Scale size={40} color="rgba(0,0,0,0.2)" />
          </Box>
          <Typography variant="h6" mb={1}>
            {search || filter !== 'all' ? 'No matching notices found' : 'No notices yet'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {search || filter !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Generate your first legal notice and it will appear here.'}
          </Typography>
        </Paper>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {filtered.map(notice => {
            const meta = TYPE_LABELS[notice.type] || { label: notice.type, color: 'default', icon: <FileText size={14} /> };
            const isExpanded = expandedId === notice.id;
            const preview = notice.content?.replace(/<[^>]+>/g, '').slice(0, 200) + '...';

            return (
              <Paper
                key={notice.id}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }
                }}
              >
                {/* Notice Header */}
                <Box
                  sx={{
                    p: 2.5,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                  onClick={() => setExpandedId(isExpanded ? null : notice.id)}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box display="flex" alignItems="center" gap={1.5} mb={0.75} flexWrap="wrap">
                      <Chip
                        icon={meta.icon as React.ReactElement}
                        label={meta.label}
                        color={meta.color as any}
                        size="small"
                        sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                      />
                      <Chip
                        icon={<Globe size={12} />}
                        label={LANG_NAMES[notice.language] || notice.language}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={700} noWrap>
                      {notice.title || 'Untitled Notice'}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                      <Calendar size={12} color={theme.palette.text.secondary} />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(notice.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Box display="flex" gap={0.75} onClick={e => e.stopPropagation()}>
                    <Tooltip title={copiedId === notice.id ? 'Copied!' : 'Copy text'}>
                      <IconButton size="small" onClick={() => handleCopy(notice.id, notice.content)}
                        sx={{ bgcolor: 'rgba(99,102,241,0.08)', borderRadius: 1.5 }}>
                        <Copy size={16} color={copiedId === notice.id ? '#10b981' : undefined} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download as .txt">
                      <IconButton size="small" onClick={() => handleDownload(notice)}
                        sx={{ bgcolor: 'rgba(99,102,241,0.08)', borderRadius: 1.5 }}>
                        <Download size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => setDeleteId(notice.id)}
                        sx={{ bgcolor: 'rgba(239,68,68,0.08)', borderRadius: 1.5 }}>
                        <Trash2 size={16} color="#ef4444" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Expandable Preview */}
                {isExpanded && (
                  <>
                    <Divider />
                    <Box sx={{ p: 3, bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)' }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontFamily: 'serif',
                          lineHeight: 1.8,
                          whiteSpace: 'pre-wrap',
                          maxHeight: 300,
                          overflowY: 'auto'
                        }}
                      >
                        {notice.content?.replace(/<[^>]+>/g, '') || 'No content'}
                      </Typography>
                    </Box>
                  </>
                )}
              </Paper>
            );
          })}
        </Box>
      )}

      {/* Stats summary */}
      {!loading && filtered.length > 0 && (
        <Box mt={3} textAlign="center">
          <Typography variant="caption" color="text.secondary">
            Showing {filtered.length} of {notices.length} notices
          </Typography>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Notice?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            This action cannot be undone. The notice will be permanently removed from your history.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={deleting}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
