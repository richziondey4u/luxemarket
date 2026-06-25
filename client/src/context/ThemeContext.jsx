import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export const THEMES = {
  light: {
    id: 'light',
    label: 'Light',
    icon: '☀️',
    vars: {
      '--bg-page':     '#ffffff',
      '--bg-section':  '#f7f7f7',
      '--bg-card':     '#ffffff',
      '--bg-input':    '#ffffff',
      '--bg-muted':    '#f3f3f3',
      '--text-primary':   '#141414',
      '--text-secondary': '#3a3a3a',
      '--text-muted':     '#757575',
      '--text-subtle':    '#a0a0a0',
      '--border-light':   '#ebebeb',
      '--border-medium':  '#e0e0e0',
      '--brand':       '#4f7d52',
      '--brand-light': '#f4f7f4',
      '--brand-mid':   '#a3c4a5',
      '--brand-dark':  '#3d6440',
      '--shadow-card': '0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
      '--shadow-card-hover': '0 8px 28px rgba(0,0,0,0.1), 0 0 0 1px rgba(79,125,82,0.15)',
      '--shadow-navbar': '0 1px 0 #ebebeb, 0 2px 8px rgba(0,0,0,0.04)',
      '--overlay': 'rgba(0,0,0,0.3)',
    },
  },
  dark: {
    id: 'dark',
    label: 'Dark',
    icon: '🌙',
    vars: {
      '--bg-page':     '#0f1117',
      '--bg-section':  '#161b22',
      '--bg-card':     '#1c2128',
      '--bg-input':    '#21262d',
      '--bg-muted':    '#161b22',
      '--text-primary':   '#e6edf3',
      '--text-secondary': '#c9d1d9',
      '--text-muted':     '#8b949e',
      '--text-subtle':    '#6e7681',
      '--border-light':   '#30363d',
      '--border-medium':  '#21262d',
      '--brand':       '#3fb950',
      '--brand-light': '#0d1117',
      '--brand-mid':   '#238636',
      '--brand-dark':  '#2ea043',
      '--shadow-card': '0 1px 4px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
      '--shadow-card-hover': '0 8px 28px rgba(0,0,0,0.5), 0 0 0 1px rgba(63,185,80,0.2)',
      '--shadow-navbar': '0 1px 0 #30363d, 0 2px 8px rgba(0,0,0,0.3)',
      '--overlay': 'rgba(0,0,0,0.6)',
    },
  },
  sepia: {
    id: 'sepia',
    label: 'Sepia',
    icon: '🍂',
    vars: {
      '--bg-page':     '#fdf6e3',
      '--bg-section':  '#f5edd6',
      '--bg-card':     '#fdf6e3',
      '--bg-input':    '#ffffff',
      '--bg-muted':    '#f0e8d0',
      '--text-primary':   '#3d2b1f',
      '--text-secondary': '#5c3d2e',
      '--text-muted':     '#8b6e58',
      '--text-subtle':    '#b89a84',
      '--border-light':   '#e8d5b7',
      '--border-medium':  '#d4b896',
      '--brand':       '#7c5c2e',
      '--brand-light': '#faf0dc',
      '--brand-mid':   '#c4956a',
      '--brand-dark':  '#5c3d1e',
      '--shadow-card': '0 1px 4px rgba(100,60,20,0.08)',
      '--shadow-card-hover': '0 8px 28px rgba(100,60,20,0.14)',
      '--shadow-navbar': '0 1px 0 #e8d5b7, 0 2px 8px rgba(100,60,20,0.06)',
      '--overlay': 'rgba(60,30,10,0.3)',
    },
  },
  ocean: {
    id: 'ocean',
    label: 'Ocean',
    icon: '🌊',
    vars: {
      '--bg-page':     '#0a1628',
      '--bg-section':  '#0d1f3c',
      '--bg-card':     '#112240',
      '--bg-input':    '#1a2f52',
      '--bg-muted':    '#0d1f3c',
      '--text-primary':   '#ccd6f6',
      '--text-secondary': '#a8b2d8',
      '--text-muted':     '#8892b0',
      '--text-subtle':    '#495670',
      '--border-light':   '#1e3a5f',
      '--border-medium':  '#172a4a',
      '--brand':       '#64ffda',
      '--brand-light': '#0d1f3c',
      '--brand-mid':   '#0a7c5c',
      '--brand-dark':  '#00e5c0',
      '--shadow-card': '0 1px 4px rgba(0,0,0,0.5)',
      '--shadow-card-hover': '0 8px 28px rgba(0,0,0,0.6), 0 0 0 1px rgba(100,255,218,0.15)',
      '--shadow-navbar': '0 1px 0 #1e3a5f, 0 2px 8px rgba(0,0,0,0.4)',
      '--overlay': 'rgba(0,0,0,0.6)',
    },
  },
  rose: {
    id: 'rose',
    label: 'Rose',
    icon: '🌹',
    vars: {
      '--bg-page':     '#fff5f7',
      '--bg-section':  '#ffeef1',
      '--bg-card':     '#ffffff',
      '--bg-input':    '#ffffff',
      '--bg-muted':    '#ffeef1',
      '--text-primary':   '#1a0a0f',
      '--text-secondary': '#3d1a24',
      '--text-muted':     '#8b4a5c',
      '--text-subtle':    '#c4849a',
      '--border-light':   '#f8d0da',
      '--border-medium':  '#f0b8c8',
      '--brand':       '#c0395a',
      '--brand-light': '#fff0f3',
      '--brand-mid':   '#e87a96',
      '--brand-dark':  '#9c2645',
      '--shadow-card': '0 1px 4px rgba(160,40,80,0.07)',
      '--shadow-card-hover': '0 8px 28px rgba(160,40,80,0.13)',
      '--shadow-navbar': '0 1px 0 #f8d0da, 0 2px 8px rgba(160,40,80,0.06)',
      '--overlay': 'rgba(80,10,30,0.3)',
    },
  },
}

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem('lm_theme') || 'light'
  })

  const theme = THEMES[themeId] || THEMES.light

  useEffect(() => {
    const root = document.documentElement
    Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v))
    root.setAttribute('data-theme', themeId)
    localStorage.setItem('lm_theme', themeId)
  }, [themeId, theme])

  return (
    <ThemeContext.Provider value={{ themeId, setThemeId, theme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider')
  return ctx
}