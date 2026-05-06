// Customer Dashboard — full hi-fi, interactive
// Renders inside <div id="customer-root"></div>

const navCustomer = [
  { key: 'dashboard', label: 'Dashboard', icon: 'home' },
  { key: 'book', label: 'Book a Wash', icon: 'calendar' },
  { key: 'bookings', label: 'Manage Bookings', icon: 'doc' },
  { key: 'subscription', label: 'Manage Subscription', icon: 'dollar' },
  { key: 'vehicles', label: 'My Vehicles', icon: 'car' },
  { key: 'account', label: 'Account', icon: 'gear' },
];

function WashInProgress() {
  const [stepIndex, setStepIndex] = React.useState(2); // On the Way
  const steps = [
    { key: 'confirmed', label: 'Confirmed', icon: 'check' },
    { key: 'way', label: 'On the Way', icon: 'car' },
    { key: 'arrived', label: 'Arrived', icon: 'pin' },
    { key: 'washing', label: 'Washing', icon: 'droplet' },
    { key: 'done', label: 'Complete', icon: 'sparkle' },
  ];
  const pct = (stepIndex / (steps.length - 1)) * 84;

  return (
    <div className="jw-card navy" style={{ padding: 24, borderRadius: 16, marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span className="jw-dot" style={{ background: '#23B7EC', boxShadow: '0 0 0 4px rgba(35,183,236,0.25)' }}/>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Wash In Progress</div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Alex J. · 2022 Toyota Camry · <span style={{color:'#9DE3F7'}}>#JW-3041</span></div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11.5, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.6 }}>ETA</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>12 min</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, background: 'rgba(255,255,255,0.05)', padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', maxWidth: 320 }}>
        <Avatar initial="M" tone="orange" />
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Marcus T.</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>On the way · 2.4 mi out</div>
        </div>
        <button className="jw-btn sm" style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.18)' }}>
          <Icon name="phone" size={13} /> Call
        </button>
      </div>

      <div className="jw-timeline">
        <div className="jw-timeline-line" />
        <div className="jw-timeline-line-fill" style={{ width: `${pct}%` }}/>
        {steps.map((s, i) => {
          const status = i < stepIndex ? 'done' : i === stepIndex ? 'active' : 'upcoming';
          return (
            <div key={s.key} className="jw-timeline-step">
              <div className={`jw-step-circle ${status === 'done' ? 'done' : status === 'active' ? 'active' : ''}`}>
                {status === 'done' ? <Icon name="check" size={18} stroke={2.5}/> : <Icon name={s.icon} size={16} />}
              </div>
              <div className={`jw-step-label ${status}`}>{s.label}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
        <a style={{ color: '#39C1F2', fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          View Details <Icon name="arrow-right" size={13} />
        </a>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setStepIndex(Math.max(0, stepIndex - 1))} className="jw-btn sm" style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.14)' }}>◀ Prev</button>
          <button onClick={() => setStepIndex(Math.min(steps.length - 1, stepIndex + 1))} className="jw-btn sm" style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.14)' }}>Advance ▶</button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, tone, icon, trailing }) {
  return (
    <div className="jw-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div className="jw-label">{label}</div>
        <div className={`jw-icon-tile ${tone}`}><Icon name={icon} size={16} stroke={2} /></div>
      </div>
      <div className="jw-value" style={{ marginBottom: 6 }}>{value}</div>
      <div style={{ color: 'var(--jw-text-muted)', fontSize: 12 }}>{sub}</div>
      {trailing && <div style={{ marginTop: 10 }}>{trailing}</div>}
    </div>
  );
}

function BookingRow({ avatarTone, avatarInitial, title, sub, actions }) {
  return (
    <div className="jw-booking-row">
      <div className="left">
        <Avatar initial={avatarInitial} tone={avatarTone} />
        <div>
          <div className="title">{title}</div>
          <div className="sub">{sub}</div>
        </div>
      </div>
      <div className="right">{actions}</div>
    </div>
  );
}

function CustomerApp() {
  const [credits, setCredits] = React.useState(3);
  const used = 4 - credits;
  const pct = (used / 4) * 100;

  return (
    <div className="jw-app">
      <Sidebar items={navCustomer} activeKey="dashboard" />
      <div className="jw-main">
        <Topbar userName="Joey" initial="J" />
        <div className="jw-content">
          <div className="jw-welcome-hdr">
            <div>
              <h1 className="jw-h1">Welcome back, Joey!</h1>
              <p className="jw-sub">Time to make your car shine again.</p>
            </div>
            <button className="jw-btn primary"><Icon name="plus" size={14} stroke={2.5}/> Book a Wash</button>
          </div>

          <WashInProgress />

          <div className="jw-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 16 }}>
            <StatCard
              label="Wash Credits"
              value="03"
              sub="Prepaid washes remaining"
              tone="green"
              icon="car"
              trailing={<Chip tone="green"><Icon name="check" size={11} stroke={3}/>Sedan / Mid-SUV</Chip>}
            />
            <StatCard
              label="Subscription Plan"
              value="Plus"
              sub="4 washes / cycle · active"
              tone="cyan"
              icon="star"
              trailing={<div style={{ display: 'flex', gap: 6 }}><Chip tone="cyan">$49/mo</Chip><Chip tone="slate">Renews monthly</Chip></div>}
            />
            <StatCard
              label="Registered Vehicles"
              value="02"
              sub="Plan covers up to 3"
              tone="purple"
              icon="car"
              trailing={<div style={{ display: 'flex', gap: 6 }}><Chip tone="purple">Sedan</Chip><Chip tone="purple">SUV/Truck</Chip></div>}
            />
            <StatCard
              label="Next Billing"
              value="25 Feb"
              sub="Auto-renewal on · $49"
              tone="orange"
              icon="card"
              trailing={<Chip tone="orange">In 11 days</Chip>}
            />
          </div>

          <div className="jw-grid" style={{ gridTemplateColumns: '1fr 2fr', marginBottom: 6 }}>
            <div className="jw-card" style={{ background: 'linear-gradient(135deg, #F5F0FF, #FFFFFF)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div className="jw-label">Annual Renewal</div>
                <div className="jw-icon-tile purple"><Icon name="clock" size={16}/></div>
              </div>
              <div className="jw-value" style={{ color: '#6B45E4' }}>10 Jan 2027</div>
              <div style={{ color: 'var(--jw-text-muted)', fontSize: 12, marginTop: 4 }}>Annual plan renewal date</div>
              <div style={{ fontSize: 12, color: 'var(--jw-text-muted)', marginTop: 10 }}>Yearly subscription renewal date.</div>
            </div>
            <div className="jw-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <div className="jw-h3">Credits Used This Cycle</div>
                  <div style={{ color: 'var(--jw-text-muted)', fontSize: 12, marginTop: 4 }}>{used} of 4 washes used</div>
                </div>
                <Chip tone="cyan">Resets in 11 days</Chip>
              </div>
              <div className="jw-progress"><div className="jw-progress-fill" style={{ width: `${pct}%` }} /></div>
              <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
                {[0,1,2,3].map(i => (
                  <div key={i} style={{
                    flex: 1, height: 44, borderRadius: 8,
                    background: i < used ? 'linear-gradient(135deg, #CDEEFB, #A9DFF5)' : '#F5F7FB',
                    border: `1px solid ${i < used ? '#9BD3EC' : '#E5E9F0'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: i < used ? '#1E6FA8' : '#B3BCCB',
                    fontSize: 11, fontWeight: 600
                  }}>
                    {i < used ? <Icon name="check" size={14} stroke={2.5} /> : `Wash ${i+1}`}
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap: 8, marginTop: 12 }}>
                <button onClick={() => setCredits(Math.max(0, credits-1))} className="jw-btn sm outline">Use a credit</button>
                <button onClick={() => setCredits(Math.min(4, credits+1))} className="jw-btn sm outline">Restore credit</button>
              </div>
            </div>
          </div>

          <div className="jw-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span>Upcoming Washes</span>
            <a style={{ color: 'var(--jw-cyan-strong)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>See all →</a>
          </div>
          <div className="jw-row-list">
            <BookingRow
              avatarInitial="M" avatarTone="orange"
              title="Mon, Mar 10 · 9:00 AM"
              sub="with Marcus T. · 2 vehicles · Exterior + Interior"
              actions={<>
                <button className="jw-btn outline sm"><Icon name="phone" size={12}/> Contact Technician</button>
                <button className="jw-btn ghost-cyan sm">Modify</button>
                <button className="jw-btn danger sm"><Icon name="x" size={12} stroke={2.5}/> Cancel</button>
              </>}
            />
            <BookingRow
              avatarInitial="S" avatarTone="blue"
              title="Thu, Mar 20 · 11:30 AM"
              sub="with Sarah K. · 1 vehicle · Exterior only"
              actions={<>
                <button className="jw-btn outline sm"><Icon name="phone" size={12}/> Contact Technician</button>
                <button className="jw-btn ghost-cyan sm">Modify</button>
                <button className="jw-btn danger sm"><Icon name="x" size={12} stroke={2.5}/> Cancel</button>
              </>}
            />
          </div>

          <div className="jw-section-title">Completed Washes</div>
          <div className="jw-row-list">
            <BookingRow
              avatarInitial="M" avatarTone="orange"
              title="Mon, Feb 24 · 9:00 AM"
              sub="with Marcus T. · 2 vehicles · Rated ★ 5.0"
              actions={<>
                <button className="jw-btn outline sm"><Icon name="alert" size={12}/> Report a problem</button>
                <button className="jw-btn outline sm"><Icon name="phone" size={12}/> Contact Technician</button>
              </>}
            />
            <BookingRow
              avatarInitial="S" avatarTone="blue"
              title="Wed, Feb 12 · 2:00 PM"
              sub="with Sarah K. · 1 vehicle · Rated ★ 4.8"
              actions={<>
                <button className="jw-btn outline sm"><Icon name="alert" size={12}/> Report a problem</button>
                <button className="jw-btn outline sm"><Icon name="phone" size={12}/> Contact Technician</button>
              </>}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function mountCustomer() {
  const el = document.getElementById('customer-root');
  if (el && !el.__mounted) {
    el.__mounted = true;
    ReactDOM.createRoot(el).render(<CustomerApp />);
  } else if (!el) {
    requestAnimationFrame(mountCustomer);
  }
}
mountCustomer();
