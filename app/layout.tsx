import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'DEV SCSO',
  description: 'By William L.'
}
export const viewport = {
  width: 'device-width',
  height: 'device-height',
  initialScale: 1, 
  maximumScale: 1,
  userScalable: 'no'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html >
  )
}
