/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./*.html"],
	theme: {
		extend: {
			fontFamily: {
				stealth: ['stealth57', 'sans-serif'],
			},
			colors: {
				bg: '#1A1A1A',
				neonBlue: '#00bfff',
				neonGreen: '#00db28',
				neonPink: '#ff7aa0',
				offWhite: '#d0d0d0',
			},
			boxShadow: {
				neonBlue: '0 0 10px rgba(0, 191, 255, 0.7)',
				neonGreen: '0 0 10px rgba(26, 189, 1, 0.7), 0 0 20px rgba(1, 215, 215, 0.59)',
				neonPink: '0 0 10px rgba(243, 1, 150, 0.7), 0 0 20px rgba(208, 1, 111, 0.654)',
			}
		},
	},
	plugins: [require('@tailwindcss/typography')],
};
