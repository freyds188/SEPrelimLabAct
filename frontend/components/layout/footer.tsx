"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { getLocaleFromPathname, getTranslations, getLocalizedPathname } from "@/lib/i18n"

export function Footer() {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const t = getTranslations(locale)

  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-foreground mb-4">Weavers</h3>
            <p className="text-muted-foreground mb-4">
              {t.footer.description}
            </p>
            <div className="flex space-x-4">
                               <Link href={getLocalizedPathname("/donate", locale)} className="text-brand-600 hover:text-brand-700">
                {t.nav.donate}
              </Link>
                               <Link href={getLocalizedPathname("/about", locale)} className="text-brand-600 hover:text-brand-700">
                {t.nav.about}
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">{t.footer.shop.title}</h4>
            <ul className="space-y-2">
              <li>
                                   <Link href={getLocalizedPathname("/shop", locale)} className="text-neutral-600 hover:text-neutral-900">
                  {t.footer.shop.allProducts}
                </Link>
              </li>
              <li>
                                   <Link href={getLocalizedPathname("/weavers", locale)} className="text-neutral-600 hover:text-neutral-900">
                  {t.footer.shop.meetWeavers}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">{t.footer.learn.title}</h4>
            <ul className="space-y-2">
              <li>
                                   <Link href={getLocalizedPathname("/stories", locale)} className="text-neutral-600 hover:text-neutral-900">
                  {t.footer.learn.stories}
                </Link>
              </li>
              <li>
                                   <Link href={getLocalizedPathname("/glossary", locale)} className="text-neutral-600 hover:text-neutral-900">
                  {t.footer.learn.glossary}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8">
                         <p className="text-center text-sm text-neutral-500">
            {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
