"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getTranslations, type Locale } from '@/lib/i18n'

interface LocaleDonatePageProps {
  params: {
    locale: Locale
  }
}

export default function LocaleDonatePage({ params }: LocaleDonatePageProps) {
  const t = getTranslations(params.locale)

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            {params.locale === 'fil' ? 'Suportahan ang Komunidad' : 'Support the Community'}
          </Badge>
          <h1 className="h1 text-balance mb-4">
            {params.locale === 'fil' ? 'Magbigay para sa Aming Mga Artisan' : 'Donate to Our Artisans'}
          </h1>
          <p className="body text-balance max-w-2xl mx-auto">
            {params.locale === 'fil'
              ? 'Tulungan ang aming mga artisan na mapanatili ang kanilang tradisyonal na pamamaraan ng paghahabi at suportahan ang kanilang mga pamilya.'
              : 'Help our artisans preserve their traditional weaving techniques and support their families.'
            }
          </p>
        </div>

        {/* Donation Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card variant="content">
            <CardHeader>
              <CardTitle className="h3">
                {params.locale === 'fil' ? '₱500' : '$10'}
              </CardTitle>
              <CardDescription className="body-sm">
                {params.locale === 'fil' ? 'Mga Materyales sa Paghahabi' : 'Weaving Materials'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="body-sm text-muted-foreground mb-4">
                {params.locale === 'fil'
                  ? 'Tulungan ang isang artisan na makabili ng mga materyales para sa kanilang susunod na proyekto.'
                  : 'Help an artisan purchase materials for their next project.'
                }
              </p>
              <Button className="w-full" disabled>
                {params.locale === 'fil' ? 'Magbigay Ngayon' : 'Donate Now'}
              </Button>
            </CardContent>
          </Card>

          <Card variant="content">
            <CardHeader>
              <CardTitle className="h3">
                {params.locale === 'fil' ? '₱1,500' : '$30'}
              </CardTitle>
              <CardDescription className="body-sm">
                {params.locale === 'fil' ? 'Pagsasanay sa Paghahabi' : 'Weaving Training'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="body-sm text-muted-foreground mb-4">
                {params.locale === 'fil'
                  ? 'Suportahan ang pagsasanay ng mga bagong manghahabi sa tradisyonal na pamamaraan.'
                  : 'Support training for new weavers in traditional techniques.'
                }
              </p>
              <Button className="w-full" disabled>
                {params.locale === 'fil' ? 'Magbigay Ngayon' : 'Donate Now'}
              </Button>
            </CardContent>
          </Card>

          <Card variant="content">
            <CardHeader>
              <CardTitle className="h3">
                {params.locale === 'fil' ? '₱5,000' : '$100'}
              </CardTitle>
              <CardDescription className="body-sm">
                {params.locale === 'fil' ? 'Loom at Kagamitan' : 'Loom & Equipment'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="body-sm text-muted-foreground mb-4">
                {params.locale === 'fil'
                  ? 'Tulungan ang isang artisan na makabili ng sariling loom at kagamitan.'
                  : 'Help an artisan purchase their own loom and equipment.'
                }
              </p>
              <Button className="w-full" disabled>
                {params.locale === 'fil' ? 'Magbigay Ngayon' : 'Donate Now'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Impact Section */}
        <div className="bg-neutral-50 rounded-lg p-8 text-center">
          <h2 className="h2 text-balance mb-4">
            {params.locale === 'fil' ? 'Ang Aming Epekto' : 'Our Impact'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div>
              <h3 className="h3 text-brand-600">50+</h3>
              <p className="body-sm">
                {params.locale === 'fil' ? 'Mga Artisan na Sinusuportahan' : 'Artisans Supported'}
              </p>
            </div>
            <div>
              <h3 className="h3 text-brand-600">₱500K+</h3>
              <p className="body-sm">
                {params.locale === 'fil' ? 'Kabuuang Kita ng Artisan' : 'Total Artisan Income'}
              </p>
            </div>
            <div>
              <h3 className="h3 text-brand-600">15</h3>
              <p className="body-sm">
                {params.locale === 'fil' ? 'Mga Komunidad na Naabot' : 'Communities Reached'}
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="text-center mt-16">
          <h2 className="h2 text-balance mb-4">
            {params.locale === 'fil' ? 'Malapit na Magbubukas' : 'Coming Soon'}
          </h2>
          <p className="body text-balance max-w-2xl mx-auto">
            {params.locale === 'fil'
              ? 'Ang aming sistema ng donasyon ay malapit na magbubukas. Mag-sign up para sa mga update!'
              : 'Our donation system is coming soon. Sign up for updates!'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
