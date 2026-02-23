'use client'

import { useState } from 'react'

interface StarRatingProps {
  value:    number  // 0–5
  onChange: (rating: number) => void
  readonly?: boolean
  size?:    'sm' | 'md' | 'lg'
}

const sizes = { sm: 'text-xl', md: 'text-3xl', lg: 'text-4xl' }

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = 'md',
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const [burst, setBurst]     = useState(0)

  const handleClick = (star: number) => {
    if (readonly) return
    setBurst(star)
    onChange(value === star ? 0 : star)   // tap same star → unrate
    setTimeout(() => setBurst(0), 500)
  }

  const display = readonly ? value : (hovered || value)

  return (
    <div
      className="flex gap-1 items-center"
      onMouseLeave={() => !readonly && setHovered(0)}
      aria-label={`Rating: ${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          disabled={readonly}
          className={[
            sizes[size],
            'min-h-[44px] min-w-[44px] flex items-center justify-center',
            'transition-transform duration-150',
            !readonly ? 'cursor-pointer hover:scale-125 active:scale-90' : 'cursor-default',
            burst === star ? 'animate-starBurst' : '',
          ].join(' ')}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          {star <= display ? '⭐' : '☆'}
        </button>
      ))}
    </div>
  )
}
