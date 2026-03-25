'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  TextField, 
  InputAdornment, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  LinearProgress, 
  Button,
  Collapse,
  IconButton
} from '@mui/material';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Gift, 
  Video, 
  HelpCircle, 
  Zap, 
  ChevronLeft,
  LayoutDashboard
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface SidebarProps {
  onSessionSelect?: (sessionId: string) => void;
  sessions?: any[];
}

export default function Sidebar({ onSessionSelect, sessions = [] }: SidebarProps) {
  const { data: session } = useSession();
  const [openRecent, setOpenRecent] = React.useState(true);

  return (
    <Box sx={{ 
      width: 240, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      bgcolor: 'white', 
      borderRight: '1px solid', 
      borderColor: 'divider',
      position: 'relative'
    }}>
      {/* User Profile Header as Dashboard Link */}
      <Box 
        component={Link}
        href="/dashboard"
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5,
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        <Avatar 
          src={session?.user?.image || ''} 
          sx={{ width: 44, height: 44, bgcolor: '#4f46e5', fontSize: '1.2rem', fontWeight: 600 }}
        >
          {session?.user?.name?.charAt(0) || 'R'}
        </Avatar>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="body1" fontWeight={700} noWrap sx={{ color: '#1e293b', fontSize: '1rem' }}>
            {session?.user?.name || 'Raja Singh'}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap sx={{ display: 'block', mb: 0.2, fontSize: '0.75rem' }}>
            {session?.user?.email || 'er.rajababusingh@gmail.com'}
          </Typography>
          <Typography variant="caption" fontWeight={700} sx={{ color: '#ef4444' }}>
            Free Plan
          </Typography>
        </Box>
      </Box>

      {/* Search Bar */}
      <Box sx={{ px: 2, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color="#94a3b8" />
              </InputAdornment>
            ),
            sx: { borderRadius: 50, bgcolor: '#f8fafc', '& fieldset': { borderColor: '#e2e8f0' }, height: 44 }
          }}
        />
      </Box>

      {/* Recent Sessions List */}
      <Box sx={{ px: 1 }}>
        <ListItemButton 
          onClick={() => setOpenRecent(!openRecent)}
          sx={{ mb: 0.5 }}
        >
          <ListItemIcon sx={{ minWidth: 28 }}>
            {openRecent ? <ChevronDown size={18} /> : <ChevronRightIcon size={18} />}
          </ListItemIcon>
          <Typography variant="body2" fontWeight={700} color="#64748b">
            Recent Sessions
          </Typography>
        </ListItemButton>
        
        <Collapse in={openRecent} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {(sessions || []).slice(0, 3).map((s, idx) => (
              <ListItemButton 
                key={idx} 
                sx={{ borderRadius: 2, pl: 4, py: 1, mb: 0.2 }}
                onClick={() => onSessionSelect?.(s.id)}
              >
                <ListItemText 
                  primary={s.title || "Untitled Session"} 
                  secondary={s.date || ""}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 600, noWrap: true, sx: { color: '#334155' } }}
                  secondaryTypographyProps={{ variant: 'caption', sx: { color: '#94a3b8' } }}
                />
              </ListItemButton>
            ))}
            
            <ListItemButton 
              component="a" 
              href="/history" 
              sx={{ borderRadius: 2, pl: 4, py: 0.5 }}
            >
              <ListItemText 
                primary="View all history" 
                primaryTypographyProps={{ variant: 'caption', fontWeight: 700, color: '#4f46e5' }} 
              />
            </ListItemButton>
          </List>
        </Collapse>
      </Box>

      {/* Spacer to push only the usage section to the very bottom IF needed, otherwise keep it compact */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Bottom section */}
      <Box sx={{ p: 2, bgcolor: '#f8fafc' }}>
        <List component="div" disablePadding>
          <ListItemButton sx={{ borderRadius: 1.5, py: 1 }}>
            <ListItemIcon sx={{ minWidth: 32 }}><Gift size={18} color="#64748b" /></ListItemIcon>
            <ListItemText primary="Refer & earn" primaryTypographyProps={{ variant: 'body2', fontWeight: 600, color: '#475569' }} />
          </ListItemButton>
          <ListItemButton sx={{ borderRadius: 1.5, py: 1 }}>
            <ListItemIcon sx={{ minWidth: 32 }}><Video size={18} color="#64748b" /></ListItemIcon>
            <ListItemText primary="Tutorials" primaryTypographyProps={{ variant: 'body2', fontWeight: 600, color: '#475569' }} />
          </ListItemButton>
          <ListItemButton sx={{ borderRadius: 1.5, py: 1 }}>
            <ListItemIcon sx={{ minWidth: 32 }}><HelpCircle size={18} color="#64748b" /></ListItemIcon>
            <ListItemText primary="Help" primaryTypographyProps={{ variant: 'body2', fontWeight: 600, color: '#475569' }} />
          </ListItemButton>
        </List>

        <Divider sx={{ my: 2 }} />

        {/* AI Limit Progress */}
        <Box sx={{ px: 1 }}>
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 1, letterSpacing: '0.05em' }}>
            AI limit
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={100} 
            sx={{ 
              height: 6, 
              borderRadius: 3, 
              bgcolor: '#e2e8f0',
              '& .MuiLinearProgress-bar': { bgcolor: '#4f46e5', borderRadius: 3 }
            }} 
          />
          <Typography variant="caption" fontWeight={700} color="#64748b" sx={{ display: 'block', mt: 1 }}>
            500/ 500 Remaining
          </Typography>
        </Box>

        {/* Upgrade Button - HIDDEN IN SCREENSHOT but good to keep or remove if not needed */}
        <Button
          fullWidth
          variant="contained"
          startIcon={<Zap size={18} fill="currentColor" />}
          sx={{ 
            mt: 3, 
            borderRadius: 50, 
            py: 1.2, 
            textTransform: 'none', 
            fontWeight: 700,
            bgcolor: '#4f46e5',
            boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
            '&:hover': { bgcolor: '#4338ca' }
          }}
        >
          Upgrade Now
        </Button>
      </Box>

      {/* Collapse Handle */}
      <IconButton 
        sx={{ 
          position: 'absolute', 
          right: -14, 
          top: 100, 
          bgcolor: 'white', 
          border: '1px solid #e2e8f0',
          width: 28,
          height: 28,
          zIndex: 10,
          '&:hover': { bgcolor: '#f8fafc' }
        }}
        size="small"
      >
        <ChevronLeft size={16} color="#64748b" />
      </IconButton>
    </Box>
  );
}

function ChevronRightIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
