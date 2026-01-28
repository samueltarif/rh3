import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      zIndex: {
        // Base levels
        '1': '1',
        '2': '2',
        '3': '3',
        
        // Elevated elements
        '100': '100',
        '110': '110',
        '120': '120',
        
        // Overlay elements
        '200': '200',
        '210': '210',
        
        // Modal system
        '1000': '1000',
        '1010': '1010',
        
        // Notification system
        '1100': '1100',
        
        // Critical system
        '9000': '9000',
        '9100': '9100',
        '9200': '9200',
        '9999': '9999',
      },
      height: {
        'dvh': '100dvh', // Dynamic viewport height
      },
      maxHeight: {
        'dvh': '100dvh',
      },
      minHeight: {
        'dvh': '100dvh',
      }
    }
  },
  plugins: [],
} satisfies Config
