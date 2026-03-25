"use client"

import { SessionProvider } from "next-auth/react"
import ThemeRegistry from "@/theme/ThemeRegistry"
import Footer from "@/components/Footer"
import { Box } from "@mui/material"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeRegistry>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: '100vh', overflow: 'hidden' }}>
            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column' }}>
              {children}
            </Box>
            <Footer />
          </Box>
        </Box>
      </ThemeRegistry>
    </SessionProvider>
  )
}
