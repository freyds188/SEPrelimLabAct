"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { getTranslations, type Locale } from '@/lib/i18n'
import { Heart, Users, Award, Target } from 'lucide-react'

interface LocaleDonatePageProps {
  params: {
    locale: Locale
  }
}

interface ImpactStats {
  totalIncome: number
  artisansSupported: number
  communitiesReached: number
}

const donationSchema = z.object({
  amount: z.number().min(50, 'Minimum donation amount is ₱50'),
  donorName: z.string().optional(),
  donorEmail: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  isAnonymous: z.boolean().default(false),
})

type DonationFormData = z.infer<typeof donationSchema>

export default function LocaleDonatePage({ params }: LocaleDonatePageProps) {
  const t = getTranslations(params.locale)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [impactStats, setImpactStats] = useState<ImpactStats>({
    totalIncome: 500000,
    artisansSupported: 50,
    communitiesReached: 15,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 50,
      donorName: '',
      donorEmail: '',
      isAnonymous: false,
    },
  })

  const isAnonymous = watch('isAnonymous')

  // Fetch impact stats from API
  useEffect(() => {
    fetchImpactStats()
  }, [])

  const fetchImpactStats = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
      const response = await fetch(`${API_BASE_URL}/totals`)
      if (response.ok) {
        const data = await response.json()
        setImpactStats({
          totalIncome: data.data?.total_income || 500000,
          artisansSupported: data.data?.artisans_supported || 50,
          communitiesReached: data.data?.communities_reached || 15,
        })
      }
    } catch (error) {
      console.error('Failed to fetch impact stats:', error)
      // Keep default values if API fails
    }
  }

  const onSubmit = async (data: DonationFormData) => {
    setIsSubmitting(true)
    
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
      const response = await fetch(`${API_BASE_URL}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaign_id: 1,
          amount: data.amount,
          donor_name: data.donorName || null,
          donor_email: data.donorEmail || null,
          is_anonymous: data.isAnonymous,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        
        // Close modal and reset form
        setIsModalOpen(false)
        reset()
        
        // Show success toast
        toast.success(t.donate.success.message)
        
        // Refresh impact stats
        await fetchImpactStats()
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Donation failed:', response.status, errorData)
        throw new Error(errorData.message || 'Failed to process donation')
      }
    } catch (error) {
      console.error('Donation error:', error)
      toast.error(t.donate.error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-white via-orange-50/30 to-amber-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
            {params.locale === 'fil' ? 'Suportahan ang Komunidad' : 'Support the Community'}
          </Badge>
          <h1 className="h1 text-balance mb-6 bg-gradient-to-r from-brand-600 to-orange-600 bg-clip-text text-transparent">
            {t.donate.supportUs}
          </h1>
          <p className="body text-balance max-w-3xl mx-auto text-lg text-neutral-700">
            {t.donate.donateDescription}
          </p>
        </div>

        {/* Single Donation Card */}
        <div className="max-w-md mx-auto mb-16">
          <Card variant="content" className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-brand-200">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-8 w-8 text-brand-600" />
              </div>
              <CardTitle className="h2 text-brand-600">
                {t.donate.supportUs}
              </CardTitle>
              <CardDescription className="body-lg font-medium">
                {params.locale === 'fil' ? 'Magbigay ng Donasyon' : 'Make a Donation'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="body-sm text-muted-foreground mb-6">
                {t.donate.donateDescription}
              </p>
              
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white shadow-lg">
                    {t.donate.donateNow}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{t.donate.modal.title}</DialogTitle>
                    <DialogDescription>
                      {params.locale === 'fil' 
                        ? 'Magbigay ng donasyon upang suportahan ang aming mga artisan.'
                        : 'Make a donation to support our artisans.'
                      }
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">{t.donate.modal.amount}</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="1"
                        min="50"
                        placeholder={t.donate.modal.amountPlaceholder}
                        {...register('amount', { valueAsNumber: true })}
                        aria-describedby={errors.amount ? 'amount-error' : undefined}
                      />
                      {errors.amount && (
                        <p id="amount-error" className="text-sm text-destructive">
                          {errors.amount.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="donorName">{t.donate.modal.donorName}</Label>
                      <Input
                        id="donorName"
                        type="text"
                        placeholder={t.donate.modal.donorNamePlaceholder}
                        {...register('donorName')}
                        aria-describedby={errors.donorName ? 'donorName-error' : undefined}
                      />
                      {errors.donorName && (
                        <p id="donorName-error" className="text-sm text-destructive">
                          {errors.donorName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="donorEmail">{t.donate.modal.donorEmail}</Label>
                      <Input
                        id="donorEmail"
                        type="email"
                        placeholder={t.donate.modal.donorEmailPlaceholder}
                        {...register('donorEmail')}
                        aria-describedby={errors.donorEmail ? 'donorEmail-error' : undefined}
                      />
                      {errors.donorEmail && (
                        <p id="donorEmail-error" className="text-sm text-destructive">
                          {errors.donorEmail.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isAnonymous"
                        checked={isAnonymous}
                        onCheckedChange={(checked) => setValue('isAnonymous', checked as boolean)}
                        aria-describedby="anonymous-description"
                      />
                      <Label htmlFor="isAnonymous" className="text-sm font-normal">
                        {t.donate.modal.anonymous}
                      </Label>
                    </div>
                    <p id="anonymous-description" className="text-xs text-muted-foreground">
                      {params.locale === 'fil' 
                        ? 'Ang inyong pangalan ay hindi ipapakita sa mga listahan ng donor.'
                        : 'Your name will not be shown in donor lists.'
                      }
                    </p>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsModalOpen(false)}
                        disabled={isSubmitting}
                      >
                        {t.donate.modal.cancel}
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800"
                      >
                        {isSubmitting 
                          ? (params.locale === 'fil' ? 'Nagproproseso...' : 'Processing...')
                          : t.donate.modal.submit
                        }
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Impact Section */}
        <div className="bg-gradient-to-br from-brand-50 to-orange-50 rounded-2xl p-12 text-center border border-brand-100 shadow-lg mb-16">
          <h2 className="h2 text-balance mb-8 text-brand-800">
            {params.locale === 'fil' ? 'Ang Aming Epekto' : 'Our Impact'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="group">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-10 w-10 text-brand-600" />
              </div>
              <h3 className="h1 text-brand-600 mb-2">{impactStats.artisansSupported}+</h3>
              <p className="body-lg font-medium text-brand-800">
                {params.locale === 'fil' ? 'Mga Artisan na Sinusuportahan' : 'Artisans Supported'}
              </p>
            </div>
            <div className="group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="h1 text-orange-600 mb-2">{formatCurrency(impactStats.totalIncome)}</h3>
              <p className="body-lg font-medium text-orange-800">
                {params.locale === 'fil' ? 'Kabuuang Kita ng Artisan' : 'Total Artisan Income'}
              </p>
            </div>
            <div className="group">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="h1 text-amber-600 mb-2">{impactStats.communitiesReached}</h3>
              <p className="body-lg font-medium text-amber-800">
                {params.locale === 'fil' ? 'Mga Komunidad na Naabot' : 'Communities Reached'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}