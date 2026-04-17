/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream:          '#E8E0D4',
        'cream-light':  '#F0EBE3',
        'cream-dark':   '#D6CFC3',
        surface:        '#EDE7DD',
        teal:           '#2A9D8F',
        'teal-dark':    '#1E7A6E',
        'teal-light':   '#D4F0EC',
        charcoal:       '#2D3436',
        'charcoal-60':  '#636E72',
        'charcoal-40':  '#95A5A6',
        rose:           '#E17055',
        'rose-light':   '#FDEAE5',
        amber:          '#FDCB6E',
        'amber-light':  '#FFF8E1',
        emerald:        '#00B894',
        'emerald-light':'#E0F7F1',
      },
      fontFamily: {
        display: ['"Outfit"', '"Inter"', 'system-ui', 'sans-serif'],
        body:    ['"Inter"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'display-xl': ['3.25rem', { lineHeight: '1.1',  letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-lg': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['1.625rem',{ lineHeight: '1.2',  letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-sm': ['1.175rem',{ lineHeight: '1.3',  letterSpacing: '-0.01em', fontWeight: '600' }],
      },
      boxShadow: {
        'neu':      '6px 6px 12px #C8C0B4, -6px -6px 12px #FFFFFF',
        'neu-sm':   '3px 3px 6px #C8C0B4, -3px -3px 6px #FFFFFF',
        'neu-xs':   '2px 2px 4px #C8C0B4, -2px -2px 4px #FFFFFF',
        'neu-inset':'inset 3px 3px 6px #C8C0B4, inset -3px -3px 6px #FFFFFF',
        'neu-inset-sm':'inset 2px 2px 4px #C8C0B4, inset -2px -2px 4px #FFFFFF',
        'neu-deep': '10px 10px 20px #C8C0B4, -10px -10px 20px #FFFFFF',
        'neu-hover':'8px 8px 16px #C8C0B4, -8px -8px 16px #FFFFFF',
      },
      borderRadius: {
        'sm':  '8px',
        'md':  '14px',
        'lg':  '20px',
        'xl':  '28px',
        '2xl': '36px',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up':    'fade-up 0.5s ease-out both',
        'fade-in':    'fade-in 0.3s ease both',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'float':      'float 3s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
}
