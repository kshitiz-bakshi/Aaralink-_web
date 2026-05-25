import '../styles/globals.css'
import type { Metadata } from 'next'
import { Cinzel, Josefin_Sans } from 'next/font/google'

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cinzel',
})

const josefinSans = Josefin_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-josefin',
})

export const metadata: Metadata = {
  title: 'Aaralink — Property Management & Lease Generation',
  description: 'Simplify property management and lease generation with Aaralink. The complete solution for landlords and property managers in Ontario.',
  keywords: 'property management, lease generation, landlord software, tenant management, Ontario rental',
  authors: [{ name: 'Aaralink' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${josefinSans.variable} font-josefin antialiased`}>{children}</body>
    </html>
  )
}
