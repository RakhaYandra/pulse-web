export function Topbar({ email, onLogout }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <h1>Pulse</h1>
        <div>
          {email}{' '}
          <button className="logout" onClick={onLogout}>
            logout
          </button>
        </div>
      </div>
    </header>
  )
}
