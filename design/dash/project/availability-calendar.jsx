// ============================================================
// Availability Calendar — shareable module
// Two-phase UI: weekly defaults → monthly calendar with per-day overrides
//
// Exports (on window):
//   AvailabilityCalendar — the full two-phase widget
//   WeeklyDefaultsEditor — just phase 1
//   MonthCalendar       — just phase 2 (calendar + day editor)
//   AVAIL_DAYS, AVAIL_DEFAULT_RANGES
//   availHelpers        — { fmtTime, rangeLabel, hoursForRanges, getDayRanges }
// ============================================================

const AVAIL_DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const AVAIL_DEFAULT_RANGES = [
  { start: '09:00', end: '11:00' },
  { start: '15:00', end: '20:00' },
];

function fmtTime(t) {
  const [h, m] = t.split(':').map(Number);
  const ap = h >= 12 ? 'p' : 'a';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12}${ap}` : `${h12}:${String(m).padStart(2,'0')}${ap}`;
}
function rangeLabel(r) { return `${fmtTime(r.start)}–${fmtTime(r.end)}`; }
function hoursForRanges(ranges) {
  return ranges.reduce((sum, r) => {
    const [sh, sm] = r.start.split(':').map(Number);
    const [eh, em] = r.end.split(':').map(Number);
    return sum + Math.max(0, (eh + em/60) - (sh + sm/60));
  }, 0);
}
function defaultWeekly() {
  return AVAIL_DAYS.reduce((acc, d) => {
    const isWeekend = d === 'Sat' || d === 'Sun';
    acc[d] = { active: !isWeekend, ranges: AVAIL_DEFAULT_RANGES.map(r => ({ ...r })) };
    return acc;
  }, {});
}
function getDayRanges(dateStr, weekly, overrides) {
  if (overrides && overrides[dateStr]) return overrides[dateStr];
  const d = new Date(dateStr + 'T12:00:00');
  const dayName = AVAIL_DAYS[(d.getDay() + 6) % 7];
  const wk = weekly[dayName];
  if (!wk || !wk.active) return { active: false, ranges: [] };
  return { active: true, ranges: wk.ranges, inherited: true };
}

// ------------------------------------------------------------
// TimeRangeRow — one start–end pair, with optional remove
// ------------------------------------------------------------
function TimeRangeRow({ range, onChange, onRemove, removable }) {
  return (
    <div className="onb-range-row">
      <input type="time" className="onb-input onb-time-input"
        value={range.start} onChange={e => onChange({ ...range, start: e.target.value })}/>
      <span style={{ color: 'var(--jw-text-subtle)', fontSize: 12 }}>to</span>
      <input type="time" className="onb-input onb-time-input"
        value={range.end} onChange={e => onChange({ ...range, end: e.target.value })}/>
      {removable && (
        <button className="onb-range-remove" onClick={onRemove} aria-label="Remove">
          <Icon name="x" size={12} stroke={2.5}/>
        </button>
      )}
    </div>
  );
}

// ------------------------------------------------------------
// WeeklyDefaultsEditor — Phase 1
// Props: weekly, onChange(weekly), heading (optional ReactNode), footer (optional)
// ------------------------------------------------------------
function WeeklyDefaultsEditor({ weekly, onChange, heading, footer }) {
  const setDay = (d, next) => onChange({ ...weekly, [d]: next });
  const weeklyHours = AVAIL_DAYS.reduce((sum, d) => sum + (weekly[d].active ? hoursForRanges(weekly[d].ranges) : 0), 0);
  const activeDays = AVAIL_DAYS.filter(d => weekly[d].active).length;

  return (
    <div className="onb-fade">
      {heading !== undefined ? heading : (
        <div className="onb-step-heading">
          <div>
            <h2 className="onb-h2">Set your default week</h2>
            <p className="onb-sub">These hours copy across every week. Override specific days on the calendar.</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Chip tone="cyan">{activeDays} days / wk</Chip>
            <Chip tone="orange">{weeklyHours.toFixed(1)}h / wk</Chip>
          </div>
        </div>
      )}

      <div className="onb-weekly-grid">
        {AVAIL_DAYS.map(d => {
          const day = weekly[d];
          return (
            <div key={d} className={`onb-day-card ${day.active ? 'on' : 'off'}`}>
              <div className="onb-day-card-hdr">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button className={`onb-switch ${day.active ? 'on' : ''}`}
                    onClick={() => setDay(d, { ...day, active: !day.active })}
                    aria-label={`Toggle ${d}`}>
                    <div className="onb-switch-knob"/>
                  </button>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{d}</div>
                    <div style={{ fontSize: 11, color: 'var(--jw-text-muted)' }}>
                      {day.active ? `${hoursForRanges(day.ranges).toFixed(1)}h · ${day.ranges.length} block${day.ranges.length > 1 ? 's' : ''}` : 'Unavailable'}
                    </div>
                  </div>
                </div>
                {day.active && (
                  <button className="onb-add-range" onClick={() => setDay(d, { ...day, ranges: [...day.ranges, { start: '13:00', end: '15:00' }] })}>
                    <Icon name="plus" size={12} stroke={2.5}/> Add
                  </button>
                )}
              </div>
              {day.active && (
                <div className="onb-day-ranges">
                  {day.ranges.map((r, i) => (
                    <TimeRangeRow key={i} range={r}
                      removable={day.ranges.length > 1}
                      onChange={(next) => setDay(d, { ...day, ranges: day.ranges.map((x, j) => j === i ? next : x) })}
                      onRemove={() => setDay(d, { ...day, ranges: day.ranges.filter((_, j) => j !== i) })}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {footer !== undefined ? footer : null}
    </div>
  );
}

// ------------------------------------------------------------
// MonthCalendar — Phase 2
// Props: year, month (0-indexed), today (Date), weekly, overrides, onOverridesChange
//        selectedDate (string | null), onSelectDate, onBack (optional header button), heading
// ------------------------------------------------------------
function MonthCalendar({
  year = 2026,
  month = 3,
  today = new Date(2026, 3, 24),
  weekly,
  overrides = {},
  onOverridesChange,
  selectedDate,
  onSelectDate,
  onBack,
  heading,
  monthLabel,
}) {
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  const daysInMonth = monthEnd.getDate();
  const firstDow = (monthStart.getDay() + 6) % 7;

  const label = monthLabel || monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const selectedInfo = selectedDate ? getDayRanges(selectedDate, weekly, overrides) : null;
  const overrideDay = (updater) => {
    const cur = getDayRanges(selectedDate, weekly, overrides);
    const next = updater({ ...cur, ranges: cur.ranges.map(r => ({ ...r })), inherited: false });
    onOverridesChange({ ...overrides, [selectedDate]: { active: next.active, ranges: next.ranges } });
  };
  const revertDay = () => {
    const { [selectedDate]: _, ...rest } = overrides;
    onOverridesChange(rest);
  };

  const monthHours = (() => {
    let sum = 0;
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
      const info = getDayRanges(dateStr, weekly, overrides);
      if (info.active) sum += hoursForRanges(info.ranges);
    }
    return sum;
  })();
  const overrideCount = Object.keys(overrides).length;

  return (
    <div className="onb-fade">
      {heading !== undefined ? heading : (
        <div className="onb-step-heading">
          <div>
            <h2 className="onb-h2">{label} calendar</h2>
            <p className="onb-sub">Tap any day to add extra blocks, shorten hours, or take the day off.</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Chip tone="cyan">{monthHours.toFixed(0)}h / mo</Chip>
            <Chip tone="orange">{overrideCount} override{overrideCount !== 1 ? 's' : ''}</Chip>
          </div>
        </div>
      )}

      <div className="onb-calendar-layout">
        <div className="onb-calendar">
          <div className="onb-cal-hdr">
            {onBack ? (
              <button className="onb-cal-nav" onClick={onBack}>
                <Icon name="arrow-left" size={12} stroke={2.5}/> Edit weekly defaults
              </button>
            ) : <div/>}
            <div style={{ fontWeight: 700, fontSize: 15 }}>{label}</div>
            <div/>
          </div>
          <div className="onb-cal-grid">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
              <div key={d} className="onb-cal-dow">{d}</div>
            ))}
            {Array.from({ length: firstDow }).map((_, i) => <div key={`pad-${i}`} className="onb-cal-pad"/>)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
              const info = getDayRanges(dateStr, weekly, overrides);
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const isPast = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
              const isSelected = dateStr === selectedDate;
              const overridden = !!overrides[dateStr];
              return (
                <button key={day}
                  className={`onb-cal-day ${info.active ? 'active' : 'off'} ${isToday ? 'today' : ''} ${isPast ? 'past' : ''} ${isSelected ? 'selected' : ''} ${overridden ? 'overridden' : ''}`}
                  onClick={() => onSelectDate(dateStr)}>
                  <div className="onb-cal-daynum">{day}</div>
                  {info.active ? (
                    <div className="onb-cal-blocks">
                      {info.ranges.slice(0, 2).map((r, i) => (
                        <div key={i} className="onb-cal-block">{rangeLabel(r)}</div>
                      ))}
                      {info.ranges.length > 2 && <div className="onb-cal-more">+{info.ranges.length - 2}</div>}
                    </div>
                  ) : (
                    <div className="onb-cal-off">Off</div>
                  )}
                </button>
              );
            })}
          </div>
          <div className="onb-cal-legend">
            <div><span className="onb-legend-sw default"/>Available</div>
            <div><span className="onb-legend-sw off"/>Day off</div>
          </div>
        </div>

        <aside className="onb-day-editor">
          {!selectedDate ? (
            <div className="onb-day-empty">
              <Icon name="calendar" size={28} color="#94A3B8"/>
              <div style={{ fontWeight: 700, fontSize: 14, marginTop: 10 }}>Pick a day to edit</div>
              <div style={{ fontSize: 12, color: 'var(--jw-text-muted)', textAlign: 'center', marginTop: 4, lineHeight: 1.5 }}>
                Click any date to add extra time blocks (e.g. 8–11 and 12–3), or mark that day as unavailable.
              </div>
            </div>
          ) : (
            <>
              <div className="onb-day-edit-hdr">
                <div>
                  <div style={{ fontSize: 11.5, color: 'var(--jw-text-subtle)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' })}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.3 }}>
                    {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>

              <div className="onb-active-toggle">
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>Available this day</div>
                  <div style={{ fontSize: 11.5, color: 'var(--jw-text-muted)' }}>
                    {selectedInfo.active ? `${hoursForRanges(selectedInfo.ranges).toFixed(1)} hours scheduled` : 'No jobs will be booked'}
                  </div>
                </div>
                <button className={`onb-switch ${selectedInfo.active ? 'on' : ''}`}
                  onClick={() => overrideDay(cur => ({
                    ...cur,
                    active: !cur.active,
                    ranges: !cur.active && cur.ranges.length === 0 ? AVAIL_DEFAULT_RANGES.map(r => ({ ...r })) : cur.ranges
                  }))}>
                  <div className="onb-switch-knob"/>
                </button>
              </div>

              {selectedInfo.active && (
                <>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--jw-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 14, marginBottom: 8 }}>
                    Time blocks
                  </div>
                  <div className="onb-day-ranges">
                    {selectedInfo.ranges.map((r, i) => (
                      <TimeRangeRow key={i} range={r}
                        removable={selectedInfo.ranges.length > 1}
                        onChange={(next) => overrideDay(cur => ({ ...cur, ranges: cur.ranges.map((x, j) => j === i ? next : x) }))}
                        onRemove={() => overrideDay(cur => ({ ...cur, ranges: cur.ranges.filter((_, j) => j !== i) }))}
                      />
                    ))}
                  </div>
                  <button className="onb-add-range-btn"
                    onClick={() => overrideDay(cur => ({ ...cur, ranges: [...cur.ranges, { start: '12:00', end: '14:00' }] }))}>
                    <Icon name="plus" size={12} stroke={2.5}/> Add another block
                  </button>
                </>
              )}

              <button className="jw-btn outline sm" style={{ width: '100%', justifyContent: 'center', marginTop: 14, opacity: selectedInfo.inherited ? 0.5 : 1 }}
                disabled={selectedInfo.inherited}
                onClick={revertDay}>
                Reset to weekly default
              </button>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// AvailabilityCalendar — full two-phase widget
// Props: value={ phase, weekly, overrides, selectedDate }
//        onChange(value)
//        showPhaseToggle (default true) — header chips to jump between phases
// ------------------------------------------------------------
function AvailabilityCalendar({ value, onChange, year = 2026, month = 3, today = new Date(2026, 3, 24) }) {
  const v = value || {};
  const phase = v.phase || 'defaults';
  const weekly = v.weekly || defaultWeekly();
  const overrides = v.overrides || {};
  const selectedDate = v.selectedDate || null;

  const set = (patch) => onChange({ ...v, weekly, overrides, ...patch });

  if (phase === 'defaults') {
    return (
      <WeeklyDefaultsEditor
        weekly={weekly}
        onChange={(w) => set({ weekly: w })}
        footer={
          <div className="onb-copy-row">
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--jw-text-muted)' }}>Bulk actions:</span>
            <button className="jw-btn outline sm" onClick={() => {
              const template = weekly['Mon'];
              const next = { ...weekly };
              AVAIL_DAYS.slice(1, 5).forEach(d => { next[d] = { active: template.active, ranges: template.ranges.map(r => ({ ...r })) }; });
              set({ weekly: next });
            }}>Copy Mon → Tue–Fri</button>
            <button className="jw-btn outline sm" onClick={() => set({ weekly: defaultWeekly() })}>Reset to defaults</button>
            <div style={{ flex: 1 }}/>
            <button className="jw-btn primary" onClick={() => set({ phase: 'calendar' })}>
              Continue to calendar <Icon name="arrow-right" size={13}/>
            </button>
          </div>
        }
      />
    );
  }

  return (
    <MonthCalendar
      year={year}
      month={month}
      today={today}
      weekly={weekly}
      overrides={overrides}
      onOverridesChange={(o) => set({ overrides: o })}
      selectedDate={selectedDate}
      onSelectDate={(d) => set({ selectedDate: d })}
      onBack={() => set({ phase: 'defaults' })}
    />
  );
}

Object.assign(window, {
  AvailabilityCalendar, WeeklyDefaultsEditor, MonthCalendar,
  AVAIL_DAYS, AVAIL_DEFAULT_RANGES,
  availHelpers: { fmtTime, rangeLabel, hoursForRanges, getDayRanges, defaultWeekly }
});
