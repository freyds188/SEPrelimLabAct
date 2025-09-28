'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export interface GlossaryItem {
  term: string
  definition: string
  category?: string
  image?: string
  longDescription?: string
}

interface GlossaryModalProps {
  open: boolean
  item?: GlossaryItem | null
  onClose: () => void
}

export function GlossaryModal({ open, item, onClose }: GlossaryModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !item) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-200 opacity-100"
        onClick={onClose}
      />

      {/* Modal card */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden transform transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header image */}
        {item.image && (
          <div className="relative h-56 w-full">
            <Image
              src={item.image}
              alt={item.term}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">{item.term}</h3>
              {item.category && (
                <Badge variant="outline" className="mt-2 text-xs border-brand-200 text-brand-700">
                  {item.category}
                </Badge>
              )}
            </div>
            <button
              aria-label="Close"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-gray-700 leading-relaxed">
            {item.longDescription || item.definition}
          </p>
        </div>
      </div>
    </div>
  )
}


