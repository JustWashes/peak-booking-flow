// ============================================================
// Interactive Booking Flow — multi-step modal
// Steps: Vehicle → Technician Type → Date & Time → Review → Confirmed
// Time picker has TWO views (Column / Bands) toggleable inline.
// ============================================================

const FLOW_VEHICLES = [
  { id: 'v1', label: '2022 Toyota Camry',    sub: 'Sedan · Pearl White · ABC-1234',     size: 'Sedan',   tone: 'blue'  },
  { id: 'v2', label: '2024 Subaru Outback',  sub: 'Mid-SUV · Forest Green · XYZ-9012',  size: 'Mid-SUV', tone: 'green' },
  { id: 'v3', label: '2021 Ford F-150',      sub: 'Truck · Onyx Black · TRK-5567',      size: 'Large',   tone: 'slate' },
];

const FLOW_TECHS = {
  certified: [
    { id: 'c1', name: 'Marcus T.', initial: 'M', tone: 'orange', rating: 4.9, jobs: 412, blurb: 'Background-checked · 5 yrs · Last washed your car Feb 24', distance: '1.2 mi' },
    { id: 'c2', name: 'Sarah K.',  initial: 'S', tone: 'blue',   rating: 4.8, jobs: 287, blurb: 'Background-checked · 3 yrs · Eco-friendly products',           distance: '2.4 mi' },
    { id: 'c3', name: 'Devon R.',  initial: 'D', tone: 'green',  rating: 5.0, jobs: 96,  blurb: 'Background-checked · Closest to you today',                    distance: '0.8 mi' },
  ],
  independent: [
    { id: 'i1', name: 'Theo L.',  initial: 'T', tone: 'purple', rating: 4.7, jobs: 64, blurb: 'Local pro · Verified ID · Available all weekend', distance: '1.6 mi' },
    { id: 'i2', name: 'Priya R.', initial: 'P', tone: 'orange', rating: 4.9, jobs: 38, blurb: 'Local pro · Verified ID · Same-day specialist',   distance: '3.0 mi' },
    { id: 'i3', name: 'Jay W.',   initial: 'J', tone: 'blue',   rating: 4.6, jobs: 21, blurb: 'Local pro · Verified ID · New to JustWashes',     distance: '4.2 mi' },
    { id: 'i4', name: 'Maria F.', initial: 'M', tone: 'green',  rating: 4.8, jobs: 52, blurb: 'Local pro · Verified ID · Bilingual · Fri–Sun',   distance: '2.1 mi' },
  ],
};

function slots30() {
  const out = [];
  for (let h = 9; h <= 17; h++) { out.push(fmtSlot(h, 0)); if (h !== 17) out.push(fmtSlot(h, 30)); }
  return out;
}
function slots15() {
  const out = [];
  for (let h = 9; h <= 17; h++) {
    out.push(fmtSlot(h, 0));
    if (h !== 17) { out.push(fmtSlot(h, 15)); out.push(fmtSlot(h, 30)); out.push(fmtSlot(h, 45)); }
  }
  return out;
}
function fmtSlot(h, m) {
  const isPM = h >= 12;
  const d = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${d}:${m.toString().padStart(2,'0')} ${isPM ? 'PM' : 'AM'}`;
}
function bookedSet({ techType, specificTechId, increment }) {
  const all = increment === '15' ? slots15() : slots30();
  const seed = specificTechId ? specificTechId.charCodeAt(0) + specificTechId.charCodeAt(1) : techType === 'certified' ? 11 : 7;
  const ratio = specificTechId ? 0.42 : techType === 'certified' ? 0.30 : 0.18;
  const taken = new Set();
  all.forEach((s, i) => {
    const r = ((i + 1) * 9301 + seed * 49297) % 233280 / 233280;
    if (r < ratio) taken.add(s);
  });
  return taken;
}

const FLOW_STEPS = [
  { key: 'vehicle',  label: 'Vehicle' },
  { key: 'tech',     label: 'Technician' },
  { key: 'datetime', label: 'Date & Time' },
  { key: 'review',   label: 'Review' },
];

// ---- Stepper ----
function FlowStepper({ stepIdx, onJump, maxReached }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '14px 26px 0' }}>
      {FLOW_STEPS.map((s, i) => {
        const isDone = i < stepIdx;
        const isActive = i === stepIdx;
        const reachable = i <= maxReached;
        return (
          <React.Fragment key={s.key}>
            <button onClick={() => reachable && onJump(i)} disabled={!reachable} style={{
              display: 'flex', alignItems: 'center', gap: 8, background: 'transparent',
              border: 'none', padding: 0, cursor: reachable ? 'pointer' : 'default',
              fontFamily: 'inherit', opacity: reachable ? 1 : 0.5,
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isDone ? '#2CB67D' : isActive ? 'var(--jw-cyan)' : '#EEF2F7',
                color: isDone || isActive ? 'white' : '#94A3B8',
                boxShadow: isActive ? '0 0 0 4px rgba(35,183,236,0.16)' : 'none',
                fontSize: 11.5, fontWeight: 800, transition: 'all 0.2s',
              }}>{isDone ? <Icon name="check" size={12} stroke={3}/> : i + 1}</div>
              <div style={{
                fontSize: 12, fontWeight: isActive ? 800 : 600,
                color: isActive ? 'var(--jw-text)' : isDone ? 'var(--jw-text)' : 'var(--jw-text-muted)',
                whiteSpace: 'nowrap',
              }}>{s.label}</div>
            </button>
            {i < FLOW_STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, margin: '0 12px', borderRadius: 2,
                background: i < stepIdx ? '#2CB67D' : '#EEF2F7', transition: 'background 0.3s' }}/>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ---- Step 1: Vehicle ----
function FlowVehicleStep({ value, onChange }) {
  return (
    <div>
      <h2 style={flowH1}>Which vehicle to service?</h2>
      <p style={flowSub}>Pick a saved vehicle. All washes are exterior — hand-wash, wheels &amp; windows.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
        {FLOW_VEHICLES.map(v => {
          const sel = value === v.id;
          return (
            <button key={v.id} onClick={() => onChange(v.id)} style={{
              textAlign: 'left', padding: 14, borderRadius: 12, background: 'white',
              border: `1.5px solid ${sel ? 'var(--jw-cyan)' : '#E5E9F0'}`,
              boxShadow: sel ? '0 4px 14px rgba(35,183,236,0.14)' : 'none',
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.15s',
            }}>
              <div style={{
                width: 50, height: 50, borderRadius: 10,
                background: v.tone === 'blue'  ? 'linear-gradient(135deg,#DCEEFF,#B7DCFF)'
                         : v.tone === 'green' ? 'linear-gradient(135deg,#DDF3E5,#B6E3C5)'
                                              : 'linear-gradient(135deg,#E5E9F0,#C7CEDB)',
                color: v.tone === 'blue' ? '#3176D6' : v.tone === 'green' ? '#2CB67D' : '#4C5B77',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}><Icon name="car" size={24}/></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{v.label}</div>
                <div style={{ fontSize: 11.5, color: 'var(--jw-text-muted)', marginTop: 2 }}>{v.sub}</div>
              </div>
              <Chip tone="slate">{v.size}</Chip>
              <Radio selected={sel}/>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---- Step 2: Tech type ----
function FlowTypePopover() {
  const [open, setOpen] = React.useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }} style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 4,
        color: 'var(--jw-cyan-strong)', fontSize: 12, fontWeight: 700, fontFamily: 'inherit', padding: 0,
      }}><Icon name="alert" size={12}/> What's the difference?</button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 5 }}/>
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', left: 0,
            width: 360, background: 'white', borderRadius: 12, zIndex: 10,
            border: '1px solid var(--jw-border)', boxShadow: '0 14px 36px rgba(11,37,69,0.14)',
            padding: 16, fontSize: 12.5, color: 'var(--jw-text)', textAlign: 'left',
          }}>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 10 }}>Certified vs. Independent</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th></th>
                <th style={{ textAlign: 'left', color: '#2CB67D', fontWeight: 700, fontSize: 11, padding: '4px 8px' }}>Certified</th>
                <th style={{ textAlign: 'left', color: '#7C5CFF', fontWeight: 700, fontSize: 11, padding: '4px 0' }}>Independent</th>
              </tr></thead>
              <tbody style={{ fontSize: 11.5 }}>
                {[['Background check','✓','✓'],['JustWashes training','✓','—'],['Uniform & equipment','✓','Own gear'],['$2M insurance','✓','Self-insured'],['Same-day availability','Limited','Wider'],['Avg. response time','< 2 hrs','Varies']].map((r, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--jw-border)' }}>
                    <td style={{ padding: '6px 0', color: 'var(--jw-text-muted)' }}>{r[0]}</td>
                    <td style={{ padding: '6px 8px', fontWeight: 600 }}>{r[1]}</td>
                    <td style={{ padding: '6px 0', fontWeight: 600 }}>{r[2]}</td>
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
function FlowTypeStep({ techType, onChangeType, specificTechId, onChangeSpecific, pickingSpecific, onPickSpecific, onClosePick }) {
  if (pickingSpecific) {
    const pool = FLOW_TECHS[techType];
    return (
      <div>
        <button onClick={onClosePick} style={{
          background: 'transparent', border: 'none', color: 'var(--jw-text-muted)',
          fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          display: 'inline-flex', alignItems: 'center', gap: 6, padding: 0, marginBottom: 8,
        }}><Icon name="arrow-left" size={11}/> Back to technician type</button>
        <h2 style={flowH1}>Choose a specific {techType === 'certified' ? 'Certified' : 'Independent'} pro</h2>
        <p style={flowSub}>{pool.length} pros available · we'll only show their open slots next.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
          <button onClick={() => onChangeSpecific(null)} style={specificCard(specificTechId == null)}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,#1EA6E1,#39C1F2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 18, flexShrink: 0 }}>★</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>Any available pro</div>
                <Chip tone="cyan">Fastest match</Chip>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--jw-text-subtle)' }}>We'll match you to the best-rated {techType} pro available.</div>
            </div>
            <Radio selected={specificTechId == null}/>
          </button>
          {pool.map(t => {
            const sel = specificTechId === t.id;
            return (
              <button key={t.id} onClick={() => onChangeSpecific(t.id)} style={specificCard(sel)}>
                <Avatar initial={t.initial} tone={t.tone}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{t.name}</div>
                  <div style={{ display: 'flex', gap: 10, fontSize: 11.5, color: 'var(--jw-text-muted)', marginTop: 2 }}>
                    <span><Icon name="star" size={10} color="#F39C4C"/> {t.rating} · {t.jobs} jobs</span>
                    <span><Icon name="pin" size={10}/> {t.distance}</span>
                  </div>
                </div>
                <Radio selected={sel}/>
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  const types = [
    { key: 'certified',   title: 'Certified Pro',   blurb: 'JustWashes-trained & background-checked. Higher rates, tighter availability, $2M insurance.', accent: '#2CB67D', bullets: ['Trained & background-checked','$2M insurance included','JustWashes uniform & gear'], pool: FLOW_TECHS.certified.length },
    { key: 'independent', title: 'Independent Pro', blurb: 'Local verified pros — own gear, wider availability, often same-day. Great quality at lower spend.', accent: '#7C5CFF', bullets: ['Verified ID','Own equipment & products','More slots, often same-day'], pool: FLOW_TECHS.independent.length },
  ];
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
        <h2 style={flowH1}>What kind of pro?</h2>
        <FlowTypePopover/>
      </div>
      <p style={flowSub}>Your choice affects which slots appear next.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {types.map(t => {
          const sel = techType === t.key;
          return (
            <button key={t.key} onClick={() => onChangeType(t.key)} style={{
              textAlign: 'left', padding: 18, borderRadius: 14, background: 'white',
              border: `1.5px solid ${sel ? t.accent : '#E5E9F0'}`,
              boxShadow: sel ? `0 6px 18px ${t.accent}25` : 'none',
              cursor: 'pointer', fontFamily: 'inherit', position: 'relative', transition: 'all 0.15s',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${t.accent}18`, color: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={t.key === 'certified' ? 'user-check' : 'star'} size={18}/>
                </div>
                <Chip tone="slate">{t.pool} available</Chip>
              </div>
              <div style={{ fontSize: 15.5, fontWeight: 800, letterSpacing: -0.2, marginBottom: 4 }}>{t.title}</div>
              <div style={{ fontSize: 12, color: 'var(--jw-text-muted)', minHeight: 32, lineHeight: 1.4 }}>{t.blurb}</div>
              <hr style={{ border: 0, borderTop: '1px solid #EEF2F7', margin: '12px 0' }}/>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {t.bullets.map(b => (
                  <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: 'var(--jw-text)' }}>
                    <Icon name="check" size={11} stroke={3} color={t.accent}/>{b}
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>
      <div style={{
        marginTop: 14, padding: 14, borderRadius: 12, background: '#F7FBFE',
        border: '1px dashed #B6DFF0', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#CDEEFB', color: 'var(--jw-cyan-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="user-check" size={16}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Have someone in mind?</div>
          <div style={{ fontSize: 11.5, color: 'var(--jw-text-muted)', marginTop: 1 }}>
            Pick a specific {techType === 'certified' ? 'Certified' : 'Independent'} pro — we'll show only their slots.
          </div>
        </div>
        <button onClick={onPickSpecific} style={btnOutline}>
          {specificTechId ? 'Change pick' : 'Pick a specific pro'} <Icon name="chevron-right" size={11}/>
        </button>
      </div>
      {specificTechId && (
        <div style={{ marginTop: 8, padding: 10, borderRadius: 10, background: '#E0F5EA', border: '1px solid #B8E3CE', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="check-circle" size={14} color="#2CB67D"/>
          <div style={{ fontSize: 12, color: '#1E7A52' }}>Booking specifically with <b>{FLOW_TECHS[techType].find(t => t.id === specificTechId)?.name}</b>.</div>
          <button onClick={() => onChangeSpecific(null)} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#1E7A52', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Clear</button>
        </div>
      )}
    </div>
  );
}

// ---- Step 3: Date & Time ----
function FlowMiniCalendar({ selected, onSelect }) {
  const year = 2026, month = 4, today = 5;
  const daysInMonth = 31;
  const firstDow = new Date(year, month, 1).getDay();
  const monthLabel = new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const fullDays = new Set([2,3,9,10,16,17]);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>Available Dates</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700 }}>
          <button style={btnGhostSm}><Icon name="arrow-left" size={11}/></button>
          {monthLabel}
          <button style={btnGhostSm}><Icon name="arrow-right" size={11}/></button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--jw-text-subtle)', textAlign: 'center', padding: '2px 0' }}>{d}</div>
        ))}
        {Array.from({ length: firstDow }).map((_, i) => <div key={`p-${i}`}/>)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const isPast = day < today, isFull = fullDays.has(day), sel = day === selected;
          const disabled = isPast || isFull, isToday = day === today;
          return (
            <button key={day} disabled={disabled} onClick={() => onSelect(day)} style={{
              aspectRatio: '1 / 1',
              border: `1.5px solid ${sel ? 'var(--jw-cyan)' : 'transparent'}`, borderRadius: 8,
              background: sel ? 'var(--jw-cyan)' : disabled ? 'transparent' : isToday ? '#F0F8FE' : '#F3F5F8',
              color: sel ? 'white' : disabled ? '#C7CEDB' : isToday ? 'var(--jw-cyan-strong)' : 'var(--jw-text)',
              cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: 12,
              fontWeight: sel || isToday ? 800 : 500,
              textDecoration: isFull ? 'line-through' : 'none', transition: 'all 0.12s',
            }}>{day}</button>
          );
        })}
      </div>
    </div>
  );
}
function TimeColumn({ slots, booked, value, onChange }) {
  return (
    <div style={{ maxHeight: 296, overflowY: 'auto', paddingRight: 6, display: 'flex', flexDirection: 'column', gap: 5 }}>
      {slots.map(s => {
        const isHour = /:00 /.test(s);
        const disabled = booked.has(s), sel = value === s;
        return (
          <button key={s} disabled={disabled} onClick={() => onChange(s)} style={{
            padding: '9px 12px', borderRadius: 8,
            border: `1px solid ${sel ? 'var(--jw-cyan)' : disabled ? '#EEF1F5' : '#E5E9F0'}`,
            background: sel ? 'var(--jw-cyan)' : disabled ? '#FAFBFD' : 'white',
            color: sel ? 'white' : disabled ? '#C7CEDB' : 'var(--jw-text)',
            fontWeight: sel ? 700 : isHour ? 700 : 500, fontFamily: 'inherit', fontSize: 12.5,
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            textDecoration: disabled ? 'line-through' : 'none', textAlign: 'left', transition: 'all 0.12s',
          }}>
            <span>{s}</span>
            {disabled ? <span style={{ fontSize: 10, fontWeight: 600 }}>booked</span>
              : sel ? <Icon name="check" size={12} stroke={3}/>
              : isHour && <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--jw-text-subtle)', letterSpacing: 0.5, textTransform: 'uppercase' }}>hour</span>}
          </button>
        );
      })}
    </div>
  );
}
function TimeBands({ slots, booked, value, onChange }) {
  const hours = []; for (let h = 9; h <= 17; h++) hours.push(h);
  const slotsForHour = (h) => slots.filter(s => {
    const [hh, rest] = s.split(':');
    const isPM = rest.includes('PM');
    const num = parseInt(hh, 10) === 12 ? (isPM ? 12 : 0) : parseInt(hh, 10) + (isPM ? 12 : 0);
    return num === h;
  });
  return (
    <div style={{ maxHeight: 296, overflowY: 'auto', paddingRight: 6, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {hours.map(h => {
        const list = slotsForHour(h);
        if (list.length === 0) return null;
        const open = list.filter(s => !booked.has(s)).length;
        const allBooked = open === 0;
        const hourLabel = `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? 'PM' : 'AM'}`;
        return (
          <div key={h} style={{ border: '1px solid #E5E9F0', borderRadius: 10, padding: 10, background: allBooked ? '#FAFBFD' : 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: allBooked ? 'var(--jw-text-subtle)' : 'var(--jw-text)' }}>{hourLabel}</div>
              <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', color: allBooked ? 'var(--jw-text-subtle)' : open <= 1 ? '#F39C4C' : '#2CB67D' }}>
                {allBooked ? 'Full' : `${open} open`}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${list.length}, 1fr)`, gap: 5 }}>
              {list.map(s => {
                const disabled = booked.has(s), sel = value === s;
                const minutes = s.split(':')[1].split(' ')[0];
                return (
                  <button key={s} disabled={disabled} onClick={() => onChange(s)} style={{
                    padding: '8px 0', borderRadius: 7,
                    border: `1px solid ${sel ? 'var(--jw-cyan)' : disabled ? '#EEF1F5' : '#E5E9F0'}`,
                    background: sel ? 'var(--jw-cyan)' : disabled ? '#FAFBFD' : '#F7F9FC',
                    color: sel ? 'white' : disabled ? '#C7CEDB' : 'var(--jw-text)',
                    fontWeight: sel ? 800 : 600, fontFamily: 'inherit', fontSize: 11.5,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    textDecoration: disabled ? 'line-through' : 'none', transition: 'all 0.12s',
                  }}>:{minutes}</button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
function FlowDateTimeStep({ date, time, onChangeDate, onChangeTime, techType, specificTech, increment, onIncrement, viewMode, onViewMode }) {
  const slots = increment === '15' ? slots15() : slots30();
  const booked = React.useMemo(() => bookedSet({ techType, specificTechId: specificTech?.id, increment }), [techType, specificTech?.id, increment]);
  React.useEffect(() => { if (time && !slots.includes(time)) onChangeTime(null); }, [increment]); // eslint-disable-line
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h2 style={flowH1}>Pick a date &amp; time</h2>
          <p style={flowSub}>
            Showing availability for{' '}
            {specificTech ? <><b>{specificTech.name}</b> ({techType})</> : <><b>{techType === 'certified' ? 'Certified' : 'Independent'} pros</b></>}.
          </p>
        </div>
        <div style={{ display: 'inline-flex', background: '#F3F5F8', borderRadius: 999, padding: 3 }}>
          {['30','15'].map(d => (
            <button key={d} onClick={() => onIncrement(d)} style={{
              padding: '5px 12px', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              background: increment === d ? 'white' : 'transparent',
              color: increment === d ? 'var(--jw-text)' : 'var(--jw-text-muted)',
              fontSize: 11.5, fontWeight: 700,
              boxShadow: increment === d ? '0 1px 3px rgba(11,37,69,0.10)' : 'none',
            }}>{d} min</button>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
        <div style={{ border: '1px solid #E5E9F0', borderRadius: 12, padding: 14, background: 'white' }}>
          <FlowMiniCalendar selected={date} onSelect={onChangeDate}/>
        </div>
        <div style={{ border: '1px solid #E5E9F0', borderRadius: 12, padding: 14, background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>
              {date ? `May ${date}` : 'Pick a date'}
              <span style={{ fontSize: 11, color: 'var(--jw-text-subtle)', fontWeight: 600, marginLeft: 6 }}>
                · {slots.filter(s => !booked.has(s)).length} of {slots.length} open
              </span>
            </div>
            <div style={{ display: 'inline-flex', background: '#F3F5F8', borderRadius: 8, padding: 2 }}>
              {[{ id: 'column', icon: 'doc', label: 'List' }, { id: 'bands', icon: 'calendar', label: 'Bands' }].map(v => (
                <button key={v.id} onClick={() => onViewMode(v.id)} style={{
                  padding: '4px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  background: viewMode === v.id ? 'white' : 'transparent',
                  color: viewMode === v.id ? 'var(--jw-text)' : 'var(--jw-text-muted)',
                  fontSize: 10.5, fontWeight: 700,
                  boxShadow: viewMode === v.id ? '0 1px 3px rgba(11,37,69,0.08)' : 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}><Icon name={v.icon} size={11}/>{v.label}</button>
              ))}
            </div>
          </div>
          {viewMode === 'column'
            ? <TimeColumn slots={slots} booked={booked} value={time} onChange={onChangeTime}/>
            : <TimeBands slots={slots} booked={booked} value={time} onChange={onChangeTime}/>}
        </div>
      </div>
      {time && (
        <div style={{
          marginTop: 12, padding: 11, borderRadius: 10, background: '#F0F8FE', border: '1px solid #B6DFF0',
          fontSize: 12.5, color: '#1E6FA8', display: 'flex', gap: 10, alignItems: 'center',
        }}>
          <Icon name="check-circle" size={14} color="#1E6FA8"/>
          <div>Selected <b>May {date}</b> at <b>{time}</b>. Free reschedule up to 4 hours before.</div>
        </div>
      )}
    </div>
  );
}

// ---- Step 4: Review ----
function FlowReviewStep({ summary }) {
  const tech = summary.specificTech;
  return (
    <div>
      <h2 style={flowH1}>Review &amp; confirm</h2>
      <p style={flowSub}>One last look — tap any step above to change anything.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Row icon="droplet" iconBg="#CDEEFB" iconColor="var(--jw-cyan-strong)"
             label="Service · Vehicle" value={`Exterior wash · ${summary.vehicle.label}`} chip={<Chip tone="cyan">1 credit</Chip>}/>
        <Row icon="calendar" iconBg="#E0F5EA" iconColor="#2CB67D"
             label="When" value={`${summary.dateLabel} · ${summary.time}`} chip={<Chip tone="slate">{summary.increment} min slots</Chip>}/>
        <div style={{
          padding: 14, borderRadius: 12, border: '1.5px solid var(--jw-cyan)',
          background: 'linear-gradient(180deg, #F0F8FE, white)',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          {tech ? <Avatar initial={tech.initial} tone={tech.tone}/>
            : <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#1EA6E1,#39C1F2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16 }}>★</div>}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--jw-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Your technician</div>
            <div style={{ fontSize: 14.5, fontWeight: 800, marginTop: 1 }}>
              {tech ? tech.name : `Any ${summary.techType === 'certified' ? 'Certified' : 'Independent'} Pro`}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--jw-text-muted)', marginTop: 1 }}>
              {tech ? <>★ {tech.rating} · {tech.jobs} jobs · {tech.distance} away</>
                : <>{summary.techType === 'certified' ? 'Certified pool' : 'Independent pool'} · we'll match you the best one</>}
            </div>
          </div>
          <Chip tone={summary.techType === 'certified' ? 'green' : 'purple'}>
            {summary.techType === 'certified' ? 'Certified' : 'Independent'}
          </Chip>
        </div>
        <Row icon="pin" iconBg="#FFF6E1" iconColor="#B88724" label="Service address" value="1428 Maple St, Palo Alto, CA 94301" action="Change"/>
      </div>
    </div>
  );
}
function Row({ icon, iconBg, iconColor, label, value, chip, action }) {
  return (
    <div style={{ padding: 12, borderRadius: 12, background: 'white', border: '1px solid #E5E9F0', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: iconBg, color: iconColor, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={16}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: 'var(--jw-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
        <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 1 }}>{value}</div>
      </div>
      {chip}
      {action && <button style={{ background: 'transparent', border: 'none', color: 'var(--jw-cyan-strong)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{action}</button>}
    </div>
  );
}

// ---- Confirmation ----
function FlowConfirmation({ summary, onReset }) {
  const tech = summary.specificTech;
  const techName = tech ? tech.name : `your ${summary.techType === 'certified' ? 'Certified' : 'Independent'} Pro`;
  return (
    <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #4FD1A3, #2CB67D)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white',
        boxShadow: '0 10px 24px rgba(44, 182, 125, 0.32)', marginBottom: 16,
      }}><Icon name="check" size={36} stroke={3}/></div>
      <h1 style={{ ...flowH1, fontSize: 24, marginBottom: 4 }}>Booking confirmed!</h1>
      <p style={flowSub}>Confirmation #JW-3047 sent to joey@email.com.</p>
      <div style={{ textAlign: 'left', padding: 16, marginTop: 18, background: 'white', border: '1px solid #E5E9F0', borderRadius: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--jw-text-subtle)' }}>Booking summary</div>
          <Chip tone="green" dot>Confirmed</Chip>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, borderBottom: '1px solid #EEF2F7' }}>
          {tech ? <Avatar initial={tech.initial} tone={tech.tone}/>
            : <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#1EA6E1,#39C1F2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16 }}>★</div>}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 800 }}>{techName}</div>
            <div style={{ fontSize: 11.5, color: 'var(--jw-text-muted)', marginTop: 1 }}>
              {tech ? <>★ {tech.rating} · {tech.distance}</> : `${summary.techType === 'certified' ? 'Certified' : 'Independent'} pool`}
            </div>
          </div>
          <Chip tone={summary.techType === 'certified' ? 'green' : 'purple'}>
            {summary.techType === 'certified' ? 'Certified' : 'Independent'}
          </Chip>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: 12 }}>
          <Cell label="When" value={`${summary.dateLabel} · ${summary.time}`}/>
          <Cell label="Vehicle" value={summary.vehicle.label}/>
          <Cell label="Service" value="Exterior wash"/>
          <Cell label="Charged" value="1 wash credit" green/>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16 }}>
        <button style={btnPrimary}><Icon name="calendar" size={12}/> Add to calendar</button>
        <button style={btnOutline} onClick={onReset}>Book another</button>
      </div>
    </div>
  );
}
function Cell({ label, value, green }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--jw-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 13.5, fontWeight: 800, marginTop: 2, color: green ? 'var(--jw-green)' : 'var(--jw-text)' }}>{value}</div>
    </div>
  );
}

// ---- Side summary panel ----
function FlowSummaryPanel({ summary, stepIdx }) {
  const tech = summary.specificTech;
  const techName = tech ? tech.name : summary.techType ? `Any ${summary.techType === 'certified' ? 'Certified' : 'Independent'} Pro` : null;
  const items = [
    { label: 'Vehicle', value: summary.vehicle?.label, fill: stepIdx > 0 },
    { label: 'Technician', value: techName, fill: stepIdx > 1 && techName },
    { label: 'When', value: summary.time && summary.dateLabel ? `${summary.dateLabel} · ${summary.time}` : null, fill: stepIdx > 2 && summary.time },
  ];
  return (
    <div style={{
      background: 'linear-gradient(160deg, #0B2545 0%, #153864 100%)', color: 'white',
      borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 16,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(35,183,236,0.25), rgba(35,183,236,0) 70%)', pointerEvents: 'none' }}/>
      <div>
        <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>Your booking</div>
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.3, marginTop: 4 }}>Exterior wash</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>Hand-wash · wheels · windows · ~45 min</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, opacity: it.fill ? 1 : 0.5 }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: it.fill ? '#2CB67D' : 'rgba(255,255,255,0.1)',
              border: it.fill ? 'none' : '1px dashed rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
            }}>{it.fill && <Icon name="check" size={11} stroke={3}/>}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>{it.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginTop: 1, color: 'white', wordBreak: 'break-word' }}>
                {it.value || <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Not selected yet</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
      <hr style={{ border: 0, borderTop: '1px solid rgba(255,255,255,0.1)', margin: 0 }}/>
      <div>
        <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>Cost</div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4, marginTop: 4 }}>1 credit</div>
        <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.65)', marginTop: 1 }}>2 of 3 will remain after booking</div>
      </div>
    </div>
  );
}

// ---- Modal shell ----
function BookingFlowModal() {
  const [stepIdx, setStepIdx] = React.useState(0);
  const [maxReached, setMaxReached] = React.useState(0);
  const [confirmed, setConfirmed] = React.useState(false);
  const [vehicleId, setVehicleId] = React.useState('v1');
  const [techType, setTechType] = React.useState('certified');
  const [specificTechId, setSpecificTechId] = React.useState(null);
  const [pickingSpecific, setPickingSpecific] = React.useState(false);
  const [date, setDate] = React.useState(7);
  const [time, setTime] = React.useState(null);
  const [increment, setIncrement] = React.useState('30');
  const [viewMode, setViewMode] = React.useState('column');

  const vehicle = FLOW_VEHICLES.find(v => v.id === vehicleId);
  const specificTech = specificTechId ? FLOW_TECHS[techType].find(t => t.id === specificTechId) : null;
  const dateLabel = `Thu May ${date}`;
  const summary = { vehicle, techType, specificTech, date, dateLabel, time, increment };

  const canNext = (() => {
    if (stepIdx === 0) return !!vehicleId;
    if (stepIdx === 1) return !pickingSpecific;
    if (stepIdx === 2) return !!date && !!time;
    if (stepIdx === 3) return true;
    return false;
  })();

  const handleNext = () => {
    if (stepIdx === FLOW_STEPS.length - 1) { setConfirmed(true); return; }
    const next = stepIdx + 1; setStepIdx(next); setMaxReached(Math.max(maxReached, next));
  };
  const handleBack = () => {
    if (pickingSpecific) { setPickingSpecific(false); return; }
    setStepIdx(Math.max(0, stepIdx - 1));
  };
  const handleReset = () => { setConfirmed(false); setStepIdx(0); setMaxReached(0); setTime(null); };

  return (
    <div style={{
      width: '100%', minHeight: '100vh',
      background: 'linear-gradient(160deg, #1B2E4B 0%, #0B2545 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px', fontFamily: 'var(--font)',
    }}>
      <div style={{
        width: '100%', maxWidth: 980, background: '#F7F9FC', borderRadius: 18,
        boxShadow: '0 30px 70px rgba(0,0,0,0.35)', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          padding: '18px 26px', background: 'white', borderBottom: '1px solid #E5E9F0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1EA6E1, #39C1F2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Icon name="droplet" size={18}/>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.2 }}>Book a wash</div>
              <div style={{ fontSize: 11.5, color: 'var(--jw-text-muted)' }}>JustWashes · Plus plan · 3 credits</div>
            </div>
          </div>
          <button style={{ background: '#F3F5F8', border: 'none', cursor: 'pointer', color: 'var(--jw-text-muted)', padding: 8, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="x" size={16}/>
          </button>
        </div>

        {!confirmed && (
          <div style={{ background: 'white' }}>
            <FlowStepper stepIdx={stepIdx} onJump={(i) => { setPickingSpecific(false); setStepIdx(i); }} maxReached={maxReached}/>
            <div style={{ height: 14 }}/>
          </div>
        )}

        <div style={{
          flex: 1, padding: confirmed ? '24px 26px 16px' : '20px 26px 16px',
          display: 'grid', gridTemplateColumns: confirmed ? '1fr' : '1.55fr 1fr', gap: 20, background: '#F7F9FC',
        }}>
          <div>
            {confirmed ? <FlowConfirmation summary={summary} onReset={handleReset}/> : (
              <>
                {stepIdx === 0 && <FlowVehicleStep value={vehicleId} onChange={setVehicleId}/>}
                {stepIdx === 1 && (
                  <FlowTypeStep
                    techType={techType}
                    onChangeType={(t) => { setTechType(t); setSpecificTechId(null); }}
                    specificTechId={specificTechId}
                    onChangeSpecific={(id) => { setSpecificTechId(id); setPickingSpecific(false); }}
                    pickingSpecific={pickingSpecific}
                    onPickSpecific={() => setPickingSpecific(true)}
                    onClosePick={() => setPickingSpecific(false)}
                  />
                )}
                {stepIdx === 2 && (
                  <FlowDateTimeStep
                    date={date} time={time} onChangeDate={setDate} onChangeTime={setTime}
                    techType={techType} specificTech={specificTech}
                    increment={increment} onIncrement={setIncrement}
                    viewMode={viewMode} onViewMode={setViewMode}
                  />
                )}
                {stepIdx === 3 && <FlowReviewStep summary={summary}/>}
              </>
            )}
          </div>
          {!confirmed && <FlowSummaryPanel summary={summary} stepIdx={stepIdx}/>}
        </div>

        {!confirmed && (
          <div style={{
            padding: '14px 26px', background: 'white', borderTop: '1px solid #E5E9F0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ fontSize: 11.5, color: 'var(--jw-text-muted)' }}>
              Step <b style={{ color: 'var(--jw-text)' }}>{stepIdx + 1}</b> of {FLOW_STEPS.length}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {(stepIdx > 0 || pickingSpecific) && (
                <button onClick={handleBack} style={btnOutline}><Icon name="arrow-left" size={12}/> Back</button>
              )}
              <button onClick={handleNext} disabled={!canNext} style={{
                ...btnPrimary, opacity: canNext ? 1 : 0.4, cursor: canNext ? 'pointer' : 'not-allowed',
              }}>
                {stepIdx === FLOW_STEPS.length - 1
                  ? <><Icon name="check" size={12} stroke={3}/> Confirm booking</>
                  : <>Continue <Icon name="arrow-right" size={12}/></>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Style helpers ----
const flowH1 = { fontSize: 20, fontWeight: 800, letterSpacing: -0.3, margin: 0, color: 'var(--jw-text)' };
const flowSub = { fontSize: 12.5, color: 'var(--jw-text-muted)', margin: '4px 0 16px' };
const btnPrimary = {
  padding: '10px 16px', borderRadius: 999, border: 'none', background: 'var(--jw-cyan)', color: 'white',
  fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(35,183,236,0.30)',
};
const btnOutline = {
  padding: '10px 16px', borderRadius: 999, background: 'white', border: '1px solid #E5E9F0',
  color: 'var(--jw-text)', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', gap: 6,
};
const btnGhostSm = {
  background: 'transparent', border: 'none', cursor: 'pointer', width: 22, height: 22, borderRadius: 6,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--jw-text-muted)',
};
const specificCard = (sel) => ({
  textAlign: 'left', padding: 12, borderRadius: 12, background: 'white', cursor: 'pointer', fontFamily: 'inherit',
  border: `1.5px solid ${sel ? 'var(--jw-cyan)' : '#E5E9F0'}`,
  boxShadow: sel ? '0 4px 14px rgba(35,183,236,0.14)' : 'none',
  display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.15s',
});
function Radio({ selected }) {
  return (
    <div style={{
      width: 20, height: 20, borderRadius: '50%',
      border: `2px solid ${selected ? 'var(--jw-cyan)' : '#D8DEE8'}`,
      background: selected ? 'var(--jw-cyan)' : 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0,
    }}>{selected && <Icon name="check" size={11} stroke={3}/>}</div>
  );
}

function mountFlow() {
  const el = document.getElementById('flow-root') || document.getElementById('root');
  if (el && !el.__mounted) {
    el.__mounted = true;
    ReactDOM.createRoot(el).render(<BookingFlowModal/>);
  } else if (!el) {
    requestAnimationFrame(mountFlow);
  }
}
mountFlow();
