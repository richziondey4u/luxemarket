import { useState } from 'react'
import { Palette, Check } from 'lucide-react'
import { useTheme, THEMES } from '../../context/ThemeContext.jsx'

export default function ThemePicker() {
  const { themeId, setThemeId } = useTheme()
  const [open, setOpen] = useState(false)

  const swatches = {
    light:  '#4f7d52',
    dark:   '#3fb950',
    sepia:  '#7c5c2e',
    ocean:  '#64ffda',
    rose:   '#c0395a',
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        title="Change theme"
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '7px 12px', borderRadius: '8px',
          backgroundColor: 'var(--bg-card)',
          border: '1.5px solid var(--border-medium)',
          color: 'var(--text-secondary)',
          cursor: 'pointer', transition: 'all 0.2s',
          fontSize: '0.78rem', fontWeight: '600',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.color = 'var(--brand)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
      >
        <Palette style={{ width: '15px', height: '15px' }} />
        <span className="theme-label">{THEMES[themeId]?.icon} {THEMES[themeId]?.label}</span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 90 }}
            onClick={() => setOpen(false)}
          />
          {/* Dropdown */}
          <div style={{
            position: 'absolute', right: 0, top: 'calc(100% + 6px)',
            width: '200px', zIndex: 100,
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: '12px', padding: '6px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }}>
            <p style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '6px 10px 8px' }}>
              Choose Theme
            </p>
            {Object.values(THEMES).map(t => (
              <button
                key={t.id}
                onClick={() => { setThemeId(t.id); setOpen(false) }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 10px', borderRadius: '8px', border: 'none',
                  backgroundColor: themeId === t.id ? 'var(--brand-light)' : 'transparent',
                  cursor: 'pointer', transition: 'background-color 0.15s',
                }}
                onMouseEnter={e => { if (themeId !== t.id) e.currentTarget.style.backgroundColor = 'var(--bg-muted)' }}
                onMouseLeave={e => { if (themeId !== t.id) e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                {/* Swatch */}
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%',
                  backgroundColor: swatches[t.id],
                  border: '2px solid var(--border-light)',
                  flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {themeId === t.id && <Check style={{ width: '11px', height: '11px', color: '#fff' }} />}
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                  {t.icon} {t.label}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 640px) {
          .theme-label { display: none; }
        }
      `}</style>
    </div>
  )
}