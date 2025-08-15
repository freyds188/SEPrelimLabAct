import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { getTranslations, type Locale } from '@/lib/i18n'

const inter = Inter({ subsets: ['latin'] })

interface LocaleLayoutProps {
  children: React.ReactNode
  params: {
    locale: Locale
  }
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const t = getTranslations(params.locale)
  
  return {
    title: t.seo.home.title,
    description: t.seo.home.description,
  }
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  return (
    <html lang={params.locale}>
      <body className={inter.className}>
        {/* Skip to content link for keyboard users */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
