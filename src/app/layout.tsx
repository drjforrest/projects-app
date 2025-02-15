import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ProjectProvider } from '@/context/ProjectContext'
import { SettingsProvider } from '@/context/SettingsContext'
import { DesktopNav } from '@/components/common/DesktopNav'
import { MobileNav } from '@/components/common/MobileNav'
import { Breadcrumb } from '@/components/common/Breadcrumb'
import { ProjectMenu } from '@/components/common/ProjectMenu'
import { QuickActions } from '@/components/common/QuickActions'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Projects App',
  description: 'Project management and tracking application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SettingsProvider>
          <ProjectProvider>
            <div className="min-h-screen bg-gray-50">
              <nav className="bg-navy-900 shadow-lg">
                <DesktopNav />
                <MobileNav />
              </nav>
              <main className="max-w-7xl mx-auto px-4 py-6">
                <Breadcrumb />
                <ProjectMenu />
                {children}
              </main>
              <QuickActions />
            </div>
          </ProjectProvider>
        </SettingsProvider>
      </body>
    </html>
  )
}
