'use client'

import { ButtonHTMLAttributes, ReactNode, useState } from 'react'

interface MagicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  loading?: boolean
  fullWidth?: boolean
}

const variants = {
  primary:   'bg-gradient-to-r from-castle-purple to-castle-pink text-white shadow-lg hover:shadow-castle-purple/40',
  secondary: 'bg-gradient-to-r from-castle-gold to-castle-teal text-white shadow-lg hover:shadow-castle-gold/40',
  danger:    'bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-lg hover:shadow-rose-400/40',
}

export default function MagicButton({
  children,
  variant = 'primary',
  loading = false,
  fullWidth = false,
  className = '',
  onClick,
  ...rest
}: MagicButtonProps) {
  const [bounce, setBounce] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setBounce(true)
    setTimeout(() => setBounce(false), 400)
    onClick?.(e)
  }

  return (
    <button
      {...rest}
      onClick={handleClick}
      disabled={loading || rest.disabled}
      className={[
        'relative overflow-hidden font-magic rounded-2xl px-6 py-3',
        'min-h-[44px] min-w-[44px]',
        'text-lg tracking-wide',
        'transition-all duration-200',
        'active:scale-95',
        bounce ? 'animate-bounce_magic' : 'hover:-translate-y-0.5',
        variants[variant],
        fullWidth ? 'w-full' : '',
        loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
    >
      {/* Shimmer overlay */}
      <span
        aria-hidden
        className="absolute inset-0 shimmer opacity-30 pointer-events-none"
      />
      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <>
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Magic is happening…
          </>
        ) : (
          children
        )}
      </span>
    </button>
  )
}
