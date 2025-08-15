"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getTranslations, type Locale } from '@/lib/i18n'

interface LocaleShopPageProps {
  params: {
    locale: Locale
  }
}

export default function LocaleShopPage({ params }: LocaleShopPageProps) {
  const t = getTranslations(params.locale)

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            {params.locale === 'fil' ? 'Kamay na Ginawang Tela' : 'Handcrafted Textiles'}
          </Badge>
          <h1 className="h1 text-balance mb-4">
            {params.locale === 'fil' ? 'Tindahan ng Kamay na Ginawang Tela' : 'Handwoven Textiles Shop'}
          </h1>
          <p className="body text-balance max-w-2xl mx-auto">
            {params.locale === 'fil' 
              ? 'Tuklasin ang aming koleksyon ng magagandang kamay na ginawang tela mula sa mga dalubhasang Filipino artisan.'
              : 'Explore our collection of beautiful handwoven textiles from skilled Filipino artisans.'
            }
          </p>
        </div>

        {/* Placeholder Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item} variant="product" className="overflow-hidden">
              <div className="h-48 bg-neutral-100 flex items-center justify-center">
                <span className="text-neutral-500">
                  {params.locale === 'fil' ? 'Larawan ng Produkto' : 'Product Image'}
                </span>
              </div>
              <CardHeader>
                <CardTitle className="h4">
                  {params.locale === 'fil' ? `Kamay na Ginawang Tela ${item}` : `Handwoven Textile ${item}`}
                </CardTitle>
                <CardDescription className="body-sm">
                  {params.locale === 'fil'
                    ? 'Magandang kamay na ginawang piraso mula sa aming komunidad ng artisan'
                    : 'Beautiful handcrafted piece from our artisan community'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="h4 text-brand-600">
                    {params.locale === 'fil' ? '₱5,499' : '$99.99'}
                  </span>
                  <Badge variant="outline">
                    {params.locale === 'fil' ? 'Malapit na' : 'Coming Soon'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon Message */}
        <div className="text-center mt-16">
          <h2 className="h2 text-balance mb-4">
            {params.locale === 'fil' ? 'Malapit na Magbubukas' : 'Coming Soon'}
          </h2>
          <p className="body text-balance max-w-2xl mx-auto">
            {params.locale === 'fil'
              ? 'Ang aming online na tindahan ay malapit na magbubukas. Mag-sign up para sa mga update!'
              : 'Our online store is coming soon. Sign up for updates!'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
