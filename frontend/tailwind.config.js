/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      colors: {
        base: {
          950: '#070d0c',
          900: '#0b1414',
          800: '#0f1c1b',
          700: '#152726',
          600: '#1d3634'
        },
        signal: {
          green: '#2dd4a7',
          cyan: '#38bdf8',
          amber: '#f5b942',
          red: '#f2545b'
        }
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(45,212,167,0.15), 0 8px 30px -8px rgba(45,212,167,0.25)',
        glowAmber: '0 0 0 1px rgba(245,185,66,0.2), 0 8px 30px -8px rgba(245,185,66,0.3)',
        glowRed: '0 0 0 1px rgba(242,84,91,0.25), 0 8px 30px -8px rgba(242,84,91,0.35)'
      },
      backgroundImage: {
        'grid-fade': 'radial-gradient(circle at 20% 20%, rgba(45,212,167,0.08), transparent 40%), radial-gradient(circle at 80% 0%, rgba(56,189,248,0.08), transparent 40%)'
      }
    }
  },
  plugins: []
}
