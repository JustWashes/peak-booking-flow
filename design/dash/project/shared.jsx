// Shared primitives, icons, and chrome (sidebar + topbar) for both dashboards.
// Icons are inline SVGs — crisp at any size, no dependencies.

const Icon = ({ name, size = 18, stroke = 2, color = "currentColor" }) => {
  const common = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: color, strokeWidth: stroke,
    strokeLinecap: "round", strokeLinejoin: "round"
  };
  switch (name) {
    case "home": return <svg {...common}><path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/></svg>;
    case "calendar": return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>;
    case "doc": return <svg {...common}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h6"/></svg>;
    case "dollar": return <svg {...common}><path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
    case "car": return <svg {...common}><path d="M5 11l2-5h10l2 5M3 16h18M5 11h14v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"/><circle cx="7.5" cy="16.5" r="1.5"/><circle cx="16.5" cy="16.5" r="1.5"/></svg>;
    case "gear": return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>;
    case "check": return <svg {...common}><path d="M5 12l5 5 9-10"/></svg>;
    case "check-circle": return <svg {...common}><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><path d="M22 4L12 14.01l-3-3"/></svg>;
    case "x": return <svg {...common}><path d="M18 6L6 18M6 6l12 12"/></svg>;
    case "plus": return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
    case "chevron-right": return <svg {...common}><path d="M9 6l6 6-6 6"/></svg>;
    case "chevron-down": return <svg {...common}><path d="M6 9l6 6 6-6"/></svg>;
    case "arrow-right": return <svg {...common}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case "arrow-left": return <svg {...common}><path d="M19 12H5M11 19l-7-7 7-7"/></svg>;
    case "phone": return <svg {...common}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></svg>;
    case "droplet": return <svg {...common}><path d="M12 2l7 8.5a7 7 0 1 1-14 0z"/></svg>;
    case "pin": return <svg {...common}><path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>;
    case "alert": return <svg {...common}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h0"/></svg>;
    case "edit": return <svg {...common}><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>;
    case "trash": return <svg {...common}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>;
    case "user-check": return <svg {...common}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M17 11l2 2 4-4"/></svg>;
    case "megaphone": return <svg {...common}><path d="M3 11v2a2 2 0 0 0 2 2h1l3 5h2v-3l8 3V4l-8 3H6a2 2 0 0 0-2 2z"/></svg>;
    case "card": return <svg {...common}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/></svg>;
    case "headset": return <svg {...common}><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14h3v5H5a1 1 0 0 1-1-1zM20 14h-3v5h2a1 1 0 0 0 1-1z"/></svg>;
    case "bell": return <svg {...common}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/></svg>;
    case "clock": return <svg {...common}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
    case "star": return <svg {...common}><path d="M12 2l3.1 6.3 7 1-5 4.9 1.2 7-6.3-3.3L5.7 21l1.2-7L2 9.3l7-1z"/></svg>;
    case "sparkle": return <svg {...common}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>;
    case "search": return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>;
    case "download": return <svg {...common}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>;
    default: return null;
  }
};

function Logo() {
  return (
    <div className="jw-brand">
      <div className="jw-brand-logo">🧽</div>
      <div className="jw-brand-name">JustWashes</div>
    </div>
  );
}

function Sidebar({ items, activeKey }) {
  return (
    <aside className="jw-sidebar">
      <Logo />
      <nav className="jw-nav">
        {items.map(it => (
          <div key={it.key} className={`jw-nav-item ${activeKey === it.key ? 'active' : ''}`}>
            <span className="jw-nav-icon"><Icon name={it.icon} size={17} stroke={1.8} /></span>
            <span>{it.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}

function Topbar({ userName = "Joey", initial = "J" }) {
  return (
    <header className="jw-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginLeft: 'auto' }}>
        <nav className="jw-topnav">
          <a>Home</a><a>Service</a><a>How it works</a><a>Pricing</a><a>Contact</a>
        </nav>
        <div className="jw-user">
          <div className="jw-avatar">{initial}</div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Hello, {userName}</div>
          <Icon name="chevron-down" size={14} />
        </div>
      </div>
    </header>
  );
}

function Avatar({ initial, tone = "orange", size }) {
  const bg = tone === "blue" ? "bg-blue" : tone === "green" ? "bg-green" : tone === "purple" ? "bg-purple" : tone === "slate" ? "bg-slate" : "";
  return <div className={`jw-avatar ${size || ''} ${bg}`}>{initial}</div>;
}

function Chip({ tone = "slate", children, dot }) {
  return (
    <span className={`jw-chip ${tone}`}>
      {dot && <span className="jw-dot" style={{ background: 'currentColor' }} />}
      {children}
    </span>
  );
}

Object.assign(window, { Icon, Logo, Sidebar, Topbar, Avatar, Chip });
