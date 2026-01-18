/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#00f0ff',
        secondary: '#ff00aa',
        accent: '#00ff88',
        dark: '#0a0a1a',
        darker: '#050510',
        'card-bg': '#111128',
        text: '#ffffff',
        'text-secondary': '#a0a0c0',
        danger: '#ff2a6d',
        warning: '#ffcc00',
        success: '#00ff88',
      },
      backgroundImage: {
        'gradient-cyber': 'linear-gradient(135deg, var(--darker) 0%, var(--dark) 100%)',
        'gradient-primary': 'linear-gradient(45deg, var(--primary), var(--secondary), var(--accent))',
        'gradient-card': 'radial-gradient(circle at 20% 30%, rgba(0, 240, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 0, 170, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(0, 255, 136, 0.1) 0%, transparent 50%)',
      },
      fontFamily: {
        'sans': ['Inter', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      animation: {
        'hologram-rotate': 'hologram-rotate 8s linear infinite',
        'hologram-pulse': 'hologram-pulse 3s ease-in-out infinite alternate',
        'hologram-inner': 'hologram-inner 4s linear infinite',
        'loading-shine': 'loading-shine 2s infinite',
        'dot-pulse': 'dot-pulse 1.5s infinite ease-in-out',
        'pulse': 'pulse 2s infinite',
        'slide-in': 'slideIn 0.3s ease',
        'fade-out': 'fadeOut 0.3s ease 2.7s',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        'hologram-rotate': {
          '0%': { transform: 'rotateY(0deg) rotateX(0deg)' },
          '100%': { transform: 'rotateY(360deg) rotateX(360deg)' },
        },
        'hologram-pulse': {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(1.05)', opacity: '1' },
        },
        'hologram-inner': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'loading-shine': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'dot-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0.7' },
        },
        'pulse': {
          '0%': { boxShadow: '0 0 0 0 rgba(0, 240, 255, 0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(0, 240, 255, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(0, 240, 255, 0)' },
        },
        'slideIn': {
          'from': { transform: 'translateX(100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        'fadeOut': {
          'from': { opacity: '1' },
          'to': { opacity: '0' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'cyber': '0 5px 15px rgba(0, 0, 0, 0.5)',
        'cyber-glow': '0 0 15px rgba(0, 240, 255, 0.3)',
        'cyber-strong': '0 0 20px rgba(0, 240, 255, 0.5)',
        'cyber-inner': 'inset 0 0 10px rgba(0, 240, 255, 0.1)',
        'card': '0 10px 30px rgba(0, 0, 0, 0.3)',
      },
      borderColor: {
        'cyber': 'rgba(0, 240, 255, 0.3)',
        'cyber-light': 'rgba(0, 240, 255, 0.2)',
      },
      borderRadius: {
        'cyber': '15px',
        'cyber-sm': '8px',
        'cyber-lg': '20px',
        'cyber-xl': '30px',
      },
      screens: {
        'xs': '480px',
        '3xl': '1920px',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        '1000': '1000',
        '2000': '2000',
        '9999': '9999',
      },
      minHeight: {
        'screen-80': '80vh',
        'screen-90': '90vh',
      },
      maxHeight: {
        'screen-80': '80vh',
        'screen-90': '90vh',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      gridTemplateColumns: {
        'auto-fit-300': 'repeat(auto-fit, minmax(300px, 1fr))',
        'auto-fit-250': 'repeat(auto-fit, minmax(250px, 1fr))',
        'auto-fill-150': 'repeat(auto-fill, minmax(150px, 1fr))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
    function({ addUtilities }) {
      addUtilities({
        '.text-gradient': {
          'background': 'linear-gradient(45deg, var(--primary), var(--secondary), var(--accent))',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
        '.backdrop-blur-cyber': {
          'backdrop-filter': 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
        },
        '.backdrop-blur-cyber-lg': {
          'backdrop-filter': 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
        },
        '.scrollbar-cyber': {
          'scrollbar-width': 'thin',
          'scrollbar-color': 'var(--primary) transparent',
        },
        '.scrollbar-cyber::-webkit-scrollbar': {
          'width': '8px',
        },
        '.scrollbar-cyber::-webkit-scrollbar-track': {
          'background': 'transparent',
        },
        '.scrollbar-cyber::-webkit-scrollbar-thumb': {
          'background-color': 'var(--primary)',
          'border-radius': '20px',
        },
        '.glass-effect': {
          'background': 'rgba(10, 10, 26, 0.95)',
          'backdrop-filter': 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(0, 240, 255, 0.3)',
        },
        '.glass-effect-light': {
          'background': 'rgba(255, 255, 255, 0.05)',
          'backdrop-filter': 'blur(5px)',
          '-webkit-backdrop-filter': 'blur(5px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.hologram-effect': {
          'background': 'radial-gradient(circle at 30% 30%, rgba(0, 240, 255, 0.8) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(255, 0, 170, 0.6) 0%, transparent 50%)',
          'box-shadow': '0 0 50px rgba(0, 240, 255, 0.5), inset 0 0 50px rgba(0, 240, 255, 0.2)',
        },
        '.cyber-border': {
          'border': '1px solid rgba(0, 240, 255, 0.3)',
          'position': 'relative',
          'overflow': 'hidden',
        },
        '.cyber-border::before': {
          'content': '""',
          'position': 'absolute',
          'top': '0',
          'left': '-100%',
          'width': '100%',
          'height': '100%',
          'background': 'linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.2), transparent)',
          'transition': 'left 0.5s',
        },
        '.cyber-border:hover::before': {
          'left': '100%',
        },
        '.text-cyber': {
          'text-shadow': '0 0 10px rgba(0, 240, 255, 0.7)',
        },
        '.text-cyber-secondary': {
          'text-shadow': '0 0 10px rgba(255, 0, 170, 0.7)',
        },
        '.text-cyber-accent': {
          'text-shadow': '0 0 10px rgba(0, 255, 136, 0.7)',
        },
        '.floating': {
          'animation': 'floating 3s ease-in-out infinite',
        },
        '@keyframes floating': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      })
    },
  ],
}
