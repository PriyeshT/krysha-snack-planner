import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        castle: {
          purple:         '#6B21A8',
          'purple-light': '#A855F7',
          'purple-pale':  '#F3E8FF',
          gold:           '#F59E0B',
          'gold-light':   '#FDE68A',
          pink:           '#EC4899',
          'pink-light':   '#FBCFE8',
          'pink-pale':    '#FDF2F8',
          blue:           '#3B82F6',
          teal:           '#14B8A6',
          cream:          '#FFFBEB',
          sparkle:        '#FCD34D',
        },
      },
      fontFamily: {
        magic: ['"Fredoka One"', 'cursive'],
        body:  ['"Nunito"', 'sans-serif'],
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
          '50%':      { opacity: '0.6', transform: 'scale(1.3) rotate(180deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        starBurst: {
          '0%':   { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%':  { transform: 'scale(1.4) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        bounce_magic: {
          '0%, 100%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
          '50%':      { transform: 'translateY(-12px)', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%':      { transform: 'rotate(3deg)' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        sparkle:      'sparkle 2s ease-in-out infinite',
        float:        'float 3s ease-in-out infinite',
        starBurst:    'starBurst 0.4s ease-out forwards',
        shimmer:      'shimmer 2s linear infinite',
        bounce_magic: 'bounce_magic 1s infinite',
        wiggle:       'wiggle 0.3s ease-in-out',
        fadeInUp:     'fadeInUp 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}

export default config
