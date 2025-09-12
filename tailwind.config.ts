import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				'100': '#BAEAFC',
  				'200': '#3ABFEF',
  				'300': '#73AAD3',
  				'400': '#2A83C6',
  				'500': '#2D499B',
  				'600': '#253C82',
  				'700': '#1D2F6A',
  				'800': '#162352',
  				'900': '#0F183A',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			success: {
  				'100': '#F0F8DC',
  				'200': '#D7EBB1',
  				'300': '#BFDE85',
  				'400': '#AFD137',
  				'500': '#AFD137',
  				'600': '#789021',
  				'700': '#5C6A18',
  				'800': '#414610',
  				'900': '#272B08'
  			},
  			warning: {
  				'100': '#FFF7D1',
  				'200': '#FFEB9F',
  				'300': '#FFDE6D',
  				'400': '#FFD027',
  				'500': '#FFC700',
  				'600': '#B38F00',
  				'700': '#806700',
  				'800': '#4D4000',
  				'900': '#1A1900'
  			},
  			grey: {
  				'100': '#F3F4F6',
  				'200': '#E2E8F0',
  				'300': '#D7DEE8',
  				'400': '#AFBACA',
  				'500': '#8797AE',
  				'600': '#5E718D',
  				'700': '#576173',
  				'800': '#3C4355',
  				'900': '#272D3A'
  			},
  			danger: {
  				'100': '#FDEAE5',
  				'200': '#F9C4B8',
  				'300': '#F59D8A',
  				'400': '#F1775D',
  				'500': '#D21A0E',
  				'600': '#BB1C11',
  				'700': '#8C150D',
  				'800': '#5E0E08',
  				'900': '#300704'
  			},
  			standardWhite: '#FFFFFF',
  			standardBlack: '#000000',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar-hide")],
} satisfies Config;
