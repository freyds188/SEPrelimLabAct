"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getTranslations, type Locale } from '@/lib/i18n'
import Image from 'next/image'
import { BookOpen, Sparkles, Palette, Users, Award, Target } from 'lucide-react'
import { useState } from 'react'
import { GlossaryModal } from '@/components/glossary/glossary-modal'

interface LocaleGlossaryPageProps {
  params: {
    locale: Locale
  }
}

export default function LocaleGlossaryPage({ params }: LocaleGlossaryPageProps) {
  const t = getTranslations(params.locale)
  const [selected, setSelected] = useState<any | null>(null)
  const [open, setOpen] = useState(false)

  const glossaryTerms = [
    {
      term: params.locale === 'fil' ? 'Backstrap Loom' : 'Backstrap Loom',
      definition: params.locale === 'fil' 
        ? 'Isang portable na loom na nakatali sa baywang ng manghahabi at sa isang poste sa harap; kinokontrol ang tensyon sa pamamagitan ng katawan.'
        : 'A portable loom strapped to the weaver\'s waist and anchored in front; warp tension is controlled by body movement.',
      longDescription: params.locale === 'fil'
        ? 'Isang simpleng loom na nakatali sa baywang ng manghahabi at sa isang matibay na punto sa harap (hal., poste o puno). Sa pamamagitan ng pag-uurong at paghila ng katawan, kinokontrol ng manghahabi ang tensyon ng warp, kaya\'t napakadaling mag-ayos ng lapad at sikip ng tela. Dahil magaan at naliligpit, madali itong dalhin at gamitin sa loob o labas ng bahay. Malawak itong ginagamit ng mga pamayanang Katutubo sa Cordillera at iba pang bahagi ng Timog‑Silangang Asya para gumawa ng makikitid na panel na kalaunan ay tinatahi bilang tapis, sablay, bag o kumot. Sa backstrap loom, posible ang maseselang pick‑up pattern, brocade at iba pang tradisyonal na disenyong Cordilleran.'
        : 'A simple, portable loom strapped around the weaver\'s waist and anchored to a fixed point in front. By leaning forward and back the weaver controls warp tension with the body, allowing fine adjustment of width and firmness. Because it is lightweight and collapsible, it can be used indoors or outdoors and carried easily. It has long been used by Indigenous communities in the Cordillera and throughout Southeast Asia to produce narrow panels later sewn into skirts, blankets, bags and sashes. Backstrap looms support intricate pick‑up patterns, brocading and the distinctive motifs of Cordilleran textiles.',
      category: params.locale === 'fil' ? 'Kagamitan' : 'Equipment',
      image: '/images/glossary/backstrap-loom.jpg',
      icon: BookOpen
    },
    {
      term: params.locale === 'fil' ? 'Warp' : 'Warp',
      definition: params.locale === 'fil'
        ? 'Ang mga sinulid na pahaba sa loom na laging nasa tensyon at nagtatakda ng haba at estruktura ng tela.'
        : 'The lengthwise yarns kept under tension on the loom; they set the cloth\'s length and structural framework.',
      longDescription: params.locale === 'fil'
        ? 'Ang hanay ng mga sinulid na nakahanay pahaba sa loom at laging nasa tensyon habang naghahabi. Itinatakda ng warp ang haba ng tela at pundasyon ng estruktura nito—plain weave, twill, o iba pang interlacing. Kapag mas siksik ang warp (ends‑per‑inch), mas matibay at makinis ang tela. Ang paghahanda ng warp—mula sa pagsukat, pag‑ayos ng kulay, hanggang sa pag‑akyat sa loom—ay kritikal upang maging pantay ang disenyo at tensyon sa buong habi.'
        : 'The set of lengthwise yarns held under tension on the loom. Warp establishes the fabric\'s length and structural framework—plain weave, twill, or more complex interlacings. Higher warp density (ends‑per‑inch) generally yields a sturdier, smoother cloth. Careful warping—measuring, color ordering, and beaming onto the loom—is essential for even tension and accurate pattern alignment throughout the weave.',
      category: params.locale === 'fil' ? 'Mga Thread' : 'Threads',
      image: '/images/glossary/warp.jpg',
      icon: Sparkles
    },
    {
      term: params.locale === 'fil' ? 'Weft' : 'Weft',
      definition: params.locale === 'fil'
        ? 'Ang mga sinulid na pahalang na ipinapasok sa shed mula gilid hanggang gilid; nagbibigay ng kulay at desenyo.'
        : 'The crosswise yarns passed through the shed from edge to edge; they contribute color, pattern and hand.',
      longDescription: params.locale === 'fil'
        ? 'Ang weft (o woof) ang mga sinulid na pumapagitna sa warp mula gilid hanggang gilid ng tela. Sa bawat paglikha ng “shed,” ipinapasok ang weft—sa pamamagitan man ng kamay o suklay—upang makipagsalubong sa warp. Dito nagmumula ang kulay, disenyo at texture ng maraming tela: maaaring solid, guhit, may supplementary weft para sa brocade, o tapestry‑style na masinsin ang pagbuo ng larawan. Kinokontrol ng dami at kapal ng weft ang kapal, lambot at lapad ng habi.'
        : 'The weft is the crosswise yarn inserted through the shed from selvedge to selvedge. With each pick it interlaces with the warp, building the cloth. Weft provides much of the fabric\'s color, pattern and hand: it may be solid, striped, use supplementary weft for brocading, or be packed tapestry‑style to form motifs. Weft thickness, spacing and beat influence the cloth\'s weight, drape and finished width.',
      category: params.locale === 'fil' ? 'Mga Thread' : 'Threads',
      image: '/images/glossary/weft.jpg',
      icon: Sparkles
    },
    {
      term: params.locale === 'fil' ? 'Ikat' : 'Ikat',
      definition: params.locale === 'fil'
        ? 'Pamamaraang resist‑dye kung saan ang mga sinulid ay itinatali bago tinain upang bumuo ng pattern.'
        : 'A resist‑dye technique where yarns are bound before dyeing so motifs appear in the yarns themselves.',
      longDescription: params.locale === 'fil'
        ? 'Isang resist‑dye technique kung saan ang mga sinulid ay binabalutan (ikat = “itali”) sa mga piling bahagi bago tinain. Kapag tinanggal ang pagkakabalot, may lilitaw na hindi tinamang bahagi na bumubuo ng disenyo sa mismong sinulid. Maaaring warp ikat, weft ikat, o double ikat—na nangangailangan ng napakatumpak na pagkakatugma ng mga kulay habang naghahabi. Karaniwan ang bahagyang “blurred” na gilid ng mga motif, na siyang katangi‑tanging pirma ng ikat sa Cordillera at sa iba pang rehiyon ng Timog‑Silangang Asya.'
        : 'A resist‑dye method in which yarns are tightly bound in selected segments before dyeing. When the bindings are removed, undyed areas remain, producing motifs pre‑dyed into the yarns themselves. Ikat may be warp‑ikat, weft‑ikat, or double ikat, the latter requiring extremely precise alignment of colored sections during weaving. The softly blurred edges of motifs—created by the dye wicking under the bindings—are a hallmark of ikat across the Cordillera and much of Southeast Asia.',
      category: params.locale === 'fil' ? 'Pamamaraan' : 'Technique',
      image: '/images/glossary/ikat.jpg',
      icon: Palette
    },
    {
      term: params.locale === 'fil' ? 'Ka-in' : 'Ka-in',
      definition: params.locale === 'fil'
        ? 'Isang kinikilalang motif sa Cordillera na may pulang field at heometrikong pattern; kadalasang ginagawa sa supplementary weft.'
        : 'A well‑known Cordilleran motif with a red ground and geometric figures, often made with supplementary weft.',
      longDescription: params.locale === 'fil'
        ? 'Isang kinikilalang motif sa mga tela ng Cordillera na madalas may matingkad na pulang field na sinisingitan ng itim at puting guhit at mga heometrikong hugis. Kadalasang ginagawa sa pamamagitan ng supplementary weft o pick‑up, ang mga hugis ay kumakatawan sa kalikasan, ani, proteksiyon, at pagkakaisa ng pamayanan. Ang Ka‑in ay nakikita sa tapis, sablay at iba pang kasuotan; nagbabago ang eksaktong ayos ng linya depende sa munisipalidad at pangkat etniko.'
        : 'A recognized motif in Cordilleran cloth, typically featuring a vivid red ground punctuated by black‑and‑white striping and geometric figures. Executed through supplementary‑weft brocading or pick‑up techniques, the figures symbolize nature, harvest, protection and community. Ka‑in motifs appear on tapis (wrap skirts), sashes and other garments, with exact arrangements varying by locality and ethnolinguistic group.',
      category: params.locale === 'fil' ? 'Pattern' : 'Pattern',
      image: '/images/glossary/ka-in.jpg',
      icon: Award
    },
    {
      term: params.locale === 'fil' ? 'Am-amma' : 'Am-amma',
      definition: params.locale === 'fil'
        ? 'Isang motif na may kagyat na ugnay sa mga ninuno at ritwal ng komunidad; ginagamit sa espesyal na okasyon.'
        : 'A motif linked to ancestors and communal rites, often worn for special occasions and ceremonies.',
      longDescription: params.locale === 'fil'
        ? 'Isang motif na may malalim na espiritwal na kahulugan sa mga pamayanang Cordilleran. Kadalasang inilalarawan ang mga pigura ng tao, linya ng prusisyon, palad o iba pang tanda na tumutukoy sa mga ninuno (amma/apo) at sa mga ritwal ng komunidad. Ginagamit sa mga pirasong isinusuot sa espesyal na okasyon o seremonya, paalala ng ugnayan sa nakaraan at sa kolektibong identidad.'
        : 'A motif with profound spiritual resonance in Cordilleran weaving. It often renders human figures, processional lines, hand‑like forms or other signs that reference ancestors and communal rites. Such patterns are worn for special occasions and rituals, serving as a visual reminder of lineage, shared memory and cultural identity.',
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
                  setSelected(item)
                  setOpen(true)
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

        {/* Modal */}
        <GlossaryModal open={open} item={selected} onClose={() => setOpen(false)} />

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
