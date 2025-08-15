"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getTranslations, type Locale } from '@/lib/i18n'

interface LocaleStoriesPageProps {
  params: {
    locale: Locale
  }
}

export default function LocaleStoriesPage({ params }: LocaleStoriesPageProps) {
  const t = getTranslations(params.locale)

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            {params.locale === 'fil' ? 'Mga Kwento ng Artisan' : 'Artisan Stories'}
          </Badge>
          <h1 className="h1 text-balance mb-4">
            {params.locale === 'fil' ? 'Mga Kwento ng Aming Mga Manghahabi' : 'Stories of Our Weavers'}
          </h1>
          <p className="body text-balance max-w-2xl mx-auto">
            {params.locale === 'fil'
              ? 'Kilalanin ang mga tao sa likod ng aming magagandang kamay na ginawang tela at kanilang mga kwento ng tradisyon at kultura.'
              : 'Meet the people behind our beautiful handwoven textiles and their stories of tradition and culture.'
            }
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item} variant="content" className="overflow-hidden">
              <div className="h-48 bg-neutral-100 flex items-center justify-center">
                <span className="text-neutral-500">
                  {params.locale === 'fil' ? 'Larawan ng Artisan' : 'Artisan Photo'}
                </span>
              </div>
              <CardHeader>
                <CardTitle className="h4">
                  {params.locale === 'fil' ? `Maria Santos ${item}` : `Maria Santos ${item}`}
                </CardTitle>
                <CardDescription className="body-sm">
                  {params.locale === 'fil'
                    ? 'Manghahabi mula sa Mindanao, 25 taon ng karanasan'
                    : 'Weaver from Mindanao, 25 years of experience'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="body-sm text-muted-foreground">
                  {params.locale === 'fil'
                    ? 'Si Maria ay nag-aaral ng paghahabi mula sa kanyang lola noong siya ay 8 taong gulang. Ngayon, siya ay nagtuturo din sa mga kabataan sa kanilang komunidad.'
                    : 'Maria learned weaving from her grandmother when she was 8 years old. Today, she also teaches young people in their community.'
                  }
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon Message */}
        <div className="text-center mt-16">
          <h2 className="h2 text-balance mb-4">
            {params.locale === 'fil' ? 'Higit Pang Mga Kwento' : 'More Stories Coming'}
          </h2>
          <p className="body text-balance max-w-2xl mx-auto">
            {params.locale === 'fil'
              ? 'Patuloy naming idadagdag ang mga kwento ng aming mga artisan. Bumalik para sa mga bagong kwento!'
              : 'We continue to add stories of our artisans. Come back for new stories!'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
