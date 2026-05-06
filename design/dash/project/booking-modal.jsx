// ============================================================
// Booking Modal — Date & Time selection
// 30-min vs 15-min slot density, with bubble-count-aware layouts.
// ============================================================

// 30-min slots, 9a–5p inclusive → 17 slots (9, 9:30, ..., 5:00)
function gen30() {
  const out = [];
  for (let h = 9; h <= 17; h++) {
    out.push(fmt(h, 0));
    if (h !== 17) out.push(fmt(h, 30));
  }
  return out;
}

// 15-min slots, 9a–5p inclusive → 33 slots
function gen15() {
  const out = [];
  for (let h = 9; h <= 17; h++) {
    out.push(fmt(h, 0));
    if (h !== 17) {
      out.push(fmt(h, 15));
      out.push(fmt(h, 30));
      out.push(fmt(h, 45));
    }
  }
  return out;
}

function fmt(h, m) {
  const isPM = h >= 12;
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  const mm = m.toString().padStart(2, '0');
  return `${display}:${mm} ${isPM ? 'PM' : 'AM'}`;
}

// Mock booked slots (for demonstration)
const BOOKED_30 = new Set(['11:30 AM', '2:00 PM', '3:30 PM']);
const BOOKED_15 = new Set(['9:45 AM', '11:15 AM', '11:30 AM', '11:45 AM', '2:00 PM', '2:15 PM', '3:30 PM', '3:45 PM']);

// ------------------------------------------------------------
// Calendar (compact, reused across both variants)
// ------------------------------------------------------------
function MiniCalendar({ selected, onSelect }) {
  // May 2026 — 1st falls on Friday
  const year = 2026, month = 4; // 0-indexed
  const today = 5;
  const daysInMonth = 31;
  const firstDow = new Date(year, month, 1).getDay(); // Sun=0
  const monthLabel = new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const fullDays = new Set([2, 3, 9, 10, 16, 17, 23, 24, 30, 31]); // weekends booked solid in this mock

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--jw-text)' }}>Available Dates</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: '#F3F5F8', fontSize: 12, color: 'var(--jw-text-muted)', fontWeight: 600 }}>
          <button style={btnGhost}><Icon name="arrow-left" size={11}/></button>
          {monthLabel}
          <button style={btnGhost}><Icon name="arrow-right" size={11}/></button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--jw-text-subtle)', textAlign: 'center', padding: '2px 0' }}>{d}</div>
        ))}
        {Array.from({ length: firstDow }).map((_, i) => <div key={`pad-${i}`}/>)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const isPast = day < today;
          const isFull = fullDays.has(day);
          const isSelected = day === selected;
          const disabled = isPast || isFull;
          return (
            <button key={day}
              disabled={disabled}
              onClick={() => onSelect(day)}
              style={{
                aspectRatio: '1 / 1',
                border: 'none',
                borderRadius: 8,
                background: isSelected ? 'var(--jw-cyan)' : disabled ? 'transparent' : '#F3F5F8',
                color: isSelected ? 'white' : disabled ? '#C7CEDB' : 'var(--jw-text)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', fontSize: 12.5,
                fontWeight: isSelected ? 700 : 500,
                transition: 'all 0.12s',
              }}>
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const btnGhost = {
  background: 'transparent', border: 'none', cursor: 'pointer',
  width: 20, height: 20, borderRadius: 6, display: 'inline-flex',
  alignItems: 'center', justifyContent: 'center', color: 'var(--jw-text-muted)',
};

// ------------------------------------------------------------
// Time bubble — the core building block
// ------------------------------------------------------------
function TimeBubble({ label, selected, disabled, onClick, size = 'md' }) {
  const padding = size === 'sm' ? '7px 10px' : size === 'xs' ? '6px 8px' : '10px 14px';
  const fontSize = size === 'sm' ? 11.5 : size === 'xs' ? 11 : 13;
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        padding, fontSize,
        borderRadius: 8,
        border: `1px solid ${selected ? 'var(--jw-cyan)' : disabled ? '#EEF1F5' : '#E5E9F0'}`,
        background: selected ? 'var(--jw-cyan)' : disabled ? '#FAFBFD' : 'white',
        color: selected ? 'white' : disabled ? '#C7CEDB' : 'var(--jw-text)',
        fontWeight: selected ? 700 : 600,
        fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        textDecoration: disabled ? 'line-through' : 'none',
        transition: 'all 0.12s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => { if (!disabled && !selected) { e.currentTarget.style.borderColor = 'var(--jw-cyan)'; e.currentTarget.style.color = 'var(--jw-cyan-strong)'; } }}
      onMouseLeave={e => { if (!disabled && !selected) { e.currentTarget.style.borderColor = '#E5E9F0'; e.currentTarget.style.color = 'var(--jw-text)'; } }}
    >
      {label}
    </button>
  );
}

// ------------------------------------------------------------
// 30-MIN GRID — clean 4-column layout, all bubbles visible
// ------------------------------------------------------------
function ThirtyMinSlots({ selected, onSelect }) {
  const slots = gen30();
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>Available Time Slots</div>
        <div style={{ fontSize: 11, color: 'var(--jw-text-subtle)', fontWeight: 600 }}>30-min slots · 9 AM–5 PM</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {slots.map(s => (
          <TimeBubble key={s} label={s} selected={selected === s} disabled={BOOKED_30.has(s)} onClick={() => onSelect(s)} size="md"/>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// 15-MIN GROUPED — Morning / Afternoon sections, 4-col dense bubbles
// ------------------------------------------------------------
function FifteenMinGrouped({ selected, onSelect }) {
  const slots = gen15();
  const morning = slots.filter(s => s.endsWith('AM'));
  const afternoon = slots.filter(s => s.endsWith('PM'));

  const renderRow = (list) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
      {list.map(s => (
        <TimeBubble key={s} label={s} selected={selected === s} disabled={BOOKED_15.has(s)} onClick={() => onSelect(s)} size="sm"/>
      ))}
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>Available Time Slots</div>
        <div style={{ fontSize: 11, color: 'var(--jw-text-subtle)', fontWeight: 600 }}>15-min slots · 9 AM–5 PM</div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--jw-text-subtle)', marginBottom: 8 }}>
          Morning · {morning.filter(s => !BOOKED_15.has(s)).length} open
        </div>
        {renderRow(morning)}
      </div>

      <div>
        <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--jw-text-subtle)', marginBottom: 8 }}>
          Afternoon · {afternoon.filter(s => !BOOKED_15.has(s)).length} open
        </div>
        {renderRow(afternoon)}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// 15-MIN COLLAPSED — show 30-min anchors, expand inline to 15-min on hover/click
// (Compact: same footprint as 30-min, but every slot is reachable.)
// ------------------------------------------------------------
function FifteenMinCollapsed({ selected, onSelect }) {
  const [expandedHour, setExpandedHour] = React.useState(null);

  const hours = [];
  for (let h = 9; h <= 17; h++) hours.push(h);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>Available Time Slots</div>
        <div style={{ fontSize: 11, color: 'var(--jw-text-subtle)', fontWeight: 600 }}>15-min · click hour to refine</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {hours.map(h => {
          const hourLabel = `${h > 12 ? h - 12 : h} ${h >= 12 ? 'PM' : 'AM'}`;
          const subSlots = h === 17 ? [fmt(h, 0)] : [fmt(h, 0), fmt(h, 15), fmt(h, 30), fmt(h, 45)];
          const allBooked = subSlots.every(s => BOOKED_15.has(s));
          const someBooked = subSlots.some(s => BOOKED_15.has(s));
          const selectedHere = subSlots.includes(selected);
          const isExpanded = expandedHour === h;

          return (
            <div key={h} style={{ position: 'relative' }}>
              <button
                disabled={allBooked}
                onClick={() => setExpandedHour(isExpanded ? null : h)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: `1px solid ${selectedHere || isExpanded ? 'var(--jw-cyan)' : allBooked ? '#EEF1F5' : '#E5E9F0'}`,
                  background: selectedHere ? 'var(--jw-cyan)' : isExpanded ? '#F0F8FE' : allBooked ? '#FAFBFD' : 'white',
                  color: selectedHere ? 'white' : allBooked ? '#C7CEDB' : 'var(--jw-text)',
                  fontWeight: selectedHere ? 700 : 600,
                  fontFamily: 'inherit', fontSize: 13,
                  cursor: allBooked ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  textDecoration: allBooked ? 'line-through' : 'none',
                  transition: 'all 0.12s',
                }}>
                <span>{selectedHere ? selected : hourLabel}</span>
                {!allBooked && (
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: selectedHere ? 'rgba(255,255,255,0.85)' : someBooked ? '#F39C4C' : '#2CB67D', letterSpacing: 0.4 }}>
                    {subSlots.filter(s => !BOOKED_15.has(s)).length}/{subSlots.length}
                  </span>
                )}
              </button>
              {isExpanded && (
                <>
                  <div onClick={() => setExpandedHour(null)} style={{ position: 'fixed', inset: 0, zIndex: 5 }}/>
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                    background: 'white', borderRadius: 10, padding: 6, zIndex: 10,
                    border: '1px solid var(--jw-border)',
                    boxShadow: '0 14px 36px rgba(11, 37, 69, 0.14)',
                    display: 'flex', flexDirection: 'column', gap: 4,
                  }}>
                    {subSlots.map(s => (
                      <TimeBubble key={s} label={s} selected={selected === s} disabled={BOOKED_15.has(s)}
                        onClick={() => { onSelect(s); setExpandedHour(null); }} size="sm"/>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 10, fontSize: 10.5, color: 'var(--jw-text-subtle)', display: 'flex', gap: 14 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2CB67D' }}/>All open
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F39C4C' }}/>Some booked
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'line-through' }}>Full</span>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// 15-MIN COLUMN — vertical scrolling list with sticky hour headers
// (Bubble count is dense, so don't try to fit them all into a fixed grid.)
// ------------------------------------------------------------
function FifteenMinColumn({ selected, onSelect }) {
  const slots = gen15();
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>Available Time Slots</div>
        <div style={{ fontSize: 11, color: 'var(--jw-text-subtle)', fontWeight: 600 }}>{slots.filter(s => !BOOKED_15.has(s)).length} of {slots.length} open</div>
      </div>
      <div style={{
        maxHeight: 280, overflowY: 'auto', paddingRight: 4,
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        {slots.map((s, i) => {
          const isHourMark = s.endsWith(':00 AM') || s.endsWith(':00 PM');
          const disabled = BOOKED_15.has(s);
          const isSelected = selected === s;
          return (
            <button key={s}
              disabled={disabled}
              onClick={() => onSelect(s)}
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                border: `1px solid ${isSelected ? 'var(--jw-cyan)' : disabled ? '#EEF1F5' : '#E5E9F0'}`,
                background: isSelected ? 'var(--jw-cyan)' : disabled ? '#FAFBFD' : 'white',
                color: isSelected ? 'white' : disabled ? '#C7CEDB' : 'var(--jw-text)',
                fontWeight: isSelected ? 700 : isHourMark ? 700 : 500,
                fontFamily: 'inherit', fontSize: 13,
                cursor: disabled ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                textDecoration: disabled ? 'line-through' : 'none',
                textAlign: 'left',
                transition: 'all 0.12s',
              }}>
              <span>{s}</span>
              {disabled && <span style={{ fontSize: 10, fontWeight: 600 }}>booked</span>}
              {isSelected && <Icon name="check" size={13} stroke={3}/>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// THE MODAL SHELL — wraps any time-slot variant
// ------------------------------------------------------------
function BookingModal({ variant, density, onDensityChange, showOverlap = false }) {
  const [date, setDate] = React.useState(7);
  const [time, setTime] = React.useState(density === '30' ? '10:00 AM' : null);
  const [vehicle, setVehicle] = React.useState('large');

  React.useEffect(() => {
    setTime(density === '30' ? '10:00 AM' : null);
  }, [density]);

  let TimeView;
  if (density === '30') TimeView = ThirtyMinSlots;
  else if (variant === 'grouped') TimeView = FifteenMinGrouped;
  else if (variant === 'collapsed') TimeView = FifteenMinCollapsed;
  else TimeView = FifteenMinColumn;

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'rgba(11, 37, 69, 0.42)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 32, fontFamily: 'var(--font)',
    }}>
      <div style={{
        width: '100%', maxWidth: 760,
        background: 'white', borderRadius: 18,
        boxShadow: '0 24px 60px rgba(11, 37, 69, 0.28)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 26px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.3 }}>Select Date & Time</div>
            <div style={{ fontSize: 12.5, color: 'var(--jw-text-muted)', marginTop: 2 }}>Choose a slot and vehicle type to confirm your booking.</div>
          </div>
          <button style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--jw-text-subtle)', padding: 4, borderRadius: 6,
          }}>
            <Icon name="x" size={18}/>
          </button>
        </div>

        {/* Density toggle (sits just below header — controls increment) */}
        <div style={{ padding: '14px 26px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--jw-text-subtle)', letterSpacing: 0.6, textTransform: 'uppercase' }}>Slot length</div>
          <div style={{ display: 'inline-flex', background: '#F3F5F8', borderRadius: 999, padding: 3 }}>
            {['30', '15'].map(d => (
              <button key={d}
                onClick={() => onDensityChange(d)}
                style={{
                  padding: '5px 12px', borderRadius: 999,
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  background: density === d ? 'white' : 'transparent',
                  color: density === d ? 'var(--jw-text)' : 'var(--jw-text-muted)',
                  fontSize: 11.5, fontWeight: 700,
                  boxShadow: density === d ? '0 1px 3px rgba(11,37,69,0.10)' : 'none',
                }}>
                {d} min
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '18px 26px 22px', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 22 }}>
          <MiniCalendar selected={date} onSelect={setDate}/>
          <TimeView selected={time} onSelect={setTime}/>
        </div>

        {/* Vehicle row */}
        <div style={{ padding: '0 26px 18px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Vehicle Type</div>
          <div style={{ fontSize: 11.5, color: 'var(--jw-text-muted)', marginBottom: 10 }}>Select the vehicle type for this booking.</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'sedan', label: 'Sedan / Mid-Size SUV' },
              { id: 'large', label: 'Large SUV / Truck' },
            ].map(v => {
              const sel = vehicle === v.id;
              return (
                <button key={v.id} onClick={() => setVehicle(v.id)} style={{
                  padding: '9px 14px', borderRadius: 8,
                  border: `1px solid ${sel ? 'var(--jw-cyan)' : '#E5E9F0'}`,
                  background: sel ? 'var(--jw-cyan)' : 'white',
                  color: sel ? 'white' : 'var(--jw-text)',
                  fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700,
                  cursor: 'pointer',
                }}>{v.label}</button>
              );
            })}
          </div>
        </div>

        {/* Confirm */}
        <div style={{ padding: '0 26px 18px' }}>
          <button style={{
            width: '100%', padding: '13px',
            borderRadius: 10, border: 'none',
            background: 'var(--jw-navy)', color: 'white',
            fontFamily: 'inherit', fontSize: 14, fontWeight: 700,
            cursor: 'pointer',
          }}>Confirm Booking</button>
        </div>

        {showOverlap && (
          <div style={{
            margin: '0 26px 22px',
            padding: '10px 14px', borderRadius: 10,
            background: '#FFF6E1', border: '1px solid #F5DC9A',
            fontSize: 12, color: '#7A5A14', fontWeight: 600,
          }}>
            You already have a booking that overlaps with this time slot.
          </div>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Wrappers — each renders a complete BookingModal in a fixed mode
// ------------------------------------------------------------
function Modal30() {
  const [density, setDensity] = React.useState('30');
  return <BookingModal variant="grouped" density={density} onDensityChange={setDensity}/>;
}

function Modal15Grouped() {
  const [density, setDensity] = React.useState('15');
  return <BookingModal variant="grouped" density={density} onDensityChange={setDensity}/>;
}

function Modal15Collapsed() {
  const [density, setDensity] = React.useState('15');
  return <BookingModal variant="collapsed" density={density} onDensityChange={setDensity}/>;
}

function Modal15Column() {
  const [density, setDensity] = React.useState('15');
  return <BookingModal variant="column" density={density} onDensityChange={setDensity}/>;
}

function ModalOverlap() {
  const [density, setDensity] = React.useState('30');
  return <BookingModal variant="grouped" density={density} onDensityChange={setDensity} showOverlap/>;
}

window.Modal30 = Modal30;
window.Modal15Grouped = Modal15Grouped;
window.Modal15Collapsed = Modal15Collapsed;
window.Modal15Column = Modal15Column;
window.ModalOverlap = ModalOverlap;
