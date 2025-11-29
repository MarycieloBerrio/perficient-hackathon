/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Paleta profesional con tonos neutros y elegantes
                mars: {
                    bg: '#0f1419',
                    surface: '#1a1f26',
                    elevated: '#22272e',
                    border: 'rgba(99, 110, 123, 0.2)',
                },
                neon: {
                    blue: '#2563eb',      // Azul más profesional
                    cyan: '#0891b2',      // Cyan más discreto
                    green: '#059669',     // Verde corporativo
                    amber: '#d97706',     // Ámbar más suave
                    red: '#dc2626',       // Rojo más estándar
                },
                status: {
                    ok: '#059669',
                    warning: '#d97706',
                    critical: '#dc2626',
                },
                // Alias para usar con Tailwind
                'status-ok': '#059669',
                'status-warning': '#d97706',
                'status-critical': '#dc2626',
                // Theme colors usando directamente las CSS variables
                border: 'rgba(99, 110, 123, 0.15)',
                input: 'rgba(99, 110, 123, 0.08)',
                ring: 'rgba(37, 99, 235, 0.3)',
                background: '#0f1419',
                foreground: '#e6edf3',
                primary: {
                    DEFAULT: '#2563eb',
                    foreground: '#ffffff',
                },
                secondary: {
                    DEFAULT: '#4b5563',
                    foreground: '#ffffff',
                },
                destructive: {
                    DEFAULT: '#dc2626',
                    foreground: '#ffffff',
                },
                muted: {
                    DEFAULT: '#22272e',
                    foreground: '#9ca3af',
                },
                accent: {
                    DEFAULT: '#0891b2',
                    foreground: '#ffffff',
                },
                popover: {
                    DEFAULT: '#22272e',
                    foreground: '#e6edf3',
                },
                card: {
                    DEFAULT: '#1a1f26',
                    foreground: '#e6edf3',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Consolas', 'monospace'],
            },
            boxShadow: {
                'neon-sm': '0 1px 3px rgba(0, 0, 0, 0.12)',
                'neon-md': '0 4px 6px rgba(0, 0, 0, 0.15)',
                'neon-lg': '0 10px 15px rgba(0, 0, 0, 0.2)',
                'glow-cyan': '0 2px 8px rgba(8, 145, 178, 0.15)',
                'glow-green': '0 2px 8px rgba(5, 150, 105, 0.15)',
                'glow-amber': '0 2px 8px rgba(217, 119, 6, 0.15)',
                'glow-red': '0 2px 8px rgba(220, 38, 38, 0.15)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)' },
                    '100%': { boxShadow: '0 4px 8px rgba(37, 99, 235, 0.15)' },
                }
            }
        },
    },
    plugins: [],
}
