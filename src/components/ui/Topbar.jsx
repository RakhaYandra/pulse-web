import { PulseMark } from './PulseMark.jsx'
import { ThemeToggle } from './ThemeToggle.jsx'

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
          {theme && <ThemeToggle theme={theme} onToggle={onToggleTheme} />}
          <button className="logout" onClick={onLogout}>
            logout
          </button>
        </div>
      </div>
    </header>
  )
}
