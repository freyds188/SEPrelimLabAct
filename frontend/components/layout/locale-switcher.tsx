"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  getLocaleFromPathname, 
  getLocalizedPathname, 
  getLocaleDisplayName, 
  getLocaleFlag,
  type Locale,
  locales 
} from '@/lib/i18n'

export function LocaleSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const [currentLocale, setCurrentLocale] = useState<Locale>('en')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const locale = getLocaleFromPathname(pathname)
    setCurrentLocale(locale)
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleLocaleChange = (newLocale: Locale) => {
    const newPath = getLocalizedPathname(pathname, newLocale)
    router.push(newPath)
    setIsOpen(false)
    
    // Store preference in localStorage
    localStorage.setItem('preferred-locale', newLocale)
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleDropdown()
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        className="flex items-center gap-2"
        aria-label={`Current language: ${getLocaleDisplayName(currentLocale)}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="locale-dropdown"
      >
        <span className="text-lg" aria-hidden="true">{getLocaleFlag(currentLocale)}</span>
        <span className="hidden sm:inline text-sm">
          {getLocaleDisplayName(currentLocale)}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Button>

      {isOpen && (
        <div 
          id="locale-dropdown"
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-neutral-200 z-50"
          role="listbox"
          aria-label="Language options"
        >
          <div className="py-1">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLocaleChange(locale)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 flex items-center gap-3 ${
                  currentLocale === locale ? 'bg-brand-50 text-brand-600' : 'text-neutral-700'
                }`}
                role="option"
                aria-selected={currentLocale === locale}
                aria-label={`Switch to ${getLocaleDisplayName(locale)}`}
              >
                <span className="text-lg" aria-hidden="true">{getLocaleFlag(locale)}</span>
                <span>{getLocaleDisplayName(locale)}</span>
                {currentLocale === locale && (
                  <svg
                    className="w-4 h-4 ml-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
