import { PulseMark } from './PulseMark.jsx'

export function Topbar({ email, onLogout, theme, onToggleTheme }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <h1 className="brand">
          <span className="brand-mark">
            <PulseMark />
          </span>
          Pulse
        </h1>
        <div className="topbar-user">
          <span className="topbar-email">{email}</span>{' '}
          {theme && (
            <button
              className="link"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          )}
          <button className="logout" onClick={onLogout}>
            logout
          </button>
        </div>
      </div>
    </header>
  )
}
