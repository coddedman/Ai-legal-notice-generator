"use client"

import { SessionProvider } from "next-auth/react"
import ThemeRegistry from "@/theme/ThemeRegistry"
import Sidebar from "@/components/Sidebar"
import { Box } from "@mui/material"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeRegistry>
        <Box sx={{ display: 'flex' }}>
          <Sidebar />
          <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, minHeight: '100vh', overflow: 'hidden' }}>
            {children}
          </Box>
        </Box>
      </ThemeRegistry>
    </SessionProvider>
  )
}
