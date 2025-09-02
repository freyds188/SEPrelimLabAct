"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getTranslations, type Locale } from '@/lib/i18n'
import { Heart, Users, Award, Target } from 'lucide-react'

interface LocaleDonatePageProps {
  params: {
    locale: Locale
  }
}

export default function LocaleDonatePage({ params }: LocaleDonatePageProps) {
  const t = getTranslations(params.locale)

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-white via-orange-50/30 to-amber-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
            {params.locale === 'fil' ? 'Suportahan ang Komunidad' : 'Support the Community'}
          </Badge>
          <h1 className="h1 text-balance mb-6 bg-gradient-to-r from-brand-600 to-orange-600 bg-clip-text text-transparent">
            {params.locale === 'fil' ? 'Magbigay para sa Aming Mga Artisan' : 'Donate to Our Artisans'}
          </h1>
          <p className="body text-balance max-w-3xl mx-auto text-lg text-neutral-700">
            {params.locale === 'fil'
              ? 'Tulungan ang aming mga artisan na mapanatili ang kanilang tradisyonal na pamamaraan ng paghahabi at suportahan ang kanilang mga pamilya.'
              : 'Help our artisans preserve their traditional weaving techniques and support their families.'
            }
          </p>
        </div>

        {/* Donation Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card variant="content" className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-brand-200">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-8 w-8 text-brand-600" />
              </div>
              <CardTitle className="h2 text-brand-600">
                {params.locale === 'fil' ? '₱500' : '$10'}
              </CardTitle>
              <CardDescription className="body-lg font-medium">
                {params.locale === 'fil' ? 'Mga Materyales sa Paghahabi' : 'Weaving Materials'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="body-sm text-muted-foreground mb-6">
                {params.locale === 'fil'
                  ? 'Tulungan ang isang artisan na makabili ng mga materyales para sa kanilang susunod na proyekto.'
                  : 'Help an artisan purchase materials for their next project.'
                }
              </p>
              <Button className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white shadow-lg" disabled>
                {params.locale === 'fil' ? 'Magbigay Ngayon' : 'Donate Now'}
              </Button>
            </CardContent>
          </Card>

          <Card variant="content" className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-orange-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-br from-orange-400 to-orange-600 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
              {params.locale === 'fil' ? 'Pinakapopular' : 'Most Popular'}
            </div>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="h2 text-orange-600">
                {params.locale === 'fil' ? '₱1,500' : '$30'}
              </CardTitle>
              <CardDescription className="body-lg font-medium">
                {params.locale === 'fil' ? 'Pagsasanay sa Paghahabi' : 'Weaving Training'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="body-sm text-muted-foreground mb-6">
                {params.locale === 'fil'
                  ? 'Suportahan ang pagsasanay ng mga bagong manghahabi sa tradisyonal na pamamaraan.'
                  : 'Support training for new weavers in traditional techniques.'
                }
              </p>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg" disabled>
                {params.locale === 'fil' ? 'Magbigay Ngayon' : 'Donate Now'}
              </Button>
            </CardContent>
          </Card>

          <Card variant="content" className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-amber-200">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="h-8 w-8 text-amber-600" />
              </div>
              <CardTitle className="h2 text-amber-600">
                {params.locale === 'fil' ? '₱5,000' : '$100'}
              </CardTitle>
              <CardDescription className="body-lg font-medium">
                {params.locale === 'fil' ? 'Loom at Kagamitan' : 'Loom & Equipment'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="body-sm text-muted-foreground mb-6">
                {params.locale === 'fil'
                  ? 'Tulungan ang isang artisan na makabili ng sariling loom at kagamitan.'
                  : 'Help an artisan purchase their own loom and equipment.'
                }
              </p>
              <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg" disabled>
                {params.locale === 'fil' ? 'Magbigay Ngayon' : 'Donate Now'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Impact Section */}
        <div className="bg-gradient-to-br from-brand-50 to-orange-50 rounded-2xl p-12 text-center border border-brand-100 shadow-lg mb-16">
          <h2 className="h2 text-balance mb-8 text-brand-800">
            {params.locale === 'fil' ? 'Ang Aming Epekto' : 'Our Impact'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="group">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-10 w-10 text-brand-600" />
              </div>
              <h3 className="h1 text-brand-600 mb-2">50+</h3>
              <p className="body-lg font-medium text-brand-800">
                {params.locale === 'fil' ? 'Mga Artisan na Sinusuportahan' : 'Artisans Supported'}
              </p>
            </div>
            <div className="group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="h1 text-orange-600 mb-2">₱500K+</h3>
              <p className="body-lg font-medium text-orange-800">
                {params.locale === 'fil' ? 'Kabuuang Kita ng Artisan' : 'Total Artisan Income'}
              </p>
            </div>
            <div className="group">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="h1 text-amber-600 mb-2">15</h3>
              <p className="body-lg font-medium text-amber-800">
                {params.locale === 'fil' ? 'Mga Komunidad na Naabot' : 'Communities Reached'}
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="text-center bg-white rounded-2xl p-12 border border-neutral-200 shadow-lg">
          <div className="w-24 h-24 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-12 w-12 text-brand-600" />
          </div>
          <h2 className="h2 text-balance mb-6 text-brand-800">
            {params.locale === 'fil' ? 'Malapit na Magbubukas' : 'Coming Soon'}
          </h2>
          <p className="body text-balance max-w-2xl mx-auto text-lg text-neutral-700">
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
