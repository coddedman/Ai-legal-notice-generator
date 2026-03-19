"use client"

import React, { useState } from 'react';
import { 
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, 
  ListItemText, Typography, IconButton, useTheme, useMediaQuery,
  Divider, Tooltip
} from '@mui/material';
import { 
  LayoutDashboard, 
  FilePlus, 
  MessageSquare, 
  History, 
  Settings, 
  ChevronLeft, 
  Menu as MenuIcon,
  Scale
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 80;

const menuItems = [
  { text: 'Dashboard', icon: <LayoutDashboard size={22} />, path: '/dashboard' },
  { text: 'Generator', icon: <FilePlus size={22} />, path: '/' },
  { text: 'WhatsApp Drafts', icon: <MessageSquare size={22} />, path: '/whatsapp' },
  { text: 'History', icon: <History size={22} />, path: '/history' },
];

export default function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();
  
  const [open, setOpen] = useState(!isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawerContent = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'primary.main',
      color: theme.palette.mode === 'dark' ? 'text.primary' : '#fff'
    }}>
      {/* Brand Logo Section */}
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: open ? 'space-between' : 'center',
        minHeight: 80
      }}>
        {open && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Scale size={32} color={theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.secondary.main} />
            <Typography variant="h6" sx={{ 
              fontWeight: 800, 
              letterSpacing: -0.5, 
              color: theme.palette.mode === 'dark' ? 'primary.main' : 'inherit' 
            }}>
              My Legal Notice
            </Typography>
          </Box>
        )}
        {!open && <Scale size={32} color={theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.secondary.main} />}
      </Box>

      <Divider sx={{ opacity: 0.1, bgcolor: 'rgba(255,255,255,0.1)' }} />

      {/* Navigation Items */}
      <List sx={{ px: 1.5, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 0.5 }}>
              <Tooltip title={!open ? item.text : ""} placement="right">
                <ListItemButton
                  component={Link}
                  href={item.path}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    borderRadius: 2,
                    bgcolor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                    '&:hover': {
                      bgcolor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                      color: isActive ? '#fff' : 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ 
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '0.925rem'
                      }} 
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ mt: 'auto', p: 1.5 }}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              borderRadius: 2,
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.05)',
                color: '#fff'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', justifyContent: 'center', color: 'inherit' }}>
              <Settings size={22} />
            </ListItemIcon>
            {open && <ListItemText primary="Settings" primaryTypographyProps={{ fontWeight: 500, fontSize: '0.925rem' }} />}
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ position: 'fixed', top: 16, left: 16, zIndex: theme.zIndex.drawer + 2, bgcolor: 'background.paper', boxShadow: 2 }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Desktop Persistent Drawer */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
            flexShrink: 0,
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            '& .MuiDrawer-paper': {
              width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
              borderRight: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Mobile Temporary Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}
