"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { getLocaleFromPathname } from "@/lib/i18n"
import { ArrowLeft, Shield, Users, Heart, Globe } from "lucide-react"

export default function TermsPage() {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const isFilipino = locale === 'fil'

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => window.close()}
            className="mb-4 text-brand-600 hover:text-brand-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isFilipino ? 'Bumalik' : 'Go Back'}
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-brand-600" />
            <h1 className="text-3xl font-bold text-brand-900">
              {isFilipino ? 'Mga Tuntunin at Kasunduan' : 'Terms and Agreements'}
            </h1>
          </div>
          
            <p className="text-neutral-600">
              {isFilipino 
                ? 'Ang mga kasunduan na ito ay naglalarawan sa paggamit ng CordiWeave platform para sa pagpreserba ng tradisyonal na paghahabi ng Pilipinas.'
                : 'These agreements describe the use of the CordiWeave platform for preserving traditional Filipino weaving traditions.'
              }
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-6">
          {/* Mission Statement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                {isFilipino ? 'Ang Aming Misyon' : 'Our Mission'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-neutral-700">
                {isFilipino 
                  ? 'Ang CordiWeave ay nakatuon sa pagpreserba at pag-promote ng tradisyonal na paghahabi ng Pilipinas, partikular na sa mga komunidad ng Cordillera. Sa pamamagitan ng aming platform, sinusuportahan namin ang mga artisan na nagpapalaganap ng kanilang kultura at tradisyon.'
                  : 'CordiWeave is dedicated to preserving and promoting traditional Filipino weaving traditions, particularly in Cordillera communities. Through our platform, we support artisans who are keeping their culture and traditions alive.'
                }
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-brand-100 text-brand-700">
                  <Users className="w-3 h-3 mr-1" />
                  {isFilipino ? 'Kultural na Preserbasyon' : 'Cultural Preservation'}
                </Badge>
                <Badge variant="secondary" className="bg-accent-100 text-accent-700">
                  <Globe className="w-3 h-3 mr-1" />
                  {isFilipino ? 'Patas na Kalakalan' : 'Fair Trade'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Platform Usage */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isFilipino ? 'Paggamit ng Platform' : 'Platform Usage'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-neutral-800 mb-2">
                  {isFilipino ? 'Mga Pahintulot na Aktibidad' : 'Permitted Activities'}
                </h4>
                <ul className="list-disc list-inside space-y-2 text-neutral-700">
                  <li>{isFilipino ? 'Pagbili ng mga handwoven na produkto mula sa mga artisan' : 'Purchasing handwoven products from artisans'}</li>
                  <li>{isFilipino ? 'Pagbabasa ng mga kultural na kwento at kasaysayan' : 'Reading cultural stories and histories'}</li>
                  <li>{isFilipino ? 'Pagsuporta sa mga kampanya para sa pagpreserba ng kultura' : 'Supporting campaigns for cultural preservation'}</li>
                  <li>{isFilipino ? 'Pagtuklas ng mga tradisyonal na teknik at termino' : 'Discovering traditional techniques and terminology'}</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-neutral-800 mb-2">
                  {isFilipino ? 'Mga Hindi Pinapayagang Aktibidad' : 'Prohibited Activities'}
                </h4>
                <ul className="list-disc list-inside space-y-2 text-neutral-700">
                  <li>{isFilipino ? 'Pagbebenta ng mga pekeng produkto bilang tunay na handwoven' : 'Selling counterfeit products as authentic handwoven items'}</li>
                  <li>{isFilipino ? 'Paglabag sa karapatan ng intelektwal na pag-aari ng mga artisan' : 'Infringing on artisans\' intellectual property rights'}</li>
                  <li>{isFilipino ? 'Paggamit ng platform para sa mga ilegal na layunin' : 'Using the platform for illegal purposes'}</li>
                  <li>{isFilipino ? 'Pagpapakalat ng maling impormasyon tungkol sa mga produkto' : 'Spreading misinformation about products'}</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* E-commerce Terms */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isFilipino ? 'Mga Tuntunin sa E-commerce' : 'E-commerce Terms'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-neutral-800 mb-2">
                  {isFilipino ? 'Mga Produkto at Presyo' : 'Products and Pricing'}
                </h4>
                <p className="text-neutral-700">
                  {isFilipino 
                    ? 'Lahat ng mga produkto sa aming platform ay gawa ng mga artisan na kabilang sa aming komunidad. Ang mga presyo ay nagpapakita ng patas na kompensasyon para sa mga artisan at ang tunay na halaga ng kanilang trabaho.'
                    : 'All products on our platform are made by artisans in our community. Prices reflect fair compensation for artisans and the true value of their work.'
                  }
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-neutral-800 mb-2">
                  {isFilipino ? 'Mga Patakaran sa Pagbabalik' : 'Return Policies'}
                </h4>
                <p className="text-neutral-700">
                  {isFilipino 
                    ? 'Dahil ang bawat produkto ay gawa sa kamay at natatangi, may limitadong patakaran sa pagbabalik. Ang mga return ay tatanggapin lamang kung ang produkto ay may depekto o hindi tumugma sa inilarawan.'
                    : 'Since each product is handmade and unique, we have limited return policies. Returns will only be accepted if the product is defective or does not match the description.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Donations */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isFilipino ? 'Mga Donasyon' : 'Donations'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-neutral-700">
                {isFilipino 
                  ? 'Ang mga donasyon ay ginagamit upang suportahan ang pagpreserba ng tradisyonal na paghahabi, pagsasanay sa mga artisan, at pagbibigay ng mga materyales at kagamitan sa aming mga komunidad. Walang refund para sa mga donasyon.'
                  : 'Donations are used to support the preservation of traditional weaving, artisan training, and providing materials and equipment to our communities. No refunds are available for donations.'
                }
              </p>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isFilipino ? 'Mga User Account' : 'User Accounts'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-neutral-700">
                {isFilipino 
                  ? 'Ikaw ay responsable para sa pagprotekta sa iyong account at password. Dapat mong iulat kaagad ang anumang hindi awtorisadong paggamit ng iyong account.'
                  : 'You are responsible for protecting your account and password. You must immediately report any unauthorized use of your account.'
                }
              </p>
            </CardContent>
          </Card>

          {/* Modifications */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isFilipino ? 'Mga Pagbabago sa Mga Tuntunin' : 'Changes to Terms'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-700">
                {isFilipino 
                  ? 'Maaari naming baguhin ang mga tuntuning ito sa anumang oras. Ang patuloy na paggamit ng platform pagkatapos ng mga pagbabago ay nagpapahiwatig ng iyong pagsang-ayon sa mga bagong tuntunin.'
                  : 'We may change these terms at any time. Continued use of the platform after changes indicates your agreement to the new terms.'
                }
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isFilipino ? 'Makipag-ugnayan' : 'Contact'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-700">
                {isFilipino 
                  ? 'Para sa mga katanungan tungkol sa mga tuntuning ito, makipag-ugnayan sa amin sa admin@cordiweave.ph'
                  : 'For questions about these terms, please contact us at admin@cordiweave.ph'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-neutral-500">
            {isFilipino 
              ? 'Huling na-update: Disyembre 2024'
              : 'Last updated: December 2024'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
