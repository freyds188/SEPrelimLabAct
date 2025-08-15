"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getTranslations, type Locale } from '@/lib/i18n'

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
      <section className="bg-gradient-to-br from-brand-50 to-accent-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              {t.home.hero.badge}
            </Badge>
            <h1 className="display text-balance mb-6">
              {t.home.hero.title}
              <span className="text-brand-600 block">{t.home.hero.titleHighlight}</span>
            </h1>
            <p className="body text-balance mb-8 max-w-3xl mx-auto">
              {t.home.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href={`/${params.locale}/shop`}>{t.home.hero.shopButton}</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href={`/${params.locale}/stories`}>{t.home.hero.storiesButton}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="content">
              <CardHeader>
                <CardTitle className="h3">{t.home.features.shop.title}</CardTitle>
                <CardDescription className="body-sm">
                  {t.home.features.shop.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={`/${params.locale}/shop`}>{t.home.features.shop.button}</Link>
                </Button>
              </CardContent>
            </Card>

            <Card variant="content">
              <CardHeader>
                <CardTitle className="h3">{t.home.features.weavers.title}</CardTitle>
                <CardDescription className="body-sm">
                  {t.home.features.weavers.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/${params.locale}/weavers`}>{t.home.features.weavers.button}</Link>
                </Button>
              </CardContent>
            </Card>

            <Card variant="content">
              <CardHeader>
                <CardTitle className="h3">{t.home.features.donate.title}</CardTitle>
                <CardDescription className="body-sm">
                  {t.home.features.donate.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/${params.locale}/donate`}>{t.home.features.donate.button}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="h2 text-balance mb-4">
              {t.home.mission.title}
            </h2>
            <p className="body text-balance max-w-3xl mx-auto">
              {t.home.mission.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="h3 text-balance mb-4">
                {t.home.mission.culturalPreservation.title}
              </h3>
              <p className="body-sm text-balance">
                {t.home.mission.culturalPreservation.description}
              </p>
            </div>
            <div>
              <h3 className="h3 text-balance mb-4">
                {t.home.mission.fairTrade.title}
              </h3>
              <p className="body-sm text-balance">
                {t.home.mission.fairTrade.description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
