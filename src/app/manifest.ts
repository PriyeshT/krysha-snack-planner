import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             "Krysha's Snack Kingdom ✨",
    short_name:       'Snack Kingdom',
    description:      'Magical snack planner for Krysha and Daddy!',
    start_url:        '/',
    display:          'standalone',
    background_color: '#F3E8FF',
    theme_color:      '#6B21A8',
    orientation:      'portrait',
    icons: [
      {
        src:     '/icon-192.svg',
        sizes:   '192x192',
        type:    'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src:     '/icon-512.svg',
        sizes:   '512x512',
        type:    'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
