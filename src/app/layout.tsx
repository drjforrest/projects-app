import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ProjectProvider } from '@/context/ProjectContext'
import Link from 'next/link'

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
        <ProjectProvider>
          <nav className="bg-navy-900 shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex space-x-4">
                  <Link href="/" className="flex items-center px-3 py-2 text-sage-300 hover:text-gold-400 transition-all duration-200 hover:-translate-y-0.5">
                    Home
                  </Link>
                  <Link href="/start-project" className="flex items-center px-3 py-2 text-sage-300 hover:text-gold-400 transition-all duration-200 hover:-translate-y-0.5">
                    Start Project
                  </Link>
                  <Link href="/projects" className="flex items-center px-3 py-2 text-sage-300 hover:text-gold-400 transition-all duration-200 hover:-translate-y-0.5">
                    Projects Dashboard
                  </Link>
                  <Link href="/outputs" className="flex items-center px-3 py-2 text-sage-300 hover:text-gold-400 transition-all duration-200 hover:-translate-y-0.5">
                    Project Outputs
                  </Link>
                  <Link href="/meetings" className="flex items-center px-3 py-2 text-sage-300 hover:text-gold-400 transition-all duration-200 hover:-translate-y-0.5">
                    Meetings
                  </Link>
                  <Link href="/close-project" className="flex items-center px-3 py-2 text-sage-300 hover:text-gold-400 transition-all duration-200 hover:-translate-y-0.5">
                    Close Project
                  </Link>
                </div>
                <div className="flex items-center">
                  <Link href="/settings" className="flex items-center px-3 py-2 text-sage-300 hover:text-gold-400 transition-all duration-200 hover:-translate-y-0.5">
                    Settings
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
            {children}
          </main>
        </ProjectProvider>
      </body>
    </html>
  )
}
