"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getTranslations, type Locale } from '@/lib/i18n'

interface LocaleGlossaryPageProps {
  params: {
    locale: Locale
  }
}

export default function LocaleGlossaryPage({ params }: LocaleGlossaryPageProps) {
  const t = getTranslations(params.locale)

  const glossaryTerms = [
    {
      term: params.locale === 'fil' ? 'Loom' : 'Loom',
      definition: params.locale === 'fil' 
        ? 'Ang kagamitan na ginagamit sa paghahabi ng tela. Ito ay ang frame kung saan inaayos ang mga thread.'
        : 'The equipment used for weaving fabric. It is the frame on which threads are arranged.',
      category: params.locale === 'fil' ? 'Kagamitan' : 'Equipment'
    },
    {
      term: params.locale === 'fil' ? 'Warp' : 'Warp',
      definition: params.locale === 'fil'
        ? 'Ang mga vertical na thread na nakatali sa loom. Sila ang base ng tela.'
        : 'The vertical threads attached to the loom. They form the foundation of the fabric.',
      category: params.locale === 'fil' ? 'Mga Thread' : 'Threads'
    },
    {
      term: params.locale === 'fil' ? 'Weft' : 'Weft',
      definition: params.locale === 'fil'
        ? 'Ang mga horizontal na thread na ginagamit sa paghahabi. Sila ang nagdadagdag ng pattern at texture.'
        : 'The horizontal threads used in weaving. They add pattern and texture to the fabric.',
      category: params.locale === 'fil' ? 'Mga Thread' : 'Threads'
    },
    {
      term: params.locale === 'fil' ? 'Pattern' : 'Pattern',
      definition: params.locale === 'fil'
        ? 'Ang disenyo o motif na ginagawa sa tela sa pamamagitan ng paghahabi.'
        : 'The design or motif created in the fabric through weaving.',
      category: params.locale === 'fil' ? 'Disenyo' : 'Design'
    },
    {
      term: params.locale === 'fil' ? 'Twill' : 'Twill',
      definition: params.locale === 'fil'
        ? 'Isang uri ng paghahabi na gumagawa ng diagonal na pattern sa tela.'
        : 'A type of weaving that creates a diagonal pattern in the fabric.',
      category: params.locale === 'fil' ? 'Uri ng Paghahabi' : 'Weaving Type'
    },
    {
      term: params.locale === 'fil' ? 'Plain Weave' : 'Plain Weave',
      definition: params.locale === 'fil'
        ? 'Ang pinakasimpleng uri ng paghahabi kung saan ang warp at weft ay nagkakrus nang regular.'
        : 'The simplest type of weaving where warp and weft cross regularly.',
      category: params.locale === 'fil' ? 'Uri ng Paghahabi' : 'Weaving Type'
    }
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            {params.locale === 'fil' ? 'Glosaryo ng Paghahabi' : 'Weaving Glossary'}
          </Badge>
          <h1 className="h1 text-balance mb-4">
            {params.locale === 'fil' ? 'Mga Termino sa Paghahabi' : 'Weaving Terms'}
          </h1>
          <p className="body text-balance max-w-2xl mx-auto">
            {params.locale === 'fil'
              ? 'Alamin ang mga pangunahing termino at konsepto sa tradisyonal na paghahabi sa Pilipinas.'
              : 'Learn the key terms and concepts in traditional Filipino weaving.'
            }
          </p>
        </div>

        {/* Glossary Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {glossaryTerms.map((item, index) => (
            <Card key={index} variant="content">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="h4">{item.term}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="body-sm text-muted-foreground">
                  {item.definition}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon Message */}
        <div className="text-center mt-16">
          <h2 className="h2 text-balance mb-4">
            {params.locale === 'fil' ? 'Higit Pang Mga Termino' : 'More Terms Coming'}
          </h2>
          <p className="body text-balance max-w-2xl mx-auto">
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
