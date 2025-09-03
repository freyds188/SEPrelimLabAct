"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getTranslations, type Locale } from '@/lib/i18n'
import { 
  ShoppingBag, 
  BookOpen, 
  Heart, 
  Globe, 
  Award,
  ArrowRight,
  Sparkles,
  Star
} from 'lucide-react'

interface LocalePageProps {
  params: {
    locale: Locale
  }
}

export default function LocalePage({ params }: LocalePageProps) {
  const t = getTranslations(params.locale)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-50 via-white to-accent-50 py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fef3c7%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-brand-200 to-accent-200 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-accent-200 to-brand-200 rounded-full blur-xl opacity-20 animate-pulse delay-1000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-100 to-accent-100 border border-brand-200 rounded-full px-6 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <Badge variant="secondary" className="bg-transparent border-0 text-brand-700 font-medium">
                {t.home.hero.badge}
              </Badge>
            </div>
            <h1 className="display text-balance mb-6">
              <span className="bg-gradient-to-r from-brand-600 via-brand-700 to-accent-600 bg-clip-text text-transparent">
                {t.home.hero.title}
              </span>
              <span className="text-brand-600 block mt-2">{t.home.hero.titleHighlight}</span>
            </h1>
            <p className="body text-balance mb-10 max-w-3xl mx-auto text-neutral-700 leading-relaxed">
              {t.home.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="group bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href={`/${params.locale}/shop`} className="flex items-center gap-2">
                  {t.home.hero.shopButton}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="group border-2 border-brand-200 hover:border-brand-300 hover:bg-brand-50 transition-all duration-300">
                <Link href={`/${params.locale}/stories`} className="flex items-center gap-2">
                  {t.home.hero.storiesButton}
                  <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-accent-100 to-brand-100 rounded-lg px-4 py-2 mb-4">
              <Star className="w-5 h-5 text-accent-600" />
              <span className="text-accent-700 font-medium text-sm">
                {params.locale === 'fil' ? 'Mga Tampok na Serbisyo' : 'Featured Services'}
              </span>
            </div>
            <h2 className="h2 text-balance text-neutral-800 mb-4">
              {params.locale === 'fil' ? 'Alamin ang Aming Mga Serbisyo' : 'Discover Our Services'}
            </h2>
            <p className="body text-neutral-600 max-w-2xl mx-auto">
              {params.locale === 'fil'
                ? 'I-explore ang aming mga serbisyo na nakatuon sa pangangalaga ng kultura at suporta sa mga artisan.'
                : 'Explore our services focused on cultural preservation and artisan support.'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-brand-50 hover:from-brand-50 hover:to-white overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-brand-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ShoppingBag className="w-8 h-8 text-brand-600" />
                </div>
                <CardTitle className="h3 text-brand-700">
                  {t.home.features.shop.title}
                </CardTitle>
                <CardDescription className="text-neutral-600">
                  {t.home.features.shop.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <Button asChild variant="outline" className="group border-brand-200 hover:border-brand-300 hover:bg-brand-50">
                  <Link href={`/${params.locale}/shop`} className="flex items-center gap-2">
                    {t.home.features.shop.button}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-accent-50 hover:from-accent-50 hover:to-white overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-400 to-accent-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-8 h-8 text-accent-600" />
                </div>
                <CardTitle className="h3 text-accent-700">
                  {t.home.features.glossary.title}
                </CardTitle>
                <CardDescription className="text-neutral-600">
                  {t.home.features.glossary.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <Button asChild variant="outline" className="group border-accent-200 hover:border-accent-300 hover:bg-accent-50">
                  <Link href={`/${params.locale}/glossary`} className="flex items-center gap-2">
                    {t.home.features.glossary.button}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-brand-50 hover:from-brand-50 hover:to-white overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-brand-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-8 h-8 text-brand-600" />
                </div>
                <CardTitle className="h3 text-brand-700">
                  {t.home.features.donate.title}
                </CardTitle>
                <CardDescription className="text-neutral-600">
                  {t.home.features.donate.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <Button asChild variant="outline" className="group border-brand-200 hover:border-brand-300 hover:bg-brand-50">
                  <Link href={`/${params.locale}/donate`} className="flex items-center gap-2">
                    {t.home.features.donate.button}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative bg-gradient-to-br from-neutral-50 via-brand-50 to-accent-50 py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fef3c7%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-100 to-accent-100 rounded-lg px-4 py-2 mb-4">
              <Award className="w-5 h-5 text-brand-600" />
              <span className="text-brand-700 font-medium text-sm">
                {params.locale === 'fil' ? 'Ang Aming Misyon' : 'Our Mission'}
              </span>
            </div>
            <h2 className="h2 text-balance mb-6 text-neutral-800">
              {t.home.mission.title}
            </h2>
            <p className="body text-balance max-w-3xl mx-auto text-neutral-700 leading-relaxed">
              {t.home.mission.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="group">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-100 to-accent-100 rounded-lg px-4 py-2 mb-4">
                <Globe className="w-5 h-5 text-brand-600" />
                <span className="text-brand-700 font-medium text-sm">
                  {t.home.mission.culturalPreservation.title}
                </span>
              </div>
              <h3 className="h3 text-balance mb-4 text-neutral-800">
                {t.home.mission.culturalPreservation.title}
              </h3>
              <p className="body-sm text-balance text-neutral-700 leading-relaxed">
                {t.home.mission.culturalPreservation.description}
              </p>
            </div>
            <div className="group">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-accent-100 to-brand-100 rounded-lg px-4 py-2 mb-4">
                <Heart className="w-5 h-5 text-accent-600" />
                <span className="text-accent-700 font-medium text-sm">
                  {t.home.mission.fairTrade.title}
                </span>
              </div>
              <h3 className="h3 text-balance mb-4 text-neutral-800">
                {t.home.mission.fairTrade.title}
              </h3>
              <p className="body-sm text-balance text-neutral-700 leading-relaxed">
                {t.home.mission.fairTrade.description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
