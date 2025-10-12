"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  CheckCircle, 
  Heart, 
  Users, 
  MapPin, 
  Calculator, 
  Shield, 
  Download,
  Share2,
  Award,
  Gift,
  Building,
  School,
  Baby,
  Home
} from "lucide-react"

interface DonationReceiptProps {
  donation: {
    id: string
    amount: number
    donorName?: string
    donorEmail?: string
    isAnonymous: boolean
    campaignId: number
    transactionId: string
    paidAt: string
    status: string
  }
  campaign?: {
    id: number
    title: string
    description: string
  }
  locale?: string
  onClose?: () => void
  onDownload?: () => void
  onShare?: () => void
}

export function DonationReceipt({ 
  donation, 
  campaign, 
  locale = 'en',
  onClose,
  onDownload,
  onShare
}: DonationReceiptProps) {
  const isFilipino = locale === 'fil'
  const [showBeneficiariesModal, setShowBeneficiariesModal] = useState(false)

  // Calculate transparency breakdown
  const breakdown = {
    artisanSupport: donation.amount * 0.70, // 70% to direct artisan support
    materials: donation.amount * 0.15, // 15% to materials and equipment
    training: donation.amount * 0.10, // 10% to training programs
    platformFee: donation.amount * 0.05, // 5% to platform operations
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isFilipino ? 'fil-PH' : 'en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Beneficiaries data for the modal
  const charityBeneficiaries = [
    {
      id: 1,
      name: isFilipino ? 'Bahay Aruga - Orphanage' : 'Bahay Aruga - Orphanage',
      description: isFilipino 
        ? 'Nagbibigay ng pangangalaga at edukasyon sa mga batang ulila sa Cordillera region'
        : 'Provides care and education for orphaned children in the Cordillera region',
      icon: Baby,
      amount: donation.amount * 0.30, // 30% of the 70%
      percentage: 30,
      location: 'Baguio City, Philippines',
      established: '2015'
    },
    {
      id: 2,
      name: isFilipino ? 'Weavers Education Center' : 'Weavers Education Center',
      description: isFilipino 
        ? 'Nagbibigay ng libreng pagsasanay sa tradisyonal na paghahabi para sa mga kabataan'
        : 'Provides free training in traditional weaving for youth',
      icon: School,
      amount: donation.amount * 0.25, // 25% of the 70%
      percentage: 25,
      location: 'Sagada, Mountain Province',
      established: '2018'
    },
    {
      id: 3,
      name: isFilipino ? 'Elderly Care Foundation' : 'Elderly Care Foundation',
      description: isFilipino 
        ? 'Suporta para sa mga matatandang artisan na hindi na makapagtrabaho'
        : 'Support for elderly artisans who can no longer work',
      icon: Home,
      amount: donation.amount * 0.25, // 25% of the 70%
      percentage: 25,
      location: 'Bontoc, Mountain Province',
      established: '2020'
    },
    {
      id: 4,
      name: isFilipino ? 'Community Development Center' : 'Community Development Center',
      description: isFilipino 
        ? 'Nagtataguyod ng sustainable livelihood programs para sa mga komunidad'
        : 'Promotes sustainable livelihood programs for communities',
      icon: Building,
      amount: donation.amount * 0.20, // 20% of the 70%
      percentage: 20,
      location: 'Kalinga Province',
      established: '2016'
    }
  ]

  // Main beneficiaries for the breakdown
  const beneficiaries = [
    {
      id: 'charities',
      name: isFilipino ? 'Mga Charities' : 'Charities',
      amount: breakdown.artisanSupport,
      percentage: 70,
      description: isFilipino 
        ? 'Suporta para sa mga charitable organizations at beneficiaries'
        : 'Support for charitable organizations and beneficiaries',
      icon: Users,
      color: 'bg-green-100 text-green-700',
      clickable: true
    },
    {
      id: 'materials',
      name: isFilipino ? 'Mga Materyales at Kagamitan' : 'Materials & Equipment',
      amount: breakdown.materials,
      percentage: 15,
      description: isFilipino 
        ? 'Pagbili ng mga thread, loom, at iba pang kagamitan sa paghahabi'
        : 'Purchase of threads, looms, and other weaving equipment',
      icon: Gift,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'training',
      name: isFilipino ? 'Pagsasanay at Edukasyon' : 'Training & Education',
      amount: breakdown.training,
      percentage: 10,
      description: isFilipino 
        ? 'Workshop at pagsasanay para sa mga bagong teknik sa paghahabi'
        : 'Workshops and training for new weaving techniques',
      icon: Award,
      color: 'bg-purple-100 text-purple-700'
    },
    {
      id: 'platform',
      name: isFilipino ? 'Operasyon ng Platform' : 'Platform Operations',
      amount: breakdown.platformFee,
      percentage: 5,
      description: isFilipino 
        ? 'Pagpapanatili ng platform at customer support'
        : 'Platform maintenance and customer support',
      icon: Shield,
      color: 'bg-orange-100 text-orange-700'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            {isFilipino ? 'Salamat sa Inyong Donasyon!' : 'Thank You for Your Donation!'}
          </h1>
          <p className="text-neutral-600">
            {isFilipino 
              ? 'Ang inyong suporta ay makakatulong sa pagpreserba ng tradisyonal na paghahabi ng Pilipinas'
              : 'Your support helps preserve traditional Filipino weaving traditions'
            }
          </p>
        </div>
      </div>

      {/* Receipt Card */}
      <Card className="border-2 border-green-200">
        <CardHeader className="bg-green-50">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Calculator className="w-5 h-5" />
            {isFilipino ? 'Donasyon Receipt' : 'Donation Receipt'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Donation Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-neutral-800">
                {isFilipino ? 'Mga Detalye ng Donasyon' : 'Donation Details'}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">
                    {isFilipino ? 'Donasyon ID:' : 'Donation ID:'}
                  </span>
                  <span className="font-mono font-medium">#{donation.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">
                    {isFilipino ? 'Transaction ID:' : 'Transaction ID:'}
                  </span>
                  <span className="font-mono text-xs">{donation.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">
                    {isFilipino ? 'Petsa:' : 'Date:'}
                  </span>
                  <span>{formatDate(donation.paidAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">
                    {isFilipino ? 'Donor:' : 'Donor:'}
                  </span>
                  <span>
                    {donation.isAnonymous 
                      ? (isFilipino ? 'Anonymous' : 'Anonymous')
                      : (donation.donorName || donation.donorEmail || 'N/A')
                    }
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-neutral-800">
                {isFilipino ? 'Halaga ng Donasyon' : 'Donation Amount'}
              </h3>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-700">
                  {formatCurrency(donation.amount)}
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700 mt-2">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {isFilipino ? 'Nakumpleto' : 'Completed'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200 my-6"></div>

          {/* Campaign Information */}
          {campaign && (
            <div className="space-y-3">
              <h3 className="font-semibold text-neutral-800 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                {isFilipino ? 'Kampanya na Sinuportahan' : 'Campaign Supported'}
              </h3>
              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium text-neutral-800 mb-2">{campaign.title}</h4>
                <p className="text-sm text-neutral-600">{campaign.description}</p>
              </div>
            </div>
          )}

          <div className="border-t border-neutral-200 my-6"></div>

          {/* Transparency Breakdown */}
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-800 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              {isFilipino ? 'Transparency Breakdown' : 'Transparency Breakdown'}
            </h3>
            <p className="text-sm text-neutral-600">
              {isFilipino 
                ? 'Narito kung saan napupunta ang inyong donasyon:'
                : 'Here\'s where your donation goes:'
              }
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {beneficiaries.map((beneficiary) => {
                const IconComponent = beneficiary.icon
                return (
                  <div 
                    key={beneficiary.id} 
                    className={`p-4 border rounded-lg transition-shadow ${
                      beneficiary.clickable 
                        ? 'hover:shadow-md cursor-pointer hover:border-green-300' 
                        : 'hover:shadow-sm'
                    }`}
                    onClick={beneficiary.clickable ? () => setShowBeneficiariesModal(true) : undefined}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${beneficiary.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-neutral-800 text-sm">
                            {beneficiary.name}
                            {beneficiary.clickable && (
                              <span className="ml-2 text-xs text-blue-600 underline">
                                {isFilipino ? '(i-click para makita ang mga beneficiaries)' : '(click to see beneficiaries)'}
                              </span>
                            )}
                          </h4>
                          <span className="text-xs font-medium text-neutral-600">
                            {beneficiary.percentage}%
                          </span>
                        </div>
                        <p className="text-lg font-bold text-green-600 mb-1">
                          {formatCurrency(beneficiary.amount)}
                        </p>
                        <p className="text-xs text-neutral-600">
                          {beneficiary.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Impact Statement */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
            <h3 className="font-semibold text-neutral-800 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600" />
              {isFilipino ? 'Ang Inyong Impact' : 'Your Impact'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(donation.amount / 500)}
                </div>
                <div className="text-xs text-neutral-600">
                  {isFilipino ? 'Oras ng Training' : 'Training Hours'}
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(donation.amount / 1000)}
                </div>
                <div className="text-xs text-neutral-600">
                  {isFilipino ? 'Mga Materyales' : 'Materials Provided'}
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(donation.amount / 2000)}
                </div>
                <div className="text-xs text-neutral-600">
                  {isFilipino ? 'Mga Artisan na Nasuportahan' : 'Artisans Supported'}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={onDownload}
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {isFilipino ? 'I-download ang Receipt' : 'Download Receipt'}
            </Button>
            <Button 
              onClick={onShare}
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              {isFilipino ? 'Ibahagi' : 'Share'}
            </Button>
            {onClose && (
              <Button 
                onClick={onClose}
                className="flex items-center gap-2 ml-auto"
              >
                {isFilipino ? 'Tapos na' : 'Done'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer Message */}
      <div className="text-center p-6 bg-neutral-50 rounded-lg">
        <p className="text-sm text-neutral-600">
          {isFilipino 
            ? 'Ang CordiWeave ay nakatuon sa transparency at accountability. Lahat ng donasyon ay ginagamit para sa pagpreserba ng tradisyonal na paghahabi ng Pilipinas.'
            : 'CordiWeave is committed to transparency and accountability. All donations are used for preserving traditional Filipino weaving traditions.'
          }
        </p>
      </div>

      {/* Beneficiaries Modal */}
      <Dialog open={showBeneficiariesModal} onOpenChange={setShowBeneficiariesModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              {isFilipino ? 'Mga Charitable Organizations' : 'Charitable Organizations'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <p className="text-neutral-600">
              {isFilipino 
                ? 'Ang 70% ng inyong donasyon ay napupunta sa mga sumusunod na charitable organizations:'
                : '70% of your donation goes to the following charitable organizations:'
              }
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {charityBeneficiaries.map((beneficiary) => {
                const IconComponent = beneficiary.icon
                return (
                  <Card key={beneficiary.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-green-100 rounded-full">
                          <IconComponent className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-neutral-800 mb-2">
                            {beneficiary.name}
                          </h3>
                          <p className="text-sm text-neutral-600 mb-3">
                            {beneficiary.description}
                          </p>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-neutral-700">
                                {isFilipino ? 'Halaga:' : 'Amount:'}
                              </span>
                              <span className="font-bold text-green-600">
                                {formatCurrency(beneficiary.amount)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-neutral-700">
                                {isFilipino ? 'Porsyento:' : 'Percentage:'}
                              </span>
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                {beneficiary.percentage}%
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-neutral-700">
                                {isFilipino ? 'Lokasyon:' : 'Location:'}
                              </span>
                              <span className="text-sm text-neutral-600">
                                {beneficiary.location}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-neutral-700">
                                {isFilipino ? 'Itinatag:' : 'Established:'}
                              </span>
                              <span className="text-sm text-neutral-600">
                                {beneficiary.established}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">
                {isFilipino ? 'Kabuuang Suporta' : 'Total Support'}
              </h4>
              <p className="text-blue-700">
                {isFilipino 
                  ? `Ang kabuuang suporta para sa mga charities ay ${formatCurrency(donation.amount * 0.70)}, na kumakatawan sa 70% ng inyong donasyon.`
                  : `Total support for charities is ${formatCurrency(donation.amount * 0.70)}, representing 70% of your donation.`
                }
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={() => setShowBeneficiariesModal(false)}
                variant="outline"
              >
                {isFilipino ? 'Isara' : 'Close'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}