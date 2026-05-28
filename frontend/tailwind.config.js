module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        urbanist: ['Urbanist', 'sans-serif'],
      },
      colors: {
        primary: '#636BAB',
        'primary-light': '#DEE2FF',
        'soft-pink': '#EFD3D7',
        'soft-purple': '#CBC0D3',
        'soft-blue': '#eff6ff',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
};