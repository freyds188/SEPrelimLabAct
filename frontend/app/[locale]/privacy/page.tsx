"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { getLocaleFromPathname } from "@/lib/i18n"
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Mail } from "lucide-react"

export default function PrivacyPage() {
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
              {isFilipino ? 'Patakaran sa Privacy' : 'Privacy Policy'}
            </h1>
          </div>
          
          <p className="text-neutral-600">
            {isFilipino 
              ? 'Ang patakaran na ito ay naglalarawan kung paano namin kinokolekta, ginagamit, at pinoprotektahan ang inyong personal na impormasyon sa CordiWeave platform.'
              : 'This policy describes how we collect, use, and protect your personal information on the CordiWeave platform.'
            }
          </p>
        </div>

        {/* Privacy Content */}
        <div className="space-y-6">
          {/* Data Collection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-500" />
                {isFilipino ? 'Pagkolekta ng Data' : 'Data Collection'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-neutral-800 mb-2">
                  {isFilipino ? 'Impormasyong Kinokolekta Namin' : 'Information We Collect'}
                </h4>
                <ul className="list-disc list-inside space-y-2 text-neutral-700">
                  <li>{isFilipino ? 'Pangalan at email address para sa account creation' : 'Name and email address for account creation'}</li>
                  <li>{isFilipino ? 'Address para sa shipping ng mga produkto' : 'Address for product shipping'}</li>
                  <li>{isFilipino ? 'Impormasyon sa pagbabayad para sa mga transaksyon' : 'Payment information for transactions'}</li>
                  <li>{isFilipino ? 'Preference sa wika (English/Filipino)' : 'Language preference (English/Filipino)'}</li>
                  <li>{isFilipino ? 'Impormasyon sa browsing at mga pagbili' : 'Browsing and purchase information'}</li>
                </ul>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  <Eye className="w-3 h-3 mr-1" />
                  {isFilipino ? 'Transparent' : 'Transparent'}
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <Lock className="w-3 h-3 mr-1" />
                  {isFilipino ? 'Secure' : 'Secure'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Data Usage */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isFilipino ? 'Paggamit ng Data' : 'Data Usage'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-neutral-800 mb-2">
                  {isFilipino ? 'Paggamit ng Inyong Impormasyon' : 'How We Use Your Information'}
                </h4>
                <ul className="list-disc list-inside space-y-2 text-neutral-700">
                  <li>{isFilipino ? 'Pagproseso ng mga order at pagbabayad' : 'Processing orders and payments'}</li>
                  <li>{isFilipino ? 'Pagpadala ng mga update tungkol sa mga produkto at kampanya' : 'Sending updates about products and campaigns'}</li>
                  <li>{isFilipino ? 'Pagbibigay ng customer support' : 'Providing customer support'}</li>
                  <li>{isFilipino ? 'Pagpapabuti ng aming platform at serbisyo' : 'Improving our platform and services'}</li>
                  <li>{isFilipino ? 'Pagpapakita ng mga rekomendasyon na personal sa inyo' : 'Showing personalized recommendations'}</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-500" />
                {isFilipino ? 'Proteksyon ng Data' : 'Data Protection'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-neutral-800 mb-2">
                  {isFilipino ? 'Paano Namin Pinoprotektahan ang Inyong Data' : 'How We Protect Your Data'}
                </h4>
                <ul className="list-disc list-inside space-y-2 text-neutral-700">
                  <li>{isFilipino ? 'SSL encryption para sa lahat ng data transmission' : 'SSL encryption for all data transmission'}</li>
                  <li>{isFilipino ? 'Secure database storage na may regular backups' : 'Secure database storage with regular backups'}</li>
                  <li>{isFilipino ? 'Access control para sa mga employee' : 'Access control for employees'}</li>
                  <li>{isFilipino ? 'Regular security updates at monitoring' : 'Regular security updates and monitoring'}</li>
                  <li>{isFilipino ? 'Compliance sa data protection regulations' : 'Compliance with data protection regulations'}</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isFilipino ? 'Pagbabahagi ng Data' : 'Data Sharing'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-neutral-800 mb-2">
                  {isFilipino ? 'Kailan Namin Ibinabahagi ang Inyong Data' : 'When We Share Your Data'}
                </h4>
                <ul className="list-disc list-inside space-y-2 text-neutral-700">
                  <li>{isFilipino ? 'Sa mga artisan para sa pagproseso ng mga order' : 'With artisans for order processing'}</li>
                  <li>{isFilipino ? 'Sa mga payment processor para sa mga transaksyon' : 'With payment processors for transactions'}</li>
                  <li>{isFilipino ? 'Sa shipping companies para sa delivery' : 'With shipping companies for delivery'}</li>
                  <li>{isFilipino ? 'Kapag kinakailangan ng batas' : 'When required by law'}</li>
                  <li>{isFilipino ? 'Sa inyong pahintulot para sa ibang layunin' : 'With your consent for other purposes'}</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  {isFilipino 
                    ? 'Hindi namin ibinebenta ang inyong personal na impormasyon sa mga third-party para sa marketing purposes.'
                    : 'We do not sell your personal information to third parties for marketing purposes.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isFilipino ? 'Cookies at Tracking' : 'Cookies and Tracking'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-neutral-700">
                {isFilipino 
                  ? 'Gumagamit kami ng cookies para sa pag-improve ng inyong experience sa aming platform. Kasama dito ang pag-save ng inyong language preference, shopping cart, at mga login session.'
                  : 'We use cookies to improve your experience on our platform. This includes saving your language preference, shopping cart, and login sessions.'
                }
              </p>
              
              <div>
                <h4 className="font-semibold text-neutral-800 mb-2">
                  {isFilipino ? 'Mga Uri ng Cookies' : 'Types of Cookies'}
                </h4>
                <ul className="list-disc list-inside space-y-2 text-neutral-700">
                  <li>{isFilipino ? 'Essential cookies - para sa basic functionality' : 'Essential cookies - for basic functionality'}</li>
                  <li>{isFilipino ? 'Preference cookies - para sa language at settings' : 'Preference cookies - for language and settings'}</li>
                  <li>{isFilipino ? 'Analytics cookies - para sa pag-improve ng platform' : 'Analytics cookies - for improving the platform'}</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* User Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                {isFilipino ? 'Mga Karapatan ng User' : 'User Rights'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-neutral-800 mb-2">
                  {isFilipino ? 'Inyong mga Karapatan' : 'Your Rights'}
                </h4>
                <ul className="list-disc list-inside space-y-2 text-neutral-700">
                  <li>{isFilipino ? 'Access sa inyong personal na data' : 'Access to your personal data'}</li>
                  <li>{isFilipino ? 'Correction ng maling impormasyon' : 'Correction of incorrect information'}</li>
                  <li>{isFilipino ? 'Deletion ng inyong account at data' : 'Deletion of your account and data'}</li>
                  <li>{isFilipino ? 'Portability ng inyong data' : 'Portability of your data'}</li>
                  <li>{isFilipino ? 'Objection sa data processing' : 'Objection to data processing'}</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  {isFilipino 
                    ? 'Para sa mga request tungkol sa inyong data, makipag-ugnayan sa amin sa admin@cordiweave.ph'
                    : 'For requests about your data, please contact us at admin@cordiweave.ph'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isFilipino ? 'Privacy ng mga Bata' : 'Children\'s Privacy'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-700">
                {isFilipino 
                  ? 'Ang aming platform ay hindi sinasadya na makolekta ng personal na impormasyon mula sa mga batang wala pang 13 taong gulang. Kung nalaman namin na nakolekta namin ang impormasyon ng isang bata, aalisin namin ito kaagad.'
                  : 'Our platform does not knowingly collect personal information from children under 13. If we learn that we have collected information from a child, we will delete it immediately.'
                }
              </p>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isFilipino ? 'Mga Pagbabago sa Patakaran' : 'Changes to Policy'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-700">
                {isFilipino 
                  ? 'Maaari naming baguhin ang patakarang ito sa anumang oras. Ipaaalam namin sa inyo ang anumang malaking pagbabago sa pamamagitan ng email o notification sa platform.'
                  : 'We may change this policy at any time. We will notify you of any significant changes via email or platform notification.'
                }
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-orange-500" />
                {isFilipino ? 'Makipag-ugnayan' : 'Contact'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-neutral-700">
                  {isFilipino 
                    ? 'Para sa mga katanungan tungkol sa patakarang ito o mga request tungkol sa inyong data:'
                    : 'For questions about this policy or requests about your data:'
                  }
                </p>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <p className="font-mono text-sm">
                    Email: admin@cordiweave.ph<br/>
                    {isFilipino ? 'Oras ng Response: 24-48 oras' : 'Response Time: 24-48 hours'}
                  </p>
                </div>
              </div>
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
