import { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bitcoin Code - Build Decentralized Apps on Bitcoin',
  description: 'A powerful, open-source platform for creating blockchain applications with integrated BSV wallet support and smart contract capabilities.',
  keywords: ['Bitcoin', 'BSV', 'Blockchain', 'DApps', 'Code Editor', 'Smart Contracts'],
  authors: [{ name: 'The Bitcoin Corporation LTD' }],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}