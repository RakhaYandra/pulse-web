export function Topbar({ email, onLogout }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <h1>Pulse</h1>
        <div className="topbar-user">
          <span className="topbar-email">{email}</span>{' '}
          <button className="logout" onClick={onLogout}>
            logout
          </button>
        </div>
      </div>
    </header>
  )
}
