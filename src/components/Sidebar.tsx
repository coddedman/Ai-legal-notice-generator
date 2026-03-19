"use client"

import React, { useState } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Typography, IconButton, useTheme, useMediaQuery,
  Divider, Tooltip, Avatar, Chip
} from '@mui/material';
import {
  LayoutDashboard, FilePlus, MessageSquare, History,
  Settings, ChevronLeft, Menu as MenuIcon, Scale, X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 72;

type MenuItemType = { text: string; icon: React.ReactNode; path: string; description: string; badge?: string };

const menuItems: MenuItemType[] = [
  {
    text: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard',
    description: 'Overview & stats'
  },
  {
    text: 'History', icon: <History size={20} />, path: '/history',
    description: 'Past documents'
  },
  {
    text: 'WhatsApp Drafts', icon: <MessageSquare size={20} />, path: '/history',
    description: 'Demand messages'
  },
];

export default function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();
  const { data: session } = useSession();

  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDark = theme.palette.mode === 'dark';

  const sidebarBg = isDark
    ? 'linear-gradient(180deg, #0f1117 0%, #12141c 100%)'
    : 'linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #1a237e 100%)';

  const drawerContent = (
    <Box sx={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: sidebarBg,
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Subtle background orb */}
      <Box sx={{
        position: 'absolute', top: -40, right: -40, width: 180, height: 180,
        borderRadius: '50%', bgcolor: 'rgba(139,92,246,0.08)', filter: 'blur(40px)', pointerEvents: 'none'
      }} />
      <Box sx={{
        position: 'absolute', bottom: '30%', left: -30, width: 120, height: 120,
        borderRadius: '50%', bgcolor: 'rgba(99,102,241,0.06)', filter: 'blur(30px)', pointerEvents: 'none'
      }} />

      {/* Brand Header */}
      <Box sx={{
        px: open ? 3 : 'auto', py: 3,
        display: 'flex', alignItems: 'center',
        justifyContent: open ? 'space-between' : 'center',
        minHeight: 72,
        borderBottom: '1px solid rgba(255,255,255,0.07)'
      }}>
        {open ? (
          <>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box sx={{
                width: 36, height: 36, borderRadius: 2.5,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(99,102,241,0.4)'
              }}>
                <Scale size={20} color="white" />
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 800, color: 'white', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                  My Legal Notice
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.65rem' }}>
                  India · AI-Powered
                </Typography>
              </Box>
            </Box>
            {!isMobile && (
              <IconButton size="small" onClick={() => setOpen(false)}
                sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.08)' } }}>
                <ChevronLeft size={18} />
              </IconButton>
            )}
            {isMobile && (
              <IconButton size="small" onClick={() => setMobileOpen(false)}
                sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: 'white' } }}>
                <X size={18} />
              </IconButton>
            )}
          </>
        ) : (
          <IconButton size="small" onClick={() => setOpen(true)}
            sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.08)' } }}>
            <Scale size={22} />
          </IconButton>
        )}
      </Box>

      {/* User Info (when open) */}
      {open && session?.user && (
        <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar
              src={session.user.image || ''}
              sx={{ width: 32, height: 32, border: '2px solid rgba(255,255,255,0.2)' }}
            >
              {session.user.name?.charAt(0)}
            </Avatar>
            <Box flex={1} minWidth={0}>
              <Typography variant="caption" fontWeight={700} sx={{ color: 'rgba(255,255,255,0.9)', display: 'block' }} noWrap>
                {session.user.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', display: 'block' }} noWrap>
                {session.user.email}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Nav Section Label */}
      {open && (
        <Box sx={{ px: 3, pt: 2.5, pb: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '0.08em', fontSize: '0.6rem' }}>
            NAVIGATION
          </Typography>
        </Box>
      )}

      {/* Menu Items */}
      <List sx={{ px: 1.5, py: 1, flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
          return (
            <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 0.5 }}>
              <Tooltip title={!open ? item.text : ''} placement="right" arrow>
                <ListItemButton
                  component={Link}
                  href={item.path}
                  onClick={() => isMobile && setMobileOpen(false)}
                  sx={{
                    minHeight: 46,
                    justifyContent: open ? 'initial' : 'center',
                    px: open ? 2 : 0,
                    borderRadius: 2.5,
                    position: 'relative',
                    transition: 'all 0.2s',
                    bgcolor: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                    '&:hover': {
                      bgcolor: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
                    },
                    ...(isActive && {
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        height: '60%',
                        width: 3,
                        borderRadius: '0 3px 3px 0',
                        bgcolor: '#a5b4fc',
                      }
                    })
                  }}
                >
                  <ListItemIcon sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                    color: isActive ? '#c7d2fe' : 'rgba(255,255,255,0.5)',
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={item.text}
                      secondary={item.description}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '0.875rem',
                        color: isActive ? '#e0e7ff' : 'rgba(255,255,255,0.8)',
                        lineHeight: 1.2,
                      }}
                      secondaryTypographyProps={{
                        fontSize: '0.7rem',
                        color: 'rgba(255,255,255,0.3)',
                        lineHeight: 1.2,
                        mt: 0.25,
                      }}
                    />
                  )}
                  {open && item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      sx={{
                        height: 18, fontSize: '0.58rem', fontWeight: 800,
                        bgcolor: 'rgba(99,102,241,0.5)',
                        color: '#c7d2fe',
                        '& .MuiChip-label': { px: 1 }
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      {/* Bottom: Legal links */}
      {open && (
        <Box sx={{ px: 2.5, pb: 2.5, borderTop: '1px solid rgba(255,255,255,0.06)', pt: 2 }}>
          <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
            {[
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms', href: '/terms' },
            ].map(l => (
              <Link key={l.label} href={l.href} style={{ textDecoration: 'none' }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.25)', '&:hover': { color: 'rgba(255,255,255,0.5)' }, transition: 'color 0.15s', fontSize: '0.65rem' }}>
                  {l.label}
                </Typography>
              </Link>
            ))}
          </Box>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.15)', display: 'block', textAlign: 'center', mt: 0.75, fontSize: '0.6rem' }}>
            © 2026 My Legal Notice India
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {/* Mobile open button */}
      {isMobile && (
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{
            position: 'fixed', top: 16, left: 16, zIndex: theme.zIndex.drawer + 2,
            bgcolor: '#1a237e', color: 'white', width: 40, height: 40,
            boxShadow: '0 4px 12px rgba(26,35,126,0.4)',
            '&:hover': { bgcolor: '#311b92' }
          }}
        >
          <MenuIcon size={20} />
        </IconButton>
      )}

      {/* Desktop Permanent Drawer */}
      {!isMobile && (
        <Box component="nav" sx={{ width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH, flexShrink: 0 }}>
          <Drawer
            variant="permanent"
            open={open}
            sx={{
              '& .MuiDrawer-paper': {
                width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
                transition: theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
                overflowX: 'hidden',
                border: 'none',
                borderRadius: 0,
                boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
              },
            }}
          >
            {drawerContent}
          </Drawer>
        </Box>
      )}

      {/* Mobile Temp Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none', borderRadius: 0 },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}
