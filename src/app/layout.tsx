import { ThemeProvider } from '@/components/providers/ThemeContext'
import './globals.css'
import { Inter } from 'next/font/google'
import { LocalizationProvider } from '@/components/providers/LocalizationContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Social Feed App',
  description: 'A simple interactive social feed interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <LocalizationProvider>{children}</LocalizationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
