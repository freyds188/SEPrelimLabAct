"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getTranslations, type Locale } from '@/lib/i18n'
import { 
  Heart, 
  Users, 
  MapPin, 
  DollarSign, 
  Package, 
  Award, 
  Globe, 
  Mail, 
  Phone,
  Sparkles,
  Target,
  Shield,
  TrendingUp
} from 'lucide-react'

interface LocaleAboutPageProps {
  params: {
    locale: Locale
  }
}

export default function LocaleAboutPage({ params }: LocaleAboutPageProps) {
  const t = getTranslations(params.locale)

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <div className="relative bg-gradient-to-br from-brand-50 via-white to-accent-50 py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fef3c7%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* CordiWeave Logo */}
          <div className="mb-8 flex justify-center">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden shadow-2xl border-4 border-white bg-white">
              <img
                src="/images/CordiWeave1.jpg"
                alt="CordiWeave Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-100 to-accent-100 border border-brand-200 rounded-full px-6 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <Badge variant="secondary" className="bg-transparent border-0 text-brand-700 font-medium">
              {params.locale === 'fil' ? 'Tungkol sa Amin' : 'About Us'}
            </Badge>
          </div>
          <h1 className="h1 text-balance mb-6 bg-gradient-to-r from-brand-600 via-brand-700 to-accent-600 bg-clip-text text-transparent">
            {params.locale === 'fil' ? 'Ang Aming Kwento' : 'Our Story'}
          </h1>
          <p className="body text-balance max-w-3xl mx-auto text-neutral-700 leading-relaxed">
            {params.locale === 'fil'
              ? 'Alamin ang tungkol sa aming misyon na mapanatili ang tradisyonal na paghahabi sa Pilipinas at suportahan ang aming mga artisan.'
              : 'Learn about our mission to preserve traditional Filipino weaving and support our artisans.'
            }
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-100 to-accent-100 rounded-lg px-4 py-2 mb-4">
              <Target className="w-5 h-5 text-brand-600" />
              <span className="text-brand-700 font-medium text-sm">
                {params.locale === 'fil' ? 'Ang Aming Misyon' : 'Our Mission'}
              </span>
            </div>
            <h2 className="h2 text-balance text-neutral-800">
              {params.locale === 'fil' ? 'Ang Aming Misyon' : 'Our Mission'}
            </h2>
            <div className="space-y-6 text-neutral-700">
              <p className="body leading-relaxed">
                {params.locale === 'fil'
                  ? 'Sa CordiWeave, kami ay buong puso na nakatuon sa pangangalaga, pagtataguyod, at pagdiriwang ng mayamang tapestry ng mga tradisyon sa paghahabi ng Cordillera na nakaugat na sa kultural na tela ng Pilipinas sa loob ng mga siglo. Ang aming misyon ay higit pa sa simpleng pangangalaga—kami ay nakatuon sa pagdadala ng mga pambihirang tradisyonal na sining sa pandaigdigang entablado, tinitiyak na ang mundo ay makilala at mapahalagahan ang walang katulad na craftsmanship, kultural na kahalagahan, at espirituwal na lalim na nakatanim sa bawat sinulid ng mga tela ng Cordillera.'
                  : 'At CordiWeave, we are passionately committed to preserving, promoting, and celebrating the rich tapestry of Cordillera weaving traditions that have been woven into the cultural fabric of the Philippines for centuries. Our mission extends far beyond mere preservation—we are dedicated to bringing these extraordinary artistic traditions to the global stage, ensuring that the world recognizes and appreciates the unparalleled craftsmanship, cultural significance, and spiritual depth embedded in every thread of Cordillera textiles.'
                }
              </p>
              <p className="body leading-relaxed">
                {params.locale === 'fil'
                  ? 'Sa pamamagitan ng aming komprehensibong platform, kami ay nagsisilbing tulay sa pagitan ng sinaunang karunungan ng mga manghahabi ng Cordillera at pandaigdigang madla na sabik na tuklasin ang tunay na pamanang kultural. Naniniwala kami na bawat piraso ng kamay na ginawang tela ay nagkukuwento—isang kwento ng katatagan, komunidad, espirituwalidad, at ang hindi mababasag na ugnayan sa pagitan ng mga tao at kanilang lupang ninuno. Ang aming misyon ay palakasin ang mga tinig na ito, ibahagi ang mga kwentong ito, at lumikha ng napapanatiling mga oportunidad sa ekonomiya na nagbibigay karangalan sa tradisyonal na kaalaman na ipinasa sa mga henerasyon.'
                  : 'Through our comprehensive platform, we serve as a bridge between the ancient wisdom of Cordillera weavers and a global audience eager to discover authentic cultural heritage. We believe that every piece of handwoven fabric tells a story—a story of resilience, community, spirituality, and the unbreakable bond between people and their ancestral lands. Our mission is to amplify these voices, to share these stories, and to create sustainable economic opportunities that honor the traditional knowledge passed down through generations.'
                }
              </p>
            </div>
          </div>
          <div className="relative group">
            <div className="relative">
              <img
                src="/images/mission-image.jpg"
                alt="Traditional Filipino Weaving Mission"
                className="w-full h-auto max-w-md mx-auto rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_50px_-20px_rgba(0,0,0,0.15)] object-cover transform group-hover:scale-105 transition-all duration-500"
              />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-accent-100 to-brand-100 rounded-lg px-4 py-2 mb-4">
              <Award className="w-5 h-5 text-accent-600" />
              <span className="text-accent-700 font-medium text-sm">
                {params.locale === 'fil' ? 'Ang Aming Mga Halaga' : 'Our Values'}
              </span>
            </div>
            <h2 className="h2 text-balance text-neutral-800 mb-4">
              {params.locale === 'fil' ? 'Ang Aming Mga Halaga' : 'Our Values'}
            </h2>
            <p className="body text-neutral-600 max-w-3xl mx-auto">
              {params.locale === 'fil'
                ? 'Ang mga pangunahing prinsipyo na gumagabay sa aming trabaho, humuhubog sa aming mga relasyon sa mga komunidad, at nagtutulak sa aming commitment sa pangangalaga ng kultura at pandaigdigang pagkilala.'
                : 'The fundamental principles that guide our work, shape our relationships with communities, and drive our commitment to cultural preservation and global recognition.'
              }
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-brand-50 hover:from-brand-50 hover:to-white">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-8 h-8 text-brand-600" />
                </div>
                <CardTitle className="h3 text-brand-700">
                  {params.locale === 'fil' ? 'Paggalang at Respeto sa Kultura' : 'Cultural Reverence & Respect'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="body-sm text-neutral-600 leading-relaxed">
                  {params.locale === 'fil'
                    ? 'Kami ay lumalapit sa bawat aspeto ng aming trabaho na may malalim na respeto sa mga tradisyong kultural ng Cordillera, mga paniniwalang espirituwal, at mga halaga ng komunidad.'
                    : 'We approach every aspect of our work with deep respect for Cordillera cultural traditions, spiritual beliefs, and community values.'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-accent-50 hover:from-accent-50 hover:to-white">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8 text-accent-600" />
                </div>
                <CardTitle className="h3 text-accent-700">
                  {params.locale === 'fil' ? 'Pagiging Tunay at Kultural na Integridad' : 'Authenticity & Cultural Integrity'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="body-sm text-neutral-600 leading-relaxed">
                  {params.locale === 'fil'
                    ? 'Kami ay hindi nagbabago sa aming commitment sa pagiging tunay, tinitiyak na bawat kwentong ibinahagi ay nagpapanatili ng tunay na essence ng mga tradisyon sa paghahabi ng Cordillera.'
                    : 'We are unwavering in our commitment to authenticity, ensuring that every story shared maintains the true essence of Cordillera weaving traditions.'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-brand-50 hover:from-brand-50 hover:to-white">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-brand-600" />
                </div>
                <CardTitle className="h3 text-brand-700">
                  {params.locale === 'fil' ? 'Partnership sa Komunidad at Empowerment' : 'Community Partnership & Empowerment'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="body-sm text-neutral-600 leading-relaxed">
                  {params.locale === 'fil'
                    ? 'Naniniwala kami sa pagtatrabaho kasama ang mga komunidad ng Cordillera bilang pantay na mga partner, hindi bilang mga subject ng dokumentasyon.'
                    : 'We believe in working alongside Cordillera communities as equal partners, not as subjects of documentation.'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-accent-50 hover:from-accent-50 hover:to-white">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-accent-600" />
                </div>
                <CardTitle className="h3 text-accent-700">
                  {params.locale === 'fil' ? 'Environmental at Kultural na Sustainability' : 'Environmental & Cultural Sustainability'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="body-sm text-neutral-600 leading-relaxed">
                  {params.locale === 'fil'
                    ? 'Kami ay nakatuon sa mga napapanatiling gawain na nagbibigay karangalan sa parehong natural na kapaligiran at kultural na mga tradisyon.'
                    : 'We are committed to sustainable practices that honor both the natural environment and cultural traditions.'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-brand-50 hover:from-brand-50 hover:to-white">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-8 h-8 text-brand-600" />
                </div>
                <CardTitle className="h3 text-brand-700">
                  {params.locale === 'fil' ? 'Pandaigdigang Accessibility at Kultural na Edukasyon' : 'Global Accessibility & Cultural Education'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="body-sm text-neutral-600 leading-relaxed">
                  {params.locale === 'fil'
                    ? 'Naniniwala kami na ang kultural na heritage ay dapat na accessible sa lahat, anuman ang geographical na lokasyon o kultural na background.'
                    : 'We believe that cultural heritage should be accessible to everyone, regardless of geographical location or cultural background.'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-accent-50 hover:from-accent-50 hover:to-white">
              <CardHeader className="text-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-8 h-8 text-accent-600" />
                  </div>
                  <CardTitle className="h3 text-accent-700">
                    {params.locale === 'fil' ? 'Inobasyon sa Pamamagitan ng Tradisyon' : 'Innovation Through Tradition'}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="body-sm text-neutral-600 leading-relaxed">
                  {params.locale === 'fil'
                    ? 'Kami ay tumatanggap ng mga innovative na approach sa pangangalaga ng kultura habang nananatiling malalim na nakaugat sa tradisyonal na mga halaga at gawain.'
                    : 'We embrace innovative approaches to cultural preservation while remaining deeply rooted in traditional values and practices.'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Impact Section */}
        <div className="relative mb-20">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-brand-50 to-accent-50 rounded-3xl"></div>
          <div className="relative p-12 text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-100 to-accent-100 rounded-lg px-4 py-2 mb-6">
              <Users className="w-5 h-5 text-brand-600" />
              <span className="text-brand-700 font-medium text-sm">
                {params.locale === 'fil' ? 'Ang Aming Epekto' : 'Our Impact'}
              </span>
            </div>
            <h2 className="h2 text-balance mb-12 text-neutral-800">
              {params.locale === 'fil' ? 'Ang Aming Epekto' : 'Our Impact'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="group">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-10 h-10 text-brand-600" />
                </div>
                <h3 className="h3 text-brand-600 mb-2">50+</h3>
                <p className="body-sm text-neutral-600 font-medium">
                  {params.locale === 'fil' ? 'Mga Artisan' : 'Artisans'}
                </p>
              </div>
              <div className="group">
                <div className="w-20 h-20 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-10 h-10 text-accent-600" />
                </div>
                <h3 className="h3 text-accent-600 mb-2">15</h3>
                <p className="body-sm text-neutral-600 font-medium">
                  {params.locale === 'fil' ? 'Mga Komunidad' : 'Communities'}
                </p>
              </div>
              <div className="group">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-10 h-10 text-brand-600" />
                </div>
                <h3 className="h3 text-brand-600 mb-2">₱500K+</h3>
                <p className="body-sm text-neutral-600 font-medium">
                  {params.locale === 'fil' ? 'Kabuuang Kita' : 'Total Income'}
                </p>
              </div>
              <div className="group">
                <div className="w-20 h-20 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-10 h-10 text-accent-600" />
                </div>
                <h3 className="h3 text-accent-600 mb-2">1000+</h3>
                <p className="body-sm text-neutral-600 font-medium">
                  {params.locale === 'fil' ? 'Mga Produkto' : 'Products'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          {/* Small CordiWeave Logo */}
          <div className="mb-6 flex justify-center">
            <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg border-2 border-brand-200 bg-white">
              <img
                src="/images/CordiWeave1.jpg"
                alt="CordiWeave Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-accent-100 to-brand-100 rounded-lg px-4 py-2 mb-6">
            <Mail className="w-5 h-5 text-accent-600" />
            <span className="text-accent-700 font-medium text-sm">
              {params.locale === 'fil' ? 'Makipag-ugnayan' : 'Get in Touch'}
            </span>
          </div>
          <h2 className="h2 text-balance mb-6 text-neutral-800">
            {params.locale === 'fil' ? 'Makipag-ugnayan sa Amin' : 'Get in Touch'}
          </h2>
          <p className="body text-balance max-w-2xl mx-auto mb-10 text-neutral-600">
            {params.locale === 'fil'
              ? 'May mga katanungan tungkol sa aming mga produkto o nais na maging partner? Makipag-ugnayan sa amin!'
              : 'Have questions about our products or want to become a partner? Get in touch with us!'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="group flex items-center gap-3 bg-gradient-to-r from-brand-50 to-brand-100 border border-brand-200 rounded-xl px-6 py-4 hover:shadow-lg transition-all duration-300">
              <Mail className="w-5 h-5 text-brand-600 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-brand-700 font-medium">
                {params.locale === 'fil' ? 'Email: info@cordiweave.ph' : 'Email: info@cordiweave.ph'}
              </span>
            </div>
            <div className="group flex items-center gap-3 bg-gradient-to-r from-accent-50 to-accent-100 border border-accent-200 rounded-xl px-6 py-4 hover:shadow-lg transition-all duration-300">
              <Phone className="w-5 h-5 text-accent-600 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-accent-700 font-medium">
                {params.locale === 'fil' ? 'Phone: +63 912 345 6789' : 'Phone: +63 912 345 6789'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
