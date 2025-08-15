"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getTranslations, type Locale } from '@/lib/i18n'

interface LocaleWeaversPageProps {
  params: {
    locale: Locale
  }
}

export default function LocaleWeaversPage({ params }: LocaleWeaversPageProps) {
  const t = getTranslations(params.locale)

  const weavers = [
    {
      name: params.locale === 'fil' ? 'Maria Santos' : 'Maria Santos',
      location: params.locale === 'fil' ? 'Mindanao' : 'Mindanao',
      experience: params.locale === 'fil' ? '25 taon' : '25 years',
      specialty: params.locale === 'fil' ? 'T\'nalak' : 'T\'nalak',
      story: params.locale === 'fil'
        ? 'Si Maria ay nag-aaral ng paghahabi mula sa kanyang lola noong siya ay 8 taong gulang. Siya ay dalubhasa sa tradisyonal na T\'nalak weaving ng T\'boli tribe.'
        : 'Maria learned weaving from her grandmother when she was 8 years old. She specializes in traditional T\'nalak weaving of the T\'boli tribe.'
    },
    {
      name: params.locale === 'fil' ? 'Juanita Reyes' : 'Juanita Reyes',
      location: params.locale === 'fil' ? 'Luzon' : 'Luzon',
      experience: params.locale === 'fil' ? '30 taon' : '30 years',
      specialty: params.locale === 'fil' ? 'Inabel' : 'Inabel',
      story: params.locale === 'fil'
        ? 'Si Juanita ay isang master weaver ng Inabel, ang tradisyonal na tela ng Ilocos. Siya ay nagtuturo din sa mga kabataan sa kanilang komunidad.'
        : 'Juanita is a master weaver of Inabel, the traditional fabric of Ilocos. She also teaches young people in their community.'
    },
    {
      name: params.locale === 'fil' ? 'Luzviminda Cruz' : 'Luzviminda Cruz',
      location: params.locale === 'fil' ? 'Visayas' : 'Visayas',
      experience: params.locale === 'fil' ? '20 taon' : '20 years',
      specialty: params.locale === 'fil' ? 'Hablon' : 'Hablon',
      story: params.locale === 'fil'
        ? 'Si Luzviminda ay dalubhasa sa Hablon weaving ng Iloilo. Siya ay kilala sa kanyang mga makukulay na pattern at disenyo.'
        : 'Luzviminda specializes in Hablon weaving from Iloilo. She is known for her colorful patterns and designs.'
    },
    {
      name: params.locale === 'fil' ? 'Carmen Garcia' : 'Carmen Garcia',
      location: params.locale === 'fil' ? 'Palawan' : 'Palawan',
      experience: params.locale === 'fil' ? '15 taon' : '15 years',
      specialty: params.locale === 'fil' ? 'Pis Syabit' : 'Pis Syabit',
      story: params.locale === 'fil'
        ? 'Si Carmen ay isang Tausug weaver na dalubhasa sa Pis Syabit, ang tradisyonal na headscarf ng Sulu.'
        : 'Carmen is a Tausug weaver who specializes in Pis Syabit, the traditional headscarf of Sulu.'
    },
    {
      name: params.locale === 'fil' ? 'Elena Torres' : 'Elena Torres',
      location: params.locale === 'fil' ? 'Cordillera' : 'Cordillera',
      experience: params.locale === 'fil' ? '35 taon' : '35 years',
      specialty: params.locale === 'fil' ? 'Kalinga Textiles' : 'Kalinga Textiles',
      story: params.locale === 'fil'
        ? 'Si Elena ay isang Kalinga weaver na nagpapanatili ng mga sinaunang pattern at disenyo ng kanyang tribo.'
        : 'Elena is a Kalinga weaver who preserves the ancient patterns and designs of her tribe.'
    },
    {
      name: params.locale === 'fil' ? 'Rosa Mendoza' : 'Rosa Mendoza',
      location: params.locale === 'fil' ? 'Bicol' : 'Bicol',
      experience: params.locale === 'fil' ? '22 taon' : '22 years',
      specialty: params.locale === 'fil' ? 'Sinamay' : 'Sinamay',
      story: params.locale === 'fil'
        ? 'Si Rosa ay dalubhasa sa Sinamay weaving gamit ang abaca fiber. Siya ay kilala sa kanyang mga masinsin na pattern.'
        : 'Rosa specializes in Sinamay weaving using abaca fiber. She is known for her intricate patterns.'
    }
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            {params.locale === 'fil' ? 'Mga Manghahabi' : 'Our Weavers'}
          </Badge>
          <h1 className="h1 text-balance mb-4">
            {params.locale === 'fil' ? 'Kilalanin ang Aming Mga Manghahabi' : 'Meet Our Weavers'}
          </h1>
          <p className="body text-balance max-w-2xl mx-auto">
            {params.locale === 'fil'
              ? 'Kilalanin ang mga talentadong artisan sa likod ng aming magagandang kamay na ginawang tela at kanilang mga kwento ng tradisyon at kultura.'
              : 'Meet the talented artisans behind our beautiful handwoven textiles and their stories of tradition and culture.'
            }
          </p>
        </div>

        {/* Weavers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {weavers.map((weaver, index) => (
            <Card key={index} variant="content" className="overflow-hidden">
              <div className="h-48 bg-neutral-100 flex items-center justify-center">
                <span className="text-neutral-500">
                  {params.locale === 'fil' ? 'Larawan ng Manghahabi' : 'Weaver Photo'}
                </span>
              </div>
              <CardHeader>
                <CardTitle className="h4">{weaver.name}</CardTitle>
                <CardDescription className="body-sm">
                  {weaver.location} • {weaver.experience}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Badge variant="outline" className="mb-2">
                    {weaver.specialty}
                  </Badge>
                </div>
                <p className="body-sm text-muted-foreground">
                  {weaver.story}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon Message */}
        <div className="text-center mt-16">
          <h2 className="h2 text-balance mb-4">
            {params.locale === 'fil' ? 'Higit Pang Mga Manghahabi' : 'More Weavers Coming'}
          </h2>
          <p className="body text-balance max-w-2xl mx-auto">
            {params.locale === 'fil'
              ? 'Patuloy naming idadagdag ang mga kwento ng aming mga manghahabi. Bumalik para sa mga bagong profile!'
              : 'We continue to add stories of our weavers. Come back for new profiles!'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
