// ============================================================
// Manage Availability — post-onboarding page
// Reuses the shared AvailabilityCalendar module.
// ============================================================

const navTechForAvail = [
  { key: 'dashboard', label: 'Dashboard', icon: 'home' },
  { key: 'bookings', label: 'Bookings & Calendar', icon: 'calendar' },
  { key: 'availability', label: 'Availability', icon: 'clock' },
  { key: 'marketing', label: 'Marketing Materials', icon: 'megaphone' },
  { key: 'payments', label: 'Payments', icon: 'card' },
  { key: 'support', label: 'Support / Help', icon: 'headset' },
];

// A few mocked bookings overlaid onto the availability calendar so the page
// reads as a real live schedule, not an empty shell.
const MOCK_BOOKINGS = {
  '2026-04-24': [{ time: '10:30a', client: 'The Hendersons', vehicle: 'Tesla Model Y' }],
  '2026-04-27': [{ time: '9:00a', client: 'Priya S.', vehicle: 'Honda Odyssey' }],
  '2026-04-28': [{ time: '3:30p', client: 'The Okafors', vehicle: 'Ford F-150' }],
  '2026-04-29': [
    { time: '9:30a', client: 'Derek M.', vehicle: 'BMW X5' },
    { time: '4:00p', client: 'Lila R.', vehicle: 'Subaru Outback' },
  ],
  '2026-04-30': [{ time: '10:00a', client: 'Courtney V.', vehicle: 'Audi Q7' }],
  '2026-05-01': [{ time: '3:00p', client: 'James B.', vehicle: 'RAM 1500' }],
};

function AvailSummaryTile({ label, value, sub, tone = 'cyan', icon }) {
  return (
    <div className="jw-card" style={{ padding: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div className="jw-label">{label}</div>
        <div className={`jw-icon-tile ${tone}`}><Icon name={icon} size={16}/></div>
      </div>
      <div className="jw-value" style={{ fontSize: 24 }}>{value}</div>
      <div style={{ color: 'var(--jw-text-muted)', fontSize: 12, marginTop: 4 }}>{sub}</div>
    </div>
  );
}

function ConfirmDialog({ open, title, body, confirmLabel, onConfirm, onCancel, tone = 'primary' }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      background: 'rgba(15, 23, 42, 0.42)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'white', borderRadius: 16, padding: 24, maxWidth: 420,
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)', border: '1px solid var(--jw-border)',
      }}>
        <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.2, marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 13.5, color: 'var(--jw-text-muted)', lineHeight: 1.55, marginBottom: 18 }}>{body}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="jw-btn outline" onClick={onCancel}>Cancel</button>
          <button className={`jw-btn ${tone}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

function AvailabilityPage() {
  const { defaultWeekly, hoursForRanges } = window.availHelpers;

  const [availValue, setAvailValue] = React.useState(() => ({
    phase: 'calendar',
    weekly: defaultWeekly(),
    overrides: {
      '2026-04-25': { active: false, ranges: [] }, // Sat trip
      '2026-04-29': { active: true, ranges: [{ start: '09:00', end: '12:00' }, { start: '15:00', end: '18:00' }, { start: '19:00', end: '21:00' }] },
    },
    selectedDate: null,
  }));
  const [confirmOpen, setConfirmOpen] = React.useState(null); // 'reset' | 'clear-overrides' | null
  const [savedFlash, setSavedFlash] = React.useState(false);

  const { weekly, overrides } = availValue;

  // Stats
  const weeklyHours = Object.values(weekly).reduce((s, d) => s + (d.active ? hoursForRanges(d.ranges) : 0), 0);
  const overrideCount = Object.keys(overrides).length;

  // Next 30 days hours (for April onwards)
  const monthHours = (() => {
    let sum = 0;
    for (let i = 1; i <= 30; i++) {
      const ds = `2026-04-${String(i).padStart(2,'0')}`;
      const info = window.availHelpers.getDayRanges(ds, weekly, overrides);
      if (info.active) sum += hoursForRanges(info.ranges);
    }
    return sum;
  })();

  const activeDays = Object.values(weekly).filter(d => d.active).length;

  const reset = () => {
    setAvailValue({ ...availValue, weekly: defaultWeekly(), overrides: {} });
    setConfirmOpen(null);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  };
  const clearOverrides = () => {
    setAvailValue({ ...availValue, overrides: {} });
    setConfirmOpen(null);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  };

  return (
    <div className="jw-app" style={{ position: 'relative' }}>
      <Sidebar items={navTechForAvail} activeKey="availability"/>
      <div className="jw-main">
        <Topbar userName="Marcus T." initial="M"/>
        <div className="jw-content">
          <div className="jw-welcome-hdr">
            <div>
              <h1 className="jw-h1">Availability</h1>
              <p className="jw-sub">When you work. Edit your weekly defaults or customize specific days.</p>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {savedFlash && <Chip tone="green"><Icon name="check" size={11} stroke={3}/> Saved</Chip>}
              <button className="jw-btn outline" onClick={() => setConfirmOpen('clear-overrides')}>
                <Icon name="trash" size={12}/> Clear {overrideCount} override{overrideCount !== 1 ? 's' : ''}
              </button>
              <button className="jw-btn outline" onClick={() => setConfirmOpen('reset')}>
                <Icon name="sparkle" size={12}/> Reset to defaults
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
            <AvailSummaryTile label="Weekly hours" value={`${weeklyHours.toFixed(1)}h`} sub={`${activeDays} working days`} icon="clock" tone="cyan"/>
            <AvailSummaryTile label="This month" value={`${monthHours.toFixed(0)}h`} sub="April 2026" icon="calendar" tone="green"/>
            <AvailSummaryTile label="Overrides" value={overrideCount} sub="Custom day edits" icon="edit" tone="orange"/>
            <AvailSummaryTile label="Booked" value={Object.values(MOCK_BOOKINGS).flat().length} sub="Upcoming 30 days" icon="check-circle" tone="purple"/>
          </div>

          {/* Phase tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 18, alignItems: 'center', borderBottom: '1px solid var(--jw-border)', paddingBottom: 0 }}>
            {[
              { k: 'calendar', label: 'Month view', icon: 'calendar' },
              { k: 'defaults', label: 'Weekly defaults', icon: 'gear' },
            ].map(t => {
              const active = availValue.phase === t.k;
              return (
                <button key={t.k}
                  onClick={() => setAvailValue({ ...availValue, phase: t.k, selectedDate: null })}
                  style={{
                    background: 'transparent', border: 'none',
                    padding: '10px 16px',
                    fontWeight: 700, fontSize: 13,
                    color: active ? 'var(--jw-cyan-strong)' : 'var(--jw-text-muted)',
                    cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    borderBottom: `2px solid ${active ? 'var(--jw-cyan)' : 'transparent'}`,
                    marginBottom: -1,
                    fontFamily: 'inherit',
                  }}>
                  <Icon name={t.icon} size={13}/> {t.label}
                </button>
              );
            })}
          </div>

          <AvailabilityCalendar
            value={availValue}
            onChange={setAvailValue}
          />
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen === 'reset'}
        title="Reset to onboarding defaults?"
        body="Your weekly schedule will go back to weekdays 9–11a and 3–8p, weekends off. All custom day overrides will be removed. This can't be undone."
        confirmLabel="Yes, reset everything"
        tone="primary"
        onConfirm={reset}
        onCancel={() => setConfirmOpen(null)}
      />
      <ConfirmDialog
        open={confirmOpen === 'clear-overrides'}
        title={`Clear ${overrideCount} override${overrideCount !== 1 ? 's' : ''}?`}
        body="Every custom-edited day will revert to the weekly default. Your weekly schedule stays as is."
        confirmLabel="Clear overrides"
        tone="primary"
        onConfirm={clearOverrides}
        onCancel={() => setConfirmOpen(null)}
      />
    </div>
  );
}

function mountAvailability() {
  const el = document.getElementById('availability-root');
  if (el && !el.__mounted) {
    el.__mounted = true;
    ReactDOM.createRoot(el).render(<AvailabilityPage/>);
  } else if (!el) {
    requestAnimationFrame(mountAvailability);
  }
}
mountAvailability();
