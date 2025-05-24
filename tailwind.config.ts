
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Pet-friendly color palette without yellow
				'pet-green': {
					50: 'rgb(240 253 244)',
					100: 'rgb(220 252 231)',
					200: 'rgb(187 247 208)',
					300: 'rgb(134 239 172)',
					400: 'rgb(74 222 128)',
					500: 'rgb(34 197 94)',
					600: 'rgb(22 163 74)',
					700: 'rgb(21 128 61)',
					800: 'rgb(22 101 52)',
					900: 'rgb(20 83 45)',
				},
				'pet-blue': {
					50: 'rgb(239 246 255)',
					100: 'rgb(219 234 254)',
					200: 'rgb(191 219 254)',
					300: 'rgb(147 197 253)',
					400: 'rgb(96 165 250)',
					500: 'rgb(59 130 246)',
					600: 'rgb(37 99 235)',
					700: 'rgb(29 78 216)',
					800: 'rgb(30 64 175)',
					900: 'rgb(30 58 138)',
				},
				'pet-brown': {
					50: 'rgb(250 250 249)',
					100: 'rgb(245 245 244)',
					200: 'rgb(231 229 228)',
					300: 'rgb(214 211 209)',
					400: 'rgb(168 162 158)',
					500: 'rgb(120 113 108)',
					600: 'rgb(87 83 78)',
					700: 'rgb(68 64 60)',
					800: 'rgb(41 37 36)',
					900: 'rgb(28 25 23)',
				},
				'pet-orange': {
					50: 'rgb(255 247 237)',
					100: 'rgb(255 237 213)',
					200: 'rgb(254 215 170)',
					300: 'rgb(253 186 116)',
					400: 'rgb(251 146 60)',
					500: 'rgb(249 115 22)',
					600: 'rgb(234 88 12)',
					700: 'rgb(194 65 12)',
					800: 'rgb(154 52 18)',
					900: 'rgb(124 45 18)',
				},
				'pet-teal': {
					50: 'rgb(240 253 250)',
					100: 'rgb(204 251 241)',
					200: 'rgb(153 246 228)',
					300: 'rgb(94 234 212)',
					400: 'rgb(45 212 191)',
					500: 'rgb(20 184 166)',
					600: 'rgb(13 148 136)',
					700: 'rgb(15 118 110)',
					800: 'rgb(17 94 89)',
					900: 'rgb(19 78 74)',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in-right': {
					'0%': {
						transform: 'translateX(100%)'
					},
					'100%': {
						transform: 'translateX(0)'
					}
				},
				'bounce-subtle': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-5px)'
					}
				},
				'pulse-slow': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.8'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'bounce-subtle': 'bounce-subtle 2s infinite',
				'pulse-slow': 'pulse-slow 3s infinite'
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
			},
			boxShadow: {
				'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
				'medium': '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
				'strong': '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
