'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, Paper,
  FormControl, Select, MenuItem, Checkbox, FormControlLabel,
  CircularProgress, Divider, LinearProgress
} from '@mui/material';
import { Pencil, Lock, Sparkles } from 'lucide-react';
import { LANGUAGES } from './NoticeForm';

interface SimpleDraftInputProps {
  onSubmit: (data: { description: string; language: string; useBNS: boolean; evidenceText?: string; targetDoc: string }) => void;
  loading: boolean;
}

export default function SimpleDraftInput({ onSubmit, loading }: SimpleDraftInputProps) {
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('en');
  const [targetDoc, setTargetDoc] = useState('legalNotice');
  const [useBNS, setUseBNS] = useState(false);

  // Auto-fill from template selection
  useEffect(() => {
    const saved = localStorage.getItem('template_prompt');
    if (saved) {
      setDescription(saved);
      localStorage.removeItem('template_prompt');
    }
  }, []);

  const isFormValid = description.trim().length > 10;
  const hasStartedTyping = description.length > 0;

  // Prompt strength — only meaningful after user types
  const promptStrength = Math.min(100, Math.max(0, (description.length / 200) * 100));
  let strengthLabel = 'Weak Prompt';
  let strengthColor = '#94a3b8';
  if (promptStrength > 70) { strengthLabel = 'Strong Prompt'; strengthColor = '#10b981'; }
  else if (promptStrength > 30) { strengthLabel = 'Good Prompt'; strengthColor = '#f59e0b'; }

  return (
    <Box sx={{ width: '100%', maxWidth: 750, mx: 'auto' }}>
      <Paper elevation={0} sx={{ 
        p: { xs: 3, md: 4 }, 
        borderRadius: 3, 
        border: '1px solid', 
        borderColor: 'divider',
        bgcolor: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        {/* Header — clean, no close button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Pencil size={22} color="#4f46e5" />
          <Typography variant="h6" fontWeight={800} sx={{ color: '#0f172a' }}>
            What would you like to draft?
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Describe your case facts and the document you need — the AI will handle the legal drafting.
        </Typography>

        {/* Text Area */}
        <TextField
          fullWidth
          multiline
          rows={6}
          placeholder="e.g. My client has been charged under Section 6 POCSO. FIR No. 94/2023. He was not in India at the time. I need to draft a petition for quashing the FIR in Delhi High Court..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              fontSize: '1rem',
              lineHeight: 1.6,
              bgcolor: '#fafafa',
              '&:hover fieldset': { borderColor: '#c7d2fe' },
              '&.Mui-focused fieldset': { borderColor: '#4f46e5' },
            }
          }}
        />

        {/* Prompt Strength — only shown after user starts typing */}
        {hasStartedTyping && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
              <Typography variant="body2" fontWeight={700} sx={{ color: strengthColor }}>
                {strengthLabel}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                — add more case context for a stronger draft.
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={promptStrength || 5}
              sx={{
                height: 5,
                borderRadius: 3,
                bgcolor: 'rgba(0,0,0,0.05)',
                '& .MuiLinearProgress-bar': { bgcolor: strengthColor, borderRadius: 3 }
              }}
            />
          </Box>
        )}
        {!hasStartedTyping && <Box sx={{ mb: 4 }} />}

        {/* Options */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1, color: '#0f172a' }}>Document Type</Typography>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Select
                  value={targetDoc}
                  onChange={(e) => setTargetDoc(e.target.value)}
                  sx={{ borderRadius: 1.5, bgcolor: '#f8fafc', '& fieldset': { border: 'none' } }}
                >
                  <MenuItem value="legalNotice">Legal Notice</MenuItem>
                  <MenuItem value="complaintDraft">Court Complaint</MenuItem>
                  <MenuItem value="whatsappMessage">WhatsApp Demand</MenuItem>
                  <MenuItem value="emailDraft">Formal Email</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1, color: '#0f172a' }}>Draft in Language</Typography>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  sx={{ borderRadius: 1.5, bgcolor: '#f8fafc', '& fieldset': { border: 'none' } }}
                >
                  {LANGUAGES.map(l => (
                    <MenuItem key={l.code} value={l.code}>{l.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', p: 1.2, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
            <FormControlLabel
              control={<Checkbox checked={useBNS} onChange={(e) => setUseBNS(e.target.checked)} color="primary" />}
              label={
                <Box>
                  <Typography variant="body2" fontWeight={600} color="text.primary">Use BNS / BNSS 2023</Typography>
                  <Typography variant="caption" color="text.secondary">Cite new Indian criminal codes instead of IPC/CrPC</Typography>
                </Box>
              }
              sx={{ m: 0, width: '100%' }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.2, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, bgcolor: '#fafafa', opacity: 0.7 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox disabled color="primary" />
              <Box>
                <Typography variant="body2" fontWeight={600} color="text.secondary">
                  Deep Thinking Mode
                  <Box component="span" sx={{ ml: 1, fontSize: '0.72rem', bgcolor: '#fef3c7', color: '#d97706', px: 1, py: 0.2, borderRadius: 1, fontWeight: 700 }}>PRO</Box>
                </Typography>
                <Typography variant="caption" color="text.disabled">More accurate — takes longer. Available on paid plan.</Typography>
              </Box>
            </Box>
            <Lock size={16} color="#94a3b8" style={{ marginRight: 8 }} />
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Submit only — no confusing Cancel */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={!isFormValid || loading}
          onClick={() => onSubmit({ description, language, useBNS, targetDoc })}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Sparkles size={18} />}
          sx={{
            py: 1.5,
            borderRadius: 2,
            bgcolor: '#4f46e5',
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: 'none',
            '&:hover': { bgcolor: '#4338ca', boxShadow: '0 4px 16px rgba(79,70,229,0.35)' },
            '&:disabled': { bgcolor: '#e2e8f0', color: '#94a3b8' },
          }}
        >
          {loading ? 'Generating your draft...' : 'Generate Legal Draft'}
        </Button>
      </Paper>
    </Box>
  );
}
