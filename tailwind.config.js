/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base colors from design system
        'rich-black': '#0f131a',
        'gunmetal': '#232c3d',
        'prussian-blue': '#273043',
        'cool-gray': '#9197ae',
        'mint-cream': '#eff6ee',
        'imperial-red': '#f02d3a',
        'rojo': '#dd0426',
        
        // Semantic color mapping for shadcn/ui
        background: '#0f131a',
        foreground: '#eff6ee',
        card: {
          DEFAULT: '#232c3d',
          foreground: '#eff6ee',
        },
        popover: {
          DEFAULT: '#273043',
          foreground: '#eff6ee',
        },
        primary: {
          DEFAULT: '#273043',
          foreground: '#eff6ee',
        },
        secondary: {
          DEFAULT: '#232c3d',
          foreground: '#eff6ee',
        },
        muted: {
          DEFAULT: '#232c3d',
          foreground: '#9197ae',
        },
        accent: {
          DEFAULT: '#273043',
          foreground: '#eff6ee',
        },
        destructive: {
          DEFAULT: '#f02d3a',
          foreground: '#eff6ee',
        },
        border: '#273043',
        input: '#232c3d',
        ring: '#9197ae',
        
        // Additional utility colors
        success: '#10b981',
        warning: '#f59e0b',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Mona Sans', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        button: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
