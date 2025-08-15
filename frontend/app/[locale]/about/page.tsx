"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getTranslations, type Locale } from '@/lib/i18n'

interface LocaleAboutPageProps {
  params: {
    locale: Locale
  }
}

export default function LocaleAboutPage({ params }: LocaleAboutPageProps) {
  const t = getTranslations(params.locale)

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            {params.locale === 'fil' ? 'Tungkol sa Amin' : 'About Us'}
          </Badge>
          <h1 className="h1 text-balance mb-4">
            {params.locale === 'fil' ? 'Ang Aming Kwento' : 'Our Story'}
          </h1>
          <p className="body text-balance max-w-2xl mx-auto">
            {params.locale === 'fil'
              ? 'Alamin ang tungkol sa aming misyon na mapanatili ang tradisyonal na paghahabi sa Pilipinas at suportahan ang aming mga artisan.'
              : 'Learn about our mission to preserve traditional Filipino weaving and support our artisans.'
            }
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="h2 text-balance mb-6">
              {params.locale === 'fil' ? 'Ang Aming Misyon' : 'Our Mission'}
            </h2>
            <p className="body text-balance mb-4">
              {params.locale === 'fil'
                ? 'Kami ay nakatuon sa pangangalaga ng mga tradisyon sa paghahabi sa Pilipinas habang nagbibigay ng patas na kabayaran sa mga artisan at nagtataguyod ng pamanang kultural.'
                : 'We are dedicated to preserving Filipino weaving traditions while providing fair compensation to artisans and promoting cultural heritage.'
              }
            </p>
            <p className="body text-balance">
              {params.locale === 'fil'
                ? 'Sa pamamagitan ng aming platform, nais naming ikonekta ang mga artisan sa mga customer na nagbibigay-halaga sa tradisyonal na craftsmanship at kultura.'
                : 'Through our platform, we want to connect artisans with customers who value traditional craftsmanship and culture.'
              }
            </p>
          </div>
          <div className="bg-neutral-100 rounded-lg flex items-center justify-center h-64">
            <span className="text-neutral-500">
              {params.locale === 'fil' ? 'Larawan ng Misyon' : 'Mission Image'}
            </span>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="h2 text-center text-balance mb-12">
            {params.locale === 'fil' ? 'Ang Aming Mga Halaga' : 'Our Values'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="content">
              <CardHeader>
                <CardTitle className="h3">
                  {params.locale === 'fil' ? 'Pangangalaga ng Kultura' : 'Cultural Preservation'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="body-sm text-muted-foreground">
                  {params.locale === 'fil'
                    ? 'Nakikipagtulungan kami sa mga komunidad upang mapanatili ang tradisyonal na pamamaraan ng paghahabi at mga pattern na ipinasa sa mga henerasyon.'
                    : 'We work with communities to preserve traditional weaving techniques and patterns passed down through generations.'
                  }
                </p>
              </CardContent>
            </Card>

            <Card variant="content">
              <CardHeader>
                <CardTitle className="h3">
                  {params.locale === 'fil' ? 'Patas na Kalakalan' : 'Fair Trade'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="body-sm text-muted-foreground">
                  {params.locale === 'fil'
                    ? 'Bawat pagbili ay direktang sumusuporta sa mga artisan at kanilang pamilya, tinitiyak ang patas na sahod at napapanatiling kabuhayan.'
                    : 'Every purchase directly supports artisans and their families, ensuring fair wages and sustainable livelihoods.'
                  }
                </p>
              </CardContent>
            </Card>

            <Card variant="content">
              <CardHeader>
                <CardTitle className="h3">
                  {params.locale === 'fil' ? 'Kalidad at Craftsmanship' : 'Quality & Craftsmanship'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="body-sm text-muted-foreground">
                  {params.locale === 'fil'
                    ? 'Nakikipagtulungan kami lamang sa mga artisan na gumagamit ng tradisyonal na pamamaraan at mataas na kalidad na materyales.'
                    : 'We only work with artisans who use traditional techniques and high-quality materials.'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Impact Section */}
        <div className="bg-neutral-50 rounded-lg p-8 text-center">
          <h2 className="h2 text-balance mb-8">
            {params.locale === 'fil' ? 'Ang Aming Epekto' : 'Our Impact'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="h3 text-brand-600">50+</h3>
              <p className="body-sm">
                {params.locale === 'fil' ? 'Mga Artisan' : 'Artisans'}
              </p>
            </div>
            <div>
              <h3 className="h3 text-brand-600">15</h3>
              <p className="body-sm">
                {params.locale === 'fil' ? 'Mga Komunidad' : 'Communities'}
              </p>
            </div>
            <div>
              <h3 className="h3 text-brand-600">₱500K+</h3>
              <p className="body-sm">
                {params.locale === 'fil' ? 'Kabuuang Kita' : 'Total Income'}
              </p>
            </div>
            <div>
              <h3 className="h3 text-brand-600">1000+</h3>
              <p className="body-sm">
                {params.locale === 'fil' ? 'Mga Produkto' : 'Products'}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-16">
          <h2 className="h2 text-balance mb-4">
            {params.locale === 'fil' ? 'Makipag-ugnayan sa Amin' : 'Get in Touch'}
          </h2>
          <p className="body text-balance max-w-2xl mx-auto mb-8">
            {params.locale === 'fil'
              ? 'May mga katanungan tungkol sa aming mga produkto o nais na maging partner? Makipag-ugnayan sa amin!'
              : 'Have questions about our products or want to become a partner? Get in touch with us!'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Badge variant="outline" className="px-4 py-2">
              {params.locale === 'fil' ? 'Email: info@weavers.ph' : 'Email: info@weavers.ph'}
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              {params.locale === 'fil' ? 'Phone: +63 912 345 6789' : 'Phone: +63 912 345 6789'}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
