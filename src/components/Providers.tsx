"use client"

import { SessionProvider } from "next-auth/react"
import ThemeRegistry from "@/theme/ThemeRegistry"
import Sidebar from "@/components/Sidebar"
import Footer from "@/components/Footer"
import { Box } from "@mui/material"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeRegistry>
        <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', flex: 1 }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {children}
            </Box>
          </Box>
          <Footer />
        </Box>
      </ThemeRegistry>
    </SessionProvider>
  )
}
