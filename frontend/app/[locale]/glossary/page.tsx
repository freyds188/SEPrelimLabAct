"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getTranslations, type Locale } from '@/lib/i18n'
import Image from 'next/image'
import { BookOpen, Sparkles, Palette, Users, Award, Target } from 'lucide-react'

interface LocaleGlossaryPageProps {
  params: {
    locale: Locale
  }
}

export default function LocaleGlossaryPage({ params }: LocaleGlossaryPageProps) {
  const t = getTranslations(params.locale)

  const glossaryTerms = [
    {
      term: params.locale === 'fil' ? 'Backstrap Loom' : 'Backstrap Loom',
      definition: params.locale === 'fil' 
        ? 'Ang tradisyonal na loom na ginagamit sa Cordillera na nakatali sa likod ng manghahabi. Ito ay portable at madaling gamitin sa bahay.'
        : 'The traditional loom used in Cordillera that is tied to the weaver\'s back. It is portable and easy to use at home.',
      category: params.locale === 'fil' ? 'Kagamitan' : 'Equipment',
      image: '/images/glossary/backstrap-loom.jpg',
      icon: BookOpen
    },
    {
      term: params.locale === 'fil' ? 'Warp' : 'Warp',
      definition: params.locale === 'fil'
        ? 'Ang mga vertical na thread na nakatali sa loom. Sila ang base ng tela at nagbibigay ng haba sa tapos na produkto.'
        : 'The vertical threads attached to the loom. They form the foundation of the fabric and determine the length of the finished product.',
      category: params.locale === 'fil' ? 'Mga Thread' : 'Threads',
      image: '/images/glossary/warp.jpg',
      icon: Sparkles
    },
    {
      term: params.locale === 'fil' ? 'Weft' : 'Weft',
      definition: params.locale === 'fil'
        ? 'Ang mga horizontal na thread na ginagamit sa paghahabi. Sila ang nagdadagdag ng pattern, texture, at lapad sa tela.'
        : 'The horizontal threads used in weaving. They add pattern, texture, and width to the fabric.',
      category: params.locale === 'fil' ? 'Mga Thread' : 'Threads',
      image: '/images/glossary/weft.jpg',
      icon: Sparkles
    },
    {
      term: params.locale === 'fil' ? 'Ikat' : 'Ikat',
      definition: params.locale === 'fil'
        ? 'Ang tradisyonal na pamamaraan ng paghahabi kung saan ang mga thread ay binabakuran bago habihin para makagawa ng pattern.'
        : 'The traditional weaving technique where threads are tied and dyed before weaving to create patterns.',
      category: params.locale === 'fil' ? 'Pamamaraan' : 'Technique',
      image: '/images/glossary/ikat.jpg',
      icon: Palette
    },
    {
      term: params.locale === 'fil' ? 'Ka-in' : 'Ka-in',
      definition: params.locale === 'fil'
        ? 'Ang tradisyonal na pattern sa Cordillera weaving na naglalarawan ng mga geometric na disenyo at simbolo ng kalikasan.'
        : 'The traditional pattern in Cordillera weaving that depicts geometric designs and symbols of nature.',
      category: params.locale === 'fil' ? 'Pattern' : 'Pattern',
      image: '/images/glossary/ka-in.jpg',
      icon: Award
    },
    {
      term: params.locale === 'fil' ? 'Am-amma' : 'Am-amma',
      definition: params.locale === 'fil'
        ? 'Ang sacred na pattern sa Cordillera weaving na kumakatawan sa mga ninuno at spiritual na kahulugan ng komunidad.'
        : 'The sacred pattern in Cordillera weaving that represents ancestors and the spiritual meaning of the community.',
      category: params.locale === 'fil' ? 'Pattern' : 'Pattern',
      image: '/images/glossary/am-amma.jpg',
      icon: Target
    }
  ]

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
            {params.locale === 'fil' ? 'Glosaryo ng Paghahabi' : 'Weaving Glossary'}
          </Badge>
          <h1 className="h1 text-balance mb-6 bg-gradient-to-r from-brand-600 to-blue-600 bg-clip-text text-transparent">
            {params.locale === 'fil' ? 'Mga Termino sa Paghahabi' : 'Weaving Terms'}
          </h1>
          <p className="body text-balance max-w-3xl mx-auto text-lg text-neutral-700">
            {params.locale === 'fil'
              ? 'Alamin ang mga pangunahing termino at konsepto sa tradisyonal na paghahabi sa Pilipinas.'
              : 'Learn the key terms and concepts in traditional Filipino weaving.'
            }
          </p>
        </div>

        {/* Glossary Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {glossaryTerms.map((item, index) => {
            const IconComponent = item.icon
            return (
              <div 
                key={index} 
                className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                onClick={() => {
                  // TODO: Navigate to detailed view or open modal
                  console.log(`Clicked on: ${item.term}`)
                }}
              >
                <Card variant="content" className="h-full overflow-hidden border-2 hover:border-brand-200 transition-all duration-300">
                  {/* Image Section */}
                  <div className="w-full h-48 relative overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.term}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="h-5 w-5 text-brand-600" />
                        </div>
                        <CardTitle className="h4 text-brand-800">{item.term}</CardTitle>
                      </div>
                      <Badge variant="outline" className="text-xs border-brand-200 text-brand-700">
                        {item.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="body-sm text-muted-foreground mb-4 leading-relaxed">
                      {item.definition}
                    </p>
                    <div className="flex items-center text-xs text-brand-600 font-medium group-hover:text-brand-700 transition-colors duration-300">
                      Click to learn more 
                      <span className="ml-1 group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

        {/* Coming Soon Message */}
        <div className="text-center bg-white rounded-2xl p-12 border border-neutral-200 shadow-lg">
          <div className="w-24 h-24 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-12 w-12 text-brand-600" />
          </div>
          <h2 className="h2 text-balance mb-6 text-brand-800">
            {params.locale === 'fil' ? 'Higit Pang Mga Termino' : 'More Terms Coming'}
          </h2>
          <p className="body text-balance max-w-2xl mx-auto text-lg text-neutral-700">
            {params.locale === 'fil'
              ? 'Patuloy naming idadagdag ang mga termino sa aming glosaryo. Bumalik para sa mga bagong termino!'
              : 'We continue to add terms to our glossary. Come back for new terms!'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
