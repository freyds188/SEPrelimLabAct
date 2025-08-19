"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LocaleSwitcher } from "./locale-switcher"
import { UserMenu } from "./user-menu"
import { getLocaleFromPathname, getTranslations, getLocalizedPathname } from "@/lib/i18n"

const navigation = [
  { name: "home", href: "/" },
  { name: "shop", href: "/shop" },
  { name: "stories", href: "/stories" },
  { name: "donate", href: "/donate" },
  { name: "glossary", href: "/glossary" },
  { name: "weavers", href: "/weavers" },
  { name: "about", href: "/about" },
]

export function Navbar() {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const t = getTranslations(locale)

  return (
    <nav className="bg-white border-b border-neutral-200 shadow-sm" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              href={getLocalizedPathname("/", locale)} 
              className="flex-shrink-0 flex items-center"
              aria-label="Weavers - Home"
            >
              <span className="text-xl font-bold text-brand-600">Weavers</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8" role="menubar">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={getLocalizedPathname(item.href, locale)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-brand-600",
                  pathname === getLocalizedPathname(item.href, locale)
                    ? "text-brand-600"
                    : "text-neutral-600"
                )}
                role="menuitem"
                aria-current={pathname === getLocalizedPathname(item.href, locale) ? "page" : undefined}
              >
                {t.nav[item.name as keyof typeof t.nav]}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <LocaleSwitcher />
            <UserMenu />
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm"
                aria-label="Open navigation menu"
                aria-expanded="false"
                aria-controls="mobile-menu"
              >
                <span className="sr-only">Open menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
