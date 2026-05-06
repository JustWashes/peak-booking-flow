// ============================================================
// Customer · Book a Wash — multi-step booking flow
// Renders inside <div id="book-root"></div>
// Steps: Vehicle → Technician type → Date & time → Review → Confirmed
// (Plus a no-subscription gate up front)
// ============================================================

const navCustomerBook = [
  { key: 'dashboard', label: 'Dashboard', icon: 'home' },
  { key: 'book', label: 'Book a Wash', icon: 'calendar' },
  { key: 'bookings', label: 'Manage Bookings', icon: 'doc' },
  { key: 'subscription', label: 'Manage Subscription', icon: 'dollar' },
  { key: 'vehicles', label: 'My Vehicles', icon: 'car' },
  { key: 'account', label: 'Account', icon: 'gear' },
];

// ------------------------------------------------------------
// Mock data
// ------------------------------------------------------------
const VEHICLES = [
  { id: 'v1', label: '2022 Toyota Camry', sub: 'Sedan · Pearl White · ABC-1234', size: 'Sedan', tone: 'blue' },
  { id: 'v2', label: '2024 Subaru Outback', sub: 'Mid-SUV · Forest Green · XYZ-9012', size: 'Mid-SUV', tone: 'green' },
];

// Two pools — certified pros and independents.
const TECH_POOL = {
  certified: [
    { id: 'c1', name: 'Marcus T.', initial: 'M', tone: 'orange', rating: 4.9, jobs: 412, blurb: 'Background-checked · 5 yrs · Last washed your car Feb 24', distance: '1.2 mi' },
    { id: 'c2', name: 'Sarah K.',  initial: 'S', tone: 'blue',   rating: 4.8, jobs: 287, blurb: 'Background-checked · 3 yrs · Eco-friendly products',           distance: '2.4 mi' },
    { id: 'c3', name: 'Devon R.',  initial: 'D', tone: 'green',  rating: 5.0, jobs: 96,  blurb: 'Background-checked · Closest to you today',                    distance: '0.8 mi' },
  ],
  independent: [
    { id: 'i1', name: 'Theo L.',     initial: 'T', tone: 'purple', rating: 4.7, jobs: 64,  blurb: 'Local pro · Verified ID · Available all weekend',  distance: '1.6 mi' },
    { id: 'i2', name: 'Priya R.',    initial: 'P', tone: 'orange', rating: 4.9, jobs: 38,  blurb: 'Local pro · Verified ID · Same-day specialist',    distance: '3.0 mi' },
    { id: 'i3', name: 'Jay W.',      initial: 'J', tone: 'blue',   rating: 4.6, jobs: 21,  blurb: 'Local pro · Verified ID · New to JustWashes',      distance: '4.2 mi' },
    { id: 'i4', name: 'Maria F.',    initial: 'M', tone: 'green',  rating: 4.8, jobs: 52,  blurb: 'Local pro · Verified ID · Bilingual · Fri–Sun',    distance: '2.1 mi' },
  ],
};

// Hourly slots, 8a–9p. Certified is sparser; specific tech sparser still.
const ALL_HOURLY_SLOTS = [
  '8:00a','9:00a','10:00a','11:00a','12:00p','1:00p',
  '2:00p','3:00p','4:00p','5:00p','6:00p','7:00p','8:00p','9:00p',
];
const TIME_SLOTS_CERTIFIED  = ['9:00a','11:00a','1:00p','2:00p','4:00p','6:00p'];
const TIME_SLOTS_INDEPENDENT = ALL_HOURLY_SLOTS;

// ------------------------------------------------------------
// Stepper (horizontal, sits under topbar)
// ------------------------------------------------------------
const STEPS = [
  { key: 'vehicle',   label: 'Vehicle',     icon: 'car' },
  { key: 'tech',      label: 'Technician',  icon: 'user-check' },
  { key: 'datetime',  label: 'Date & Time', icon: 'calendar' },
  { key: 'review',    label: 'Review',      icon: 'check-circle' },
];

function Stepper({ stepIdx, onJump }) {
  return (
    <div style={{
      background: 'white',
      borderBottom: '1px solid var(--jw-border)',
      padding: '18px 32px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, position: 'relative', maxWidth: 720 }}>
        {STEPS.map((s, i) => {
          const isDone = i < stepIdx;
          const isActive = i === stepIdx;
          const reachable = i <= stepIdx;
          return (
            <React.Fragment key={s.key}>
              <button
                onClick={() => reachable && onJump(i)}
                disabled={!reachable}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'transparent', border: 'none', padding: 0,
                  cursor: reachable ? 'pointer' : 'default',
                  fontFamily: 'inherit',
                  opacity: reachable ? 1 : 0.55,
                }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isDone ? '#2CB67D' : isActive ? 'var(--jw-cyan)' : '#EEF2F7',
                  color: isDone || isActive ? 'white' : '#94A3B8',
                  boxShadow: isActive ? '0 0 0 4px rgba(35,183,236,0.18)' : 'none',
                  fontSize: 13, fontWeight: 700,
                  transition: 'all 0.2s',
                }}>
                  {isDone ? <Icon name="check" size={15} stroke={3}/> : i + 1}
                </div>
                <div style={{
                  fontSize: 12.5, fontWeight: isActive ? 700 : 600,
                  color: isActive ? 'var(--jw-text)' : isDone ? 'var(--jw-text)' : 'var(--jw-text-muted)',
                  whiteSpace: 'nowrap',
                }}>{s.label}</div>
              </button>
              {i < STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: 2, margin: '0 14px', borderRadius: 2,
                  background: i < stepIdx ? '#2CB67D' : '#EEF2F7',
                  transition: 'background 0.3s',
                }}/>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// No-subscription gate (shown before the flow if hasSubscription === false)
// ------------------------------------------------------------
function SubscribeGate({ onSubscribe }) {
  return (
    <div style={{ maxWidth: 880, margin: '40px auto 0', padding: '0 32px' }}>
      <div className="jw-card navy" style={{ padding: 32, borderRadius: 18, color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(35,183,236,0.35), rgba(35,183,236,0) 70%)', pointerEvents: 'none',
        }}/>
        <Chip tone="cyan"><Icon name="alert" size={11}/> No active plan</Chip>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.4, margin: '14px 0 6px' }}>
          Subscribe to start booking washes.
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 22, maxWidth: 560 }}>
          JustWashes is credit-based — every plan gives you a bundle of exterior washes each cycle. Pick a plan to unlock booking. Cancel any time.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { name: 'Basic', price: '$29', credits: 2, blurb: '2 washes / mo · Independent pros', accent: '#39C1F2' },
            { name: 'Plus',  price: '$49', credits: 4, blurb: '4 washes / mo · Any pro · Priority slots', accent: '#2CB67D', popular: true },
            { name: 'Pro',   price: '$89', credits: 8, blurb: '8 washes / mo · Certified only · Same-day', accent: '#7C5CFF' },
          ].map(p => (
            <div key={p.name} style={{
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${p.popular ? p.accent : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 14, padding: 18, position: 'relative',
            }}>
              {p.popular && <div style={{ position: 'absolute', top: -10, right: 14, background: p.accent, color: 'white', fontSize: 10, fontWeight: 800, letterSpacing: 0.5, padding: '3px 9px', borderRadius: 999, textTransform: 'uppercase' }}>Best value</div>}
              <div style={{ fontSize: 14, fontWeight: 700, color: p.accent }}>{p.name}</div>
              <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>{p.price}<span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>/mo</span></div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 6, lineHeight: 1.4 }}>{p.blurb}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <button className="jw-btn primary" onClick={onSubscribe} style={{ padding: '11px 22px' }}>
            Choose a plan <Icon name="arrow-right" size={13}/>
          </button>
          <button className="jw-btn outline" style={{ background: 'rgba(255,255,255,0.08)', color: 'white', borderColor: 'rgba(255,255,255,0.18)' }}>
            Compare plans
          </button>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Step 1: Vehicle
// ------------------------------------------------------------
function VehicleStep({ value, onChange }) {
  return (
    <div>
      <h2 className="jw-h1" style={{ fontSize: 22 }}>Which vehicle?</h2>
      <p className="jw-sub" style={{ marginBottom: 22 }}>Pick from your saved vehicles, or add a new one. All washes are exterior-only — hand-wash, wheels & windows.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {VEHICLES.map(v => {
          const selected = value === v.id;
          return (
            <button key={v.id} onClick={() => onChange(v.id)} style={{
              textAlign: 'left', padding: 18, borderRadius: 14,
              background: 'white',
              border: `2px solid ${selected ? 'var(--jw-cyan)' : 'var(--jw-border)'}`,
              boxShadow: selected ? '0 6px 20px rgba(35,183,236,0.15)' : 'var(--jw-shadow-sm)',
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 14,
              transition: 'all 0.18s',
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: 12,
                background: v.tone === 'blue' ? 'linear-gradient(135deg, #DCEEFF, #B7DCFF)' : 'linear-gradient(135deg, #DDF3E5, #B6E3C5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: v.tone === 'blue' ? '#3176D6' : '#2CB67D', flexShrink: 0,
              }}>
                <Icon name="car" size={28}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700 }}>{v.label}</div>
                <div style={{ fontSize: 12, color: 'var(--jw-text-muted)', marginTop: 2 }}>{v.sub}</div>
                <div style={{ marginTop: 8 }}><Chip tone="slate">{v.size}</Chip></div>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                border: `2px solid ${selected ? 'var(--jw-cyan)' : '#D8DEE8'}`,
                background: selected ? 'var(--jw-cyan)' : 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', flexShrink: 0,
              }}>
                {selected && <Icon name="check" size={12} stroke={3}/>}
              </div>
            </button>
          );
        })}
        <button style={{
          textAlign: 'left', padding: 18, borderRadius: 14,
          background: 'transparent',
          border: '2px dashed #D8DEE8',
          cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 14,
          color: 'var(--jw-text-muted)',
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: 12,
            background: '#F3F5F8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="plus" size={26} stroke={2}/>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--jw-text)' }}>Add a vehicle</div>
            <div style={{ fontSize: 12, marginTop: 2 }}>Plan covers up to 3</div>
          </div>
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Step 2: Technician type — Certified vs Independent + optional pick-specific
// ------------------------------------------------------------
function TypeInfoPopover() {
  const [open, setOpen] = React.useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }} style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 4,
        color: 'var(--jw-cyan-strong)', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
      }}>
        <Icon name="alert" size={12}/> What's the difference?
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 5 }}/>
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', left: 0,
            width: 380, background: 'white', borderRadius: 12, zIndex: 10,
            border: '1px solid var(--jw-border)',
            boxShadow: '0 14px 36px rgba(11, 37, 69, 0.14)',
            padding: 16, fontSize: 12.5, color: 'var(--jw-text)', textAlign: 'left',
          }}>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 10 }}>Certified vs. Independent</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', fontWeight: 600, color: 'var(--jw-text-muted)', fontSize: 11, padding: '4px 0' }}></th>
                  <th style={{ textAlign: 'left', color: '#2CB67D', fontWeight: 700, fontSize: 11, padding: '4px 8px' }}>Certified</th>
                  <th style={{ textAlign: 'left', color: '#7C5CFF', fontWeight: 700, fontSize: 11, padding: '4px 0' }}>Independent</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: 11.5 }}>
                {[
                  ['Background check', '✓', '✓'],
                  ['JustWashes training',  '✓', '—'],
                  ['Uniform & equipment',  '✓', 'Own gear'],
                  ['$2M insurance',        '✓', 'Self-insured'],
                  ['Same-day availability','Limited', 'Wider'],
                  ['Avg. response time',   '< 2 hrs', 'Varies'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--jw-border)' }}>
                    <td style={{ padding: '6px 0', color: 'var(--jw-text-muted)' }}>{row[0]}</td>
                    <td style={{ padding: '6px 8px', fontWeight: 600 }}>{row[1]}</td>
                    <td style={{ padding: '6px 0', fontWeight: 600 }}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </span>
  );
}

function TechTypeStep({ techType, onChangeType, specificTechId, onChangeSpecific, pickingSpecific, onPickSpecific, onClosePick }) {
  const types = [
    {
      key: 'certified',
      title: 'Certified Pro',
      blurb: 'JustWashes-trained & background-checked. Higher rates, tighter availability, $2M insurance.',
      accent: '#2CB67D',
      bullets: ['Trained & background-checked', '$2M insurance included', 'JustWashes uniform & gear'],
      pool: TECH_POOL.certified.length,
    },
    {
      key: 'independent',
      title: 'Independent Pro',
      blurb: 'Local verified pros — own gear, wider availability, often same-day. Great quality at a lower spend.',
      accent: '#7C5CFF',
      bullets: ['Verified ID', 'Own equipment & products', 'More slots, often same-day'],
      pool: TECH_POOL.independent.length,
    },
  ];

  if (pickingSpecific) {
    const pool = TECH_POOL[techType];
    return (
      <div>
        <button onClick={onClosePick} style={{
          background: 'transparent', border: 'none', color: 'var(--jw-text-muted)',
          fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          display: 'inline-flex', alignItems: 'center', gap: 6, padding: 0, marginBottom: 10,
        }}>
          <Icon name="arrow-left" size={12}/> Back to technician type
        </button>
        <h2 className="jw-h1" style={{ fontSize: 22 }}>Choose a specific {techType === 'certified' ? 'Certified' : 'Independent'} pro</h2>
        <p className="jw-sub" style={{ marginBottom: 22 }}>
          {pool.length} {pool.length === 1 ? 'pro is' : 'pros are'} available in your area. We'll only show their open slots on the next step.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <button onClick={() => onChangeSpecific(null)} style={{
            textAlign: 'left', padding: 18, borderRadius: 14,
            background: 'white',
            border: `2px solid ${specificTechId == null ? 'var(--jw-cyan)' : 'var(--jw-border)'}`,
            boxShadow: specificTechId == null ? '0 6px 20px rgba(35,183,236,0.15)' : 'var(--jw-shadow-sm)',
            cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', gap: 14, alignItems: 'flex-start',
            transition: 'all 0.18s',
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1EA6E1, #39C1F2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 22, flexShrink: 0,
            }}>★</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 14.5, fontWeight: 700 }}>Any available pro</div>
                <Chip tone="cyan">Fastest match</Chip>
              </div>
              <div style={{ fontSize: 12, color: 'var(--jw-text-subtle)', lineHeight: 1.4 }}>We'll match you to the best-rated {techType} pro available — usually saves 10–15 min.</div>
            </div>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              border: `2px solid ${specificTechId == null ? 'var(--jw-cyan)' : '#D8DEE8'}`,
              background: specificTechId == null ? 'var(--jw-cyan)' : 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', flexShrink: 0,
            }}>
              {specificTechId == null && <Icon name="check" size={12} stroke={3}/>}
            </div>
          </button>
          {pool.map(t => {
            const selected = specificTechId === t.id;
            return (
              <button key={t.id} onClick={() => onChangeSpecific(t.id)} style={{
                textAlign: 'left', padding: 18, borderRadius: 14,
                background: 'white',
                border: `2px solid ${selected ? 'var(--jw-cyan)' : 'var(--jw-border)'}`,
                boxShadow: selected ? '0 6px 20px rgba(35,183,236,0.15)' : 'var(--jw-shadow-sm)',
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', gap: 14, alignItems: 'flex-start',
                transition: 'all 0.18s',
              }}>
                <Avatar initial={t.initial} tone={t.tone}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <div style={{ fontSize: 14.5, fontWeight: 700 }}>{t.name}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--jw-text-muted)', marginBottom: 6 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><Icon name="star" size={11} color="#F39C4C"/>{t.rating} · {t.jobs} jobs</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><Icon name="pin" size={11}/>{t.distance}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--jw-text-subtle)', lineHeight: 1.4 }}>{t.blurb}</div>
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  border: `2px solid ${selected ? 'var(--jw-cyan)' : '#D8DEE8'}`,
                  background: selected ? 'var(--jw-cyan)' : 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', flexShrink: 0,
                }}>
                  {selected && <Icon name="check" size={12} stroke={3}/>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 4, flexWrap: 'wrap' }}>
        <h2 className="jw-h1" style={{ fontSize: 22 }}>What kind of pro?</h2>
        <TypeInfoPopover/>
      </div>
      <p className="jw-sub" style={{ marginBottom: 22 }}>Your choice affects which slots are available next. You can also pick a specific pro.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {types.map(t => {
          const selected = techType === t.key;
          return (
            <button key={t.key} onClick={() => onChangeType(t.key)} style={{
              textAlign: 'left', padding: 22, borderRadius: 16,
              background: 'white',
              border: `2px solid ${selected ? t.accent : 'var(--jw-border)'}`,
              boxShadow: selected ? `0 8px 24px ${t.accent}25` : 'var(--jw-shadow-sm)',
              cursor: 'pointer', fontFamily: 'inherit', position: 'relative',
              transition: 'all 0.18s',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: `${t.accent}18`, color: t.accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={t.key === 'certified' ? 'user-check' : 'star'} size={20}/>
                </div>
                <Chip tone="slate">{t.pool} available</Chip>
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.2, marginBottom: 4 }}>{t.title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--jw-text-muted)', minHeight: 36, lineHeight: 1.4 }}>{t.blurb}</div>
              <hr className="jw-hr" style={{ margin: '14px 0' }}/>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {t.bullets.map(b => (
                  <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--jw-text)' }}>
                    <Icon name="check" size={12} stroke={3} color={t.accent}/>{b}
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Specific tech CTA */}
      <div style={{
        marginTop: 18, padding: 18, borderRadius: 14,
        background: '#F7FBFE', border: '1px dashed #B6DFF0',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: '#CDEEFB', color: 'var(--jw-cyan-strong)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon name="user-check" size={18}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700 }}>Have someone in mind?</div>
          <div style={{ fontSize: 12, color: 'var(--jw-text-muted)', marginTop: 2 }}>
            Pick a specific {techType === 'certified' ? 'Certified' : 'Independent'} pro. Date & time will then only show their available slots.
          </div>
        </div>
        <button onClick={onPickSpecific} className="jw-btn outline">
          {specificTechId
            ? <>Change pick <Icon name="chevron-right" size={12}/></>
            : <>Pick a specific pro <Icon name="chevron-right" size={12}/></>}
        </button>
      </div>

      {specificTechId && (
        <div style={{
          marginTop: 10, padding: 12, borderRadius: 10,
          background: '#E0F5EA', border: '1px solid #B8E3CE',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Icon name="check-circle" size={15} color="#2CB67D"/>
          <div style={{ fontSize: 12.5, color: '#1E7A52' }}>
            Booking specifically with <b>{TECH_POOL[techType].find(t => t.id === specificTechId)?.name}</b>.
          </div>
          <button onClick={() => onChangeSpecific(null)} style={{
            marginLeft: 'auto', background: 'transparent', border: 'none',
            color: '#1E7A52', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>Clear</button>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------
// Time dropdown — split into Morning / Afternoon / Evening
// ------------------------------------------------------------
function TimeDropdown({ slots, value, onChange, isSpecific }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  // categorize slot strings like "8:00a" / "12:00p" / "5:00p"
  const cat = (s) => {
    const isAM = s.endsWith('a');
    const hour = parseInt(s, 10);
    if (isAM) return 'Morning';
    if (hour === 12 || hour < 5) return 'Afternoon';
    return 'Evening';
  };
  const groups = { Morning: [], Afternoon: [], Evening: [] };
  slots.forEach(s => groups[cat(s)].push(s));

  const taken = new Set(slots.filter((_, i) => !isSpecific && i % 5 === 1));

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={{ fontSize: 11.5, color: 'var(--jw-text-muted)', marginBottom: 8, fontWeight: 600 }}>
        {slots.length} slot{slots.length === 1 ? '' : 's'} available
      </div>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', padding: '12px 14px', borderRadius: 10,
        border: `1.5px solid ${open ? 'var(--jw-cyan)' : value ? 'var(--jw-border-strong)' : 'var(--jw-border)'}`,
        background: 'white', textAlign: 'left',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
        fontFamily: 'inherit', cursor: 'pointer',
        boxShadow: open ? '0 0 0 4px rgba(35,183,236,0.14)' : 'none',
        transition: 'all 0.12s',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <Icon name="clock" size={15} color="var(--jw-cyan-strong)"/>
          <span style={{ fontSize: 14, fontWeight: 700, color: value ? 'var(--jw-text)' : 'var(--jw-text-muted)' }}>
            {value || 'Choose a time'}
          </span>
        </span>
        <Icon name="chevron-down" size={14} color="var(--jw-text-muted)"/>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 10,
          background: 'white', border: '1px solid var(--jw-border)', borderRadius: 12,
          boxShadow: '0 14px 36px rgba(11, 37, 69, 0.14)',
          maxHeight: 320, overflowY: 'auto', padding: 6,
        }}>
          {Object.entries(groups).map(([label, list]) => list.length > 0 && (
            <div key={label}>
              <div style={{
                position: 'sticky', top: 0, background: 'white',
                padding: '8px 10px 4px', fontSize: 10.5, fontWeight: 800,
                letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--jw-text-subtle)',
              }}>{label}</div>
              {list.map(t => {
                const isTaken = taken.has(t);
                const selected = value === t;
                return (
                  <button key={t}
                    disabled={isTaken}
                    onClick={() => { if (!isTaken) { onChange(t); setOpen(false); } }}
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: 8,
                      background: selected ? '#F0F8FE' : 'transparent',
                      border: 'none', textAlign: 'left', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      cursor: isTaken ? 'not-allowed' : 'pointer',
                      color: isTaken ? '#C7CEDB' : selected ? 'var(--jw-cyan-strong)' : 'var(--jw-text)',
                      fontSize: 13, fontWeight: selected ? 700 : 500,
                      textDecoration: isTaken ? 'line-through' : 'none',
                    }}
                    onMouseEnter={e => { if (!isTaken && !selected) e.currentTarget.style.background = '#F7FBFE'; }}
                    onMouseLeave={e => { if (!isTaken && !selected) e.currentTarget.style.background = 'transparent'; }}>
                    <span>{t}</span>
                    {selected && <Icon name="check" size={13} stroke={3} color="var(--jw-cyan-strong)"/>}
                    {isTaken && <span style={{ fontSize: 10.5, fontWeight: 600 }}>booked</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------
// Step 3: Date & time — availability depends on type / specific tech
// ------------------------------------------------------------
function DateTimeStep({ date, time, onChangeDate, onChangeTime, techType, specificTechName }) {
  // April 2026 — today is the 24th; only allow today & forward
  const year = 2026, month = 3;
  const today = 24;
  const daysInMonth = 30;
  const monthStart = new Date(year, month, 1);
  const firstDow = (monthStart.getDay() + 6) % 7; // Mon-first
  const monthLabel = monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Availability differs:
  // - certified is sparser: more "full" days
  // - specific tech is even sparser
  const isSpecific = !!specificTechName;
  const baseSlots = techType === 'certified' ? TIME_SLOTS_CERTIFIED : TIME_SLOTS_INDEPENDENT;
  const slots = isSpecific ? baseSlots.slice(0, 3) : baseSlots;
  const fullDays = isSpecific
    ? new Set([25, 26, 28, 29])
    : techType === 'certified'
      ? new Set([25, 26, 28])
      : new Set([26]);
  const busyDays = techType === 'certified' ? new Set([27, 30]) : new Set([25, 28]);

  const selectedDate = date;
  return (
    <div>
      <h2 className="jw-h1" style={{ fontSize: 22 }}>Pick a date & time</h2>
      <p className="jw-sub" style={{ marginBottom: 14 }}>
        Showing availability for{' '}
        {isSpecific
          ? <><b>{specificTechName}</b> ({techType})</>
          : <><b>{techType === 'certified' ? 'Certified' : 'Independent'} pros</b></>}.
        Times in your local zone (PT).
      </p>

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '6px 12px', borderRadius: 999, marginBottom: 18,
        background: techType === 'certified' ? '#E0F5EA' : '#F0EAFF',
        color: techType === 'certified' ? '#1E7A52' : '#5F4AB9',
        border: `1px solid ${techType === 'certified' ? '#B8E3CE' : '#D9C7FF'}`,
        fontSize: 12, fontWeight: 700,
      }}>
        <Icon name={techType === 'certified' ? 'user-check' : 'star'} size={12}/>
        {isSpecific ? specificTechName : (techType === 'certified' ? 'Certified Pro pool' : 'Independent Pro pool')}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>

        {/* Calendar */}
        <div className="jw-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <button className="jw-btn outline sm"><Icon name="arrow-left" size={11}/></button>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.2 }}>{monthLabel}</div>
            <button className="jw-btn outline sm"><Icon name="arrow-right" size={11}/></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
              <div key={d} style={{ fontSize: 11, fontWeight: 700, color: 'var(--jw-text-muted)', textAlign: 'center', padding: '4px 0' }}>{d}</div>
            ))}
            {Array.from({ length: firstDow }).map((_, i) => <div key={`pad-${i}`}/>)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
              const isPast = day < today;
              const isToday = day === today;
              const isFull = fullDays.has(day);
              const isBusy = busyDays.has(day);
              const isSelected = dateStr === selectedDate;
              const disabled = isPast || isFull;
              return (
                <button key={day}
                  disabled={disabled}
                  onClick={() => onChangeDate(dateStr)}
                  style={{
                    aspectRatio: '1 / 1',
                    border: `1.5px solid ${isSelected ? 'var(--jw-cyan)' : 'transparent'}`,
                    borderRadius: 10,
                    background: isSelected ? 'var(--jw-cyan)' : disabled ? '#FAFBFD' : isToday ? '#F0F8FE' : 'white',
                    color: isSelected ? 'white' : disabled ? '#C7CEDB' : isToday ? 'var(--jw-cyan-strong)' : 'var(--jw-text)',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'inherit', fontSize: 13, fontWeight: isSelected || isToday ? 700 : 500,
                    position: 'relative', textDecoration: isFull ? 'line-through' : 'none',
                    transition: 'all 0.12s',
                  }}>
                  {day}
                  {isBusy && !isSelected && !disabled && (
                    <div style={{ position: 'absolute', bottom: 5, width: 4, height: 4, borderRadius: '50%', background: '#F39C4C' }}/>
                  )}
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--jw-border)', fontSize: 11, color: 'var(--jw-text-muted)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F0F8FE', border: '1.5px solid var(--jw-cyan)' }}/>Today</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 4, height: 4, borderRadius: '50%', background: '#F39C4C' }}/>Limited</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, textDecoration: 'line-through' }}>Full</span>
          </div>
        </div>

        {/* Time slots */}
        <div className="jw-card" style={{ padding: 18 }}>
          <div style={{ fontSize: 11.5, color: 'var(--jw-text-subtle)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {selectedDate ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' }) : 'Select a date'}
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.3, marginBottom: 14 }}>
            {selectedDate ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : '\u00A0'}
          </div>
          {slots.length === 0 ? (
            <div style={{ padding: '22px 4px', textAlign: 'center', color: 'var(--jw-text-muted)', fontSize: 12.5 }}>
              No slots available for this day.
            </div>
          ) : (
            <TimeDropdown slots={slots} value={time} onChange={onChangeTime} isSpecific={isSpecific}/>
          )}
          <div style={{
            marginTop: 16, padding: 12, borderRadius: 10,
            background: '#F0F8FE', border: '1px solid #B6DFF0',
            fontSize: 12, color: '#1E6FA8', display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <Icon name="alert" size={14} color="#1E6FA8"/>
            <div>Free reschedule up to 4 hours before your slot. We'll text you when your pro is on the way.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Step 4: Review & confirm — credits only
// ------------------------------------------------------------
function ReviewStep({ summary, address, onAddress, notes, onNotes }) {
  return (
    <div>
      <h2 className="jw-h1" style={{ fontSize: 22 }}>Review & confirm</h2>
      <p className="jw-sub" style={{ marginBottom: 22 }}>One last look. Tap any step above to change anything.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
        {/* Vehicle + service line */}
        <div className="jw-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 50, height: 50, borderRadius: 12,
              background: '#CDEEFB', color: 'var(--jw-cyan-strong)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon name="droplet" size={22}/></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800 }}>Exterior wash</div>
              <div style={{ fontSize: 12, color: 'var(--jw-text-muted)' }}>Hand-wash · wheels · windows · ~45 min · {summary.vehicle.label}</div>
            </div>
            <Chip tone="cyan">1 credit</Chip>
          </div>
        </div>

        {/* When + tech */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="jw-card" style={{ padding: 16 }}>
            <div className="jw-label" style={{ marginBottom: 8 }}>When</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="calendar" size={15} color="#64748B"/>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>
                {new Date(summary.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
              <Icon name="clock" size={15} color="#64748B"/>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>{summary.time} · arrives within 15 min</div>
            </div>
          </div>
          <div className="jw-card" style={{ padding: 16 }}>
            <div className="jw-label" style={{ marginBottom: 8 }}>Technician</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {summary.specificTech
                ? <Avatar initial={summary.specificTech.initial} tone={summary.specificTech.tone}/>
                : <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #1EA6E1, #39C1F2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14 }}>★</div>}
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>{summary.specificTech ? summary.specificTech.name : `Any ${summary.techType === 'certified' ? 'Certified' : 'Independent'} Pro`}</div>
                <div style={{ fontSize: 11.5, color: 'var(--jw-text-muted)' }}>
                  {summary.specificTech
                    ? <>★ {summary.specificTech.rating} · {summary.specificTech.jobs} jobs</>
                    : <>{summary.techType === 'certified' ? 'Certified pool' : 'Independent pool'} · we'll match you the best one</>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="jw-card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div className="jw-label">Service address</div>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--jw-cyan-strong)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Change</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="pin" size={15} color="#64748B"/>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{address}</div>
          </div>
        </div>

        {/* Notes */}
        <div className="jw-card" style={{ padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Notes for your tech (optional)</div>
          <div style={{ fontSize: 12, color: 'var(--jw-text-muted)', marginBottom: 10 }}>e.g. gate code, where the car will be parked, allergies to certain products.</div>
          <textarea
            value={notes}
            onChange={e => onNotes(e.target.value)}
            placeholder="Park in driveway, gate code 4421. Thanks!"
            style={{
              width: '100%', minHeight: 70, padding: 12, borderRadius: 10,
              border: '1px solid var(--jw-border)', fontFamily: 'inherit', fontSize: 13,
              resize: 'vertical', outline: 'none', color: 'var(--jw-text)', background: '#F7F9FC',
            }}/>
        </div>

        {/* Credits */}
        <div className="jw-card" style={{ padding: 18 }}>
          <div className="jw-label" style={{ marginBottom: 12 }}>Wash credits</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderRadius: 12,
            background: '#F0F8FE', border: '1.5px solid var(--jw-cyan)',
          }}>
            <div className="jw-icon-tile cyan" style={{ width: 38, height: 38 }}><Icon name="check-circle" size={17}/></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>1 credit will be used</div>
              <div style={{ fontSize: 12, color: 'var(--jw-text-muted)', marginTop: 2 }}>You have <b>3 credits</b> on Plus · 2 will remain after this booking</div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: 22, height: 22, borderRadius: 6,
                  background: i === 0 ? '#FCEFDE' : '#CDEEFB',
                  border: `1px solid ${i === 0 ? '#F5CB8F' : '#9BD3EC'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: i === 0 ? '#B88724' : '#1E6FA8', fontSize: 12, fontWeight: 700,
                }}>{i === 0 ? '−' : '✓'}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Final: Confirmation screen
// ------------------------------------------------------------
function ConfirmationScreen({ summary, onReset }) {
  const techName = summary.specificTech ? summary.specificTech.name : `your ${summary.techType === 'certified' ? 'Certified' : 'Independent'} Pro`;
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', padding: '20px 0 60px' }}>
      <div style={{
        width: 84, height: 84, borderRadius: '50%',
        background: 'linear-gradient(135deg, #4FD1A3, #2CB67D)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', boxShadow: '0 12px 28px rgba(44, 182, 125, 0.35)',
        marginBottom: 22,
      }}>
        <Icon name="check" size={44} stroke={3}/>
      </div>
      <h1 className="jw-h1" style={{ fontSize: 30 }}>Booking confirmed!</h1>
      <p className="jw-sub" style={{ fontSize: 14, marginBottom: 24 }}>
        Confirmation #JW-3047 sent to joey@email.com.
        <br/>
        {techName} will arrive {new Date(summary.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {summary.time}.
      </p>
      <div className="jw-card" style={{ textAlign: 'left', padding: 22, marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--jw-text-subtle)' }}>Booking summary</div>
          <Chip tone="green" dot>Confirmed</Chip>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, paddingBottom: 14, borderBottom: '1px solid var(--jw-border)' }}>
          <div>
            <div className="jw-label">Service</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>Exterior wash</div>
          </div>
          <div>
            <div className="jw-label">Vehicle</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{summary.vehicle.label}</div>
          </div>
          <div>
            <div className="jw-label">When</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>
              {new Date(summary.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {summary.time}
            </div>
          </div>
          <div>
            <div className="jw-label">Technician</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>
              {summary.specificTech ? summary.specificTech.name : `Any ${summary.techType === 'certified' ? 'Certified' : 'Independent'} Pro`}
            </div>
          </div>
        </div>
        <div style={{ paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="jw-label">Charged</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--jw-green)' }}>1 wash credit</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button className="jw-btn primary"><Icon name="calendar" size={13}/> Add to calendar</button>
        <button className="jw-btn outline" onClick={onReset}>Book another</button>
      </div>
      <div style={{
        marginTop: 26, padding: 14, borderRadius: 12,
        background: '#F0F8FE', border: '1px solid #B6DFF0',
        display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
      }}>
        <Icon name="bell" size={18} color="var(--jw-cyan-strong)"/>
        <div style={{ fontSize: 12.5, color: 'var(--jw-text)', lineHeight: 1.5 }}>
          We'll text you when {summary.specificTech ? summary.specificTech.name.split(' ')[0] : 'your pro'} is on the way. Free reschedule up to 4 hours before.
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Sticky footer with back/next + summary
// ------------------------------------------------------------
function StickyFooter({ stepIdx, canNext, onBack, onNext, summary }) {
  const isLast = stepIdx === STEPS.length - 1;

  return (
    <div style={{
      position: 'sticky', bottom: 0, marginTop: 28,
      background: 'white', borderTop: '1px solid var(--jw-border)',
      padding: '14px 32px', marginLeft: -32, marginRight: -32,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 -6px 20px rgba(11, 37, 69, 0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--jw-text-subtle)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 }}>Cost</div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4 }}>
            1 credit
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--jw-text-muted)', marginLeft: 6 }}>(2 of 3 remaining after)</span>
          </div>
        </div>
        <div style={{ width: 1, height: 28, background: 'var(--jw-border)' }}/>
        <div style={{ fontSize: 12, color: 'var(--jw-text-muted)' }}>
          Exterior wash
          {summary.date && ` · ${new Date(summary.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
          {summary.time && ` · ${summary.time}`}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        {stepIdx > 0 && (
          <button className="jw-btn outline" onClick={onBack}>
            <Icon name="arrow-left" size={13}/> Back
          </button>
        )}
        <button className="jw-btn primary" onClick={onNext} disabled={!canNext} style={{
          opacity: canNext ? 1 : 0.5,
          cursor: canNext ? 'pointer' : 'not-allowed',
          padding: '11px 22px',
        }}>
          {isLast ? <><Icon name="check" size={13} stroke={3}/> Confirm booking</> : <>Continue <Icon name="arrow-right" size={13}/></>}
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Root flow
// ------------------------------------------------------------
function BookWashFlow() {
  // Tweak: simulate no-subscription state by flipping this to false in the URL
  const [hasSubscription, setHasSubscription] = React.useState(true);
  const [stepIdx, setStepIdx] = React.useState(0);
  const [confirmed, setConfirmed] = React.useState(false);
  const [vehicleId, setVehicleId] = React.useState('v1');
  const [techType, setTechType] = React.useState('certified');
  const [specificTechId, setSpecificTechId] = React.useState(null);
  const [pickingSpecific, setPickingSpecific] = React.useState(false);
  const [date, setDate] = React.useState('2026-04-27');
  const [time, setTime] = React.useState('10:00a');
  const [notes, setNotes] = React.useState('');
  const [address, setAddress] = React.useState('1428 Maple St, Palo Alto, CA 94301');

  const specificTech = specificTechId ? TECH_POOL[techType].find(t => t.id === specificTechId) : null;
  const summary = {
    vehicle: VEHICLES.find(v => v.id === vehicleId),
    techType, specificTech,
    date, time,
  };

  // Reset specific tech if user changes type
  const handleChangeType = (t) => {
    setTechType(t);
    setSpecificTechId(null);
  };

  const canNext = (() => {
    if (stepIdx === 0) return !!vehicleId;
    if (stepIdx === 1) return !!techType && !pickingSpecific;
    if (stepIdx === 2) return !!date && !!time;
    if (stepIdx === 3) return true;
    return false;
  })();

  const handleNext = () => {
    if (stepIdx === STEPS.length - 1) {
      setConfirmed(true);
    } else {
      setStepIdx(stepIdx + 1);
    }
  };

  const handleReset = () => {
    setConfirmed(false);
    setStepIdx(0);
  };

  // Subscription gate
  if (!hasSubscription) {
    return (
      <div className="jw-app">
        <Sidebar items={navCustomerBook} activeKey="book"/>
        <div className="jw-main">
          <Topbar userName="Joey" initial="J"/>
          <div className="jw-content" style={{ padding: '0 0 40px' }}>
            <SubscribeGate onSubscribe={() => setHasSubscription(true)}/>
            <div style={{ textAlign: 'center', marginTop: 18, fontSize: 11.5, color: 'var(--jw-text-subtle)' }}>
              <button onClick={() => setHasSubscription(true)} style={{ background: 'transparent', border: 'none', color: 'var(--jw-text-muted)', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11.5 }}>
                (Demo: skip — pretend I have a plan)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="jw-app">
      <Sidebar items={navCustomerBook} activeKey="book"/>
      <div className="jw-main">
        <Topbar userName="Joey" initial="J"/>
        {!confirmed && <Stepper stepIdx={stepIdx} onJump={(i) => { setPickingSpecific(false); setStepIdx(i); }}/>}
        <div className="jw-content" style={{ padding: '28px 32px 0' }}>
          {confirmed ? (
            <ConfirmationScreen summary={summary} onReset={handleReset}/>
          ) : (
            <>
              {stepIdx === 0 && <VehicleStep value={vehicleId} onChange={setVehicleId}/>}
              {stepIdx === 1 && (
                <TechTypeStep
                  techType={techType}
                  onChangeType={handleChangeType}
                  specificTechId={specificTechId}
                  onChangeSpecific={(id) => { setSpecificTechId(id); setPickingSpecific(false); }}
                  pickingSpecific={pickingSpecific}
                  onPickSpecific={() => setPickingSpecific(true)}
                  onClosePick={() => setPickingSpecific(false)}
                />
              )}
              {stepIdx === 2 && <DateTimeStep date={date} time={time} onChangeDate={setDate} onChangeTime={setTime} techType={techType} specificTechName={specificTech?.name}/>}
              {stepIdx === 3 && <ReviewStep summary={summary} address={address} onAddress={setAddress} notes={notes} onNotes={setNotes}/>}
              <StickyFooter stepIdx={stepIdx} canNext={canNext} onBack={() => { if (pickingSpecific) { setPickingSpecific(false); } else { setStepIdx(Math.max(0, stepIdx - 1)); } }} onNext={handleNext} summary={summary}/>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function NoSubFlow() {
  return (
    <div className="jw-app">
      <Sidebar items={navCustomerBook} activeKey="book"/>
      <div className="jw-main">
        <Topbar userName="Joey" initial="J"/>
        <div className="jw-content" style={{ padding: '0 0 40px' }}>
          <SubscribeGate onSubscribe={() => {}}/>
        </div>
      </div>
    </div>
  );
}

function mountBook() {
  const el = document.getElementById('book-root');
  if (el && !el.__mounted) {
    el.__mounted = true;
    ReactDOM.createRoot(el).render(<BookWashFlow/>);
  }
  const el2 = document.getElementById('book-nosub-root');
  if (el2 && !el2.__mounted) {
    el2.__mounted = true;
    ReactDOM.createRoot(el2).render(<NoSubFlow/>);
  }
  if (!el || !el2) {
    requestAnimationFrame(mountBook);
  }
}
mountBook();
