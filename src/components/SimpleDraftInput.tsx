'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  IconButton, 
  FormControl, 
  Select, 
  MenuItem,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Divider,
  LinearProgress
} from '@mui/material';
import { Pencil, X, Lock } from 'lucide-react';
import { LANGUAGES } from './NoticeForm';

interface SimpleDraftInputProps {
  onSubmit: (data: { description: string; language: string; useBNS: boolean; evidenceText?: string; targetDoc: string }) => void;
  loading: boolean;
  onClose?: () => void;
}

export default function SimpleDraftInput({ onSubmit, loading, onClose }: SimpleDraftInputProps) {
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('en');
  const [targetDoc, setTargetDoc] = useState('legalNotice');
  const [useBNS, setUseBNS] = useState(false);

  const isFormValid = description.trim().length > 10;
  
  // Calculate prompt strength
  const promptStrength = Math.min(100, Math.max(0, (description.length / 200) * 100));
  let strengthLabel = "Weak Prompt";
  if (promptStrength > 30) strengthLabel = "Good Prompt";
  if (promptStrength > 70) strengthLabel = "Strong Prompt";

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
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Pencil size={24} color="#4f46e5" />
            <Typography variant="h5" fontWeight={800} sx={{ color: '#0f172a' }}>
              Please tell us more about what you want to draft
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ mt: -0.5, mr: -0.5 }}>
            <X size={20} />
          </IconButton>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Do include which legal document you want to draft and the facts of the case
        </Typography>

        {/* Text Area */}
        <TextField
          fullWidth
          multiline
          rows={6}
          placeholder="e.g. My client has been charged with Section 6 POCSO and rape charges. The FIR no. is 94 of 2023 and it is alleged that he committed rape of a minor girl in 2017 but he was not in India at that time. I need to draft a petition for quashing the FIR in Delhi high court..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              fontSize: '1rem',
              lineHeight: 1.6,
              bgcolor: 'white'
            }
          }}
        />

        {/* Prompt Strength */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="body2" fontWeight={600} color={promptStrength > 70 ? 'success.main' : promptStrength > 30 ? 'warning.main' : 'text.primary'}>
                {strengthLabel}:
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Add more context for higher quality drafts.
            </Typography>
        </Box>
        <LinearProgress 
            variant="determinate" 
            value={promptStrength || 5} 
            sx={{ 
                height: 6, 
                borderRadius: 3, 
                mb: 4, 
                bgcolor: 'rgba(0,0,0,0.05)',
                '& .MuiLinearProgress-bar': {
                    bgcolor: promptStrength > 70 ? '#10b981' : promptStrength > 30 ? '#f59e0b' : '#cbd5e1'
                }
            }} 
        />

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
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 1, color: '#0f172a' }}>Draft in</Typography>
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

            <Box sx={{ display: 'flex', alignItems: 'center', p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                <FormControlLabel
                control={<Checkbox checked={useBNS} onChange={(e) => setUseBNS(e.target.checked)} color="primary" sx={{ color: 'text.secondary' }} />}
                label={<Typography variant="body1" color="text.primary">Draft in BNS/BNSS</Typography>}
                sx={{ m: 0, width: '100%' }}
                />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, bgcolor: '#f8fafc' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox disabled color="primary" sx={{ color: 'text.secondary' }} />
                    <Box>
                        <Typography variant="body1" color="text.secondary">
                            Deep thinking <Typography component="span" color="text.disabled">(more accurate draft generation but takes longer)</Typography>
                        </Typography>
                        <Typography variant="body2" color="text.primary" fontWeight={500}>
                            Available with a paid plan.
                        </Typography>
                    </Box>
                </Box>
                <Lock size={20} color="#94a3b8" style={{ marginRight: 8 }} />
            </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button variant="text" onClick={onClose} sx={{ textTransform: 'none', fontWeight: 500, color: 'text.secondary', fontSize: '1rem' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!isFormValid || loading}
            onClick={() => onSubmit({ description, language, useBNS, targetDoc })}
            sx={{
              px: 4,
              py: 1,
              borderRadius: 1.5,
              bgcolor: '#4f46e5',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#4338ca',
                boxShadow: 'none',
              }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
