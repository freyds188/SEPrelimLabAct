import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from './lib/i18n'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // Handle admin routes - redirect to default locale if no locale
  if (pathname.startsWith('/admin') && !pathnameHasLocale) {
    const locale = defaultLocale
    request.nextUrl.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(request.nextUrl)
  }

  if (pathnameHasLocale) return

  // Redirect to default locale if no locale is present
  const locale = defaultLocale
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and static assets
    '/((?!_next|api|favicon.ico|images|.*\\.(?:jpg|jpeg|png|gif|webp|svg|ico|css|js)).*)',
  ],
}
