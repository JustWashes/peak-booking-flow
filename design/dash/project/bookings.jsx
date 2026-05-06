// ============================================================
// Bookings & Calendar — tech's booking management hub
// Interactive month calendar + status modules.
// ============================================================

const navTechBookings = [
  { key: 'dashboard', label: 'Dashboard', icon: 'home' },
  { key: 'bookings', label: 'Bookings & Calendar', icon: 'calendar' },
  { key: 'availability', label: 'Availability', icon: 'clock' },
  { key: 'marketing', label: 'Marketing Materials', icon: 'megaphone' },
  { key: 'payments', label: 'Payments', icon: 'card' },
  { key: 'support', label: 'Support / Help', icon: 'headset' },
];

// ------------------------------------------------------------
// Mock booking data (April 2026)
// ------------------------------------------------------------
const BOOKINGS = [
  // Past — completed
  { id: 'b1', date: '2026-04-02', time: '10:00a', duration: 75, client: 'The Hendersons', vehicle: '2022 Tesla Model Y', address: '1428 Maple St', service: 'Full Detail', price: 145, status: 'completed', reviewed: true, rating: 5, photoCount: 8 },
  { id: 'b2', date: '2026-04-05', time: '2:30p', duration: 60, client: 'Priya S.', vehicle: 'Honda Odyssey', address: '220 Elm Ave', service: 'Express Wash', price: 55, status: 'completed', reviewed: true, rating: 5 },
  { id: 'b3', date: '2026-04-08', time: '9:00a', duration: 90, client: 'Derek M.', vehicle: '2024 BMW X5', address: '1840 Oak Dr', service: 'Premium Wash + Wax', price: 185, status: 'completed', reviewed: false },
  { id: 'b4', date: '2026-04-10', time: '3:00p', duration: 60, client: 'Lila R.', vehicle: 'Subaru Outback', address: '55 Pine Way', service: 'Express Wash', price: 55, status: 'completed', reviewed: false },
  { id: 'b5', date: '2026-04-12', time: '11:00a', duration: 75, client: 'The Okafors', vehicle: '2023 Ford F-150', address: '902 Cedar Ln', service: 'Full Detail', price: 145, status: 'completed', reviewed: true, rating: 4 },
  { id: 'b6', date: '2026-04-15', time: '10:30a', duration: 60, client: 'Carl T.', vehicle: 'Chevy Tahoe', address: '77 Birch Rd', service: 'Premium Wash', price: 95, status: 'cancelled', cancelReason: 'Client schedule conflict' },
  { id: 'b7', date: '2026-04-18', time: '2:00p', duration: 60, client: 'Meredith K.', vehicle: 'Mazda CX-5', address: '310 Willow Ct', service: 'Express Wash', price: 55, status: 'completed', reviewed: true, rating: 5 },
  { id: 'b8', date: '2026-04-20', time: '9:30a', duration: 75, client: 'James B.', vehicle: '2023 RAM 1500', address: '615 Ash Blvd', service: 'Full Detail', price: 145, status: 'rescheduled', rescheduledTo: '2026-05-04', rescheduledFrom: '2026-04-20' },
  { id: 'b9', date: '2026-04-22', time: '4:00p', duration: 60, client: 'Sofia N.', vehicle: 'Honda Civic', address: '88 Juniper Pl', service: 'Express Wash', price: 55, status: 'completed', reviewed: true, rating: 5 },

  // Today — in progress
  { id: 'b10', date: '2026-04-24', time: '10:30a', duration: 75, client: 'The Hendersons', vehicle: '2022 Tesla Model Y', address: '1428 Maple St', service: 'Full Detail', price: 145, status: 'in-progress' },
  { id: 'b11', date: '2026-04-24', time: '2:00p', duration: 60, client: 'Raj P.', vehicle: 'Audi A4', address: '1205 Sunset Dr', service: 'Premium Wash', price: 95, status: 'upcoming' },
  { id: 'b12', date: '2026-04-24', time: '4:30p', duration: 60, client: 'Elena V.', vehicle: 'Volvo XC60', address: '402 Highland Ave', service: 'Express Wash', price: 55, status: 'upcoming' },

  // Upcoming
  { id: 'b13', date: '2026-04-27', time: '9:00a', duration: 60, client: 'Priya S.', vehicle: 'Honda Odyssey', address: '220 Elm Ave', service: 'Express Wash', price: 55, status: 'upcoming' },
  { id: 'b14', date: '2026-04-28', time: '3:30p', duration: 90, client: 'The Okafors', vehicle: '2023 Ford F-150', address: '902 Cedar Ln', service: 'Premium Wash + Wax', price: 185, status: 'upcoming' },
  { id: 'b15', date: '2026-04-29', time: '9:30a', duration: 75, client: 'Derek M.', vehicle: '2024 BMW X5', address: '1840 Oak Dr', service: 'Full Detail', price: 145, status: 'upcoming' },
  { id: 'b16', date: '2026-04-29', time: '4:00p', duration: 60, client: 'Lila R.', vehicle: 'Subaru Outback', address: '55 Pine Way', service: 'Express Wash', price: 55, status: 'upcoming' },
  { id: 'b17', date: '2026-04-30', time: '10:00a', duration: 75, client: 'Courtney V.', vehicle: '2024 Audi Q7', address: '115 Magnolia Rd', service: 'Full Detail', price: 145, status: 'upcoming' },
  { id: 'b18', date: '2026-05-01', time: '3:00p', duration: 60, client: 'James B.', vehicle: '2023 RAM 1500', address: '615 Ash Blvd', service: 'Premium Wash', price: 95, status: 'upcoming' },
  { id: 'b19', date: '2026-05-04', time: '9:30a', duration: 75, client: 'James B.', vehicle: '2023 RAM 1500', address: '615 Ash Blvd', service: 'Full Detail', price: 145, status: 'upcoming', rescheduledFrom: '2026-04-20' },
];

const STATUS_META = {
  'upcoming':    { label: 'Upcoming',    tone: 'cyan',   dot: '#1EA6E1' },
  'in-progress': { label: 'In progress', tone: 'orange', dot: '#F39C4C' },
  'completed':   { label: 'Completed',   tone: 'green',  dot: '#2CB67D' },
  'cancelled':   { label: 'Cancelled',   tone: 'red',    dot: '#E24141' },
  'rescheduled': { label: 'Rescheduled', tone: 'purple', dot: '#7C5CFF' },
};

// Quick lookups
function bookingsByDate() {
  const map = {};
  BOOKINGS.forEach(b => {
    if (!map[b.date]) map[b.date] = [];
    map[b.date].push(b);
  });
  Object.values(map).forEach(arr => arr.sort((a, b) => a.time.localeCompare(b.time)));
  return map;
}

// ------------------------------------------------------------
// Reusable pieces
// ------------------------------------------------------------
function StatTile({ label, value, sub, tone, icon, trend }) {
  return (
    <div className="jw-card" style={{ padding: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div className="jw-label">{label}</div>
        <div className={`jw-icon-tile ${tone}`}><Icon name={icon} size={16}/></div>
      </div>
      <div className="jw-value" style={{ fontSize: 26 }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
        {trend && <Chip tone={trend.tone}>{trend.label}</Chip>}
        <div style={{ color: 'var(--jw-text-muted)', fontSize: 12 }}>{sub}</div>
      </div>
    </div>
  );
}

function BookingListRow({ b, onClick }) {
  const meta = STATUS_META[b.status];
  const d = new Date(b.date + 'T12:00:00');
  const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return (
    <button onClick={onClick} className="jw-booking-row" style={{
      padding: '14px 16px', cursor: 'pointer', border: '1px solid var(--jw-border)',
      width: '100%', textAlign: 'left', fontFamily: 'inherit', background: 'white',
      transition: 'border-color 0.15s, box-shadow 0.15s',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--jw-cyan)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(35,183,236,0.08)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--jw-border)'; e.currentTarget.style.boxShadow = 'none'; }}>
      <div className="left" style={{ gap: 14 }}>
        <div style={{
          width: 56, height: 60, borderRadius: 12,
          background: 'linear-gradient(135deg, #CDEEFB, #E8F6FC)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: '#0FA8E0', border: '1px solid #B6DFF0',
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>{dayLabel}</div>
          <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1 }}>{d.getDate()}</div>
          <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.75, marginTop: 2 }}>{b.time}</div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="title">{b.client}</span>
            <Chip tone={meta.tone}>{meta.label}</Chip>
            {b.reviewed && b.rating && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 11.5, color: '#B06D1E', fontWeight: 600 }}>
                <Icon name="star" size={11} color="#F39C4C"/> {b.rating}.0
              </span>
            )}
          </div>
          <div className="sub">{b.service} · {b.vehicle}</div>
          <div className="sub" style={{ marginTop: 2 }}>
            <Icon name="pin" size={10}/> {b.address} · {b.duration} min · ${b.price}
          </div>
        </div>
      </div>
      <div className="right">
        <Icon name="chevron-right" size={16} color="#94A3B8"/>
      </div>
    </button>
  );
}

// ------------------------------------------------------------
// Booking detail panel (side drawer pattern but inline)
// ------------------------------------------------------------
function BookingDetail({ booking, onClose }) {
  if (!booking) return null;
  const meta = STATUS_META[booking.status];
  const d = new Date(booking.date + 'T12:00:00');
  return (
    <aside style={{
      background: 'white', borderRadius: 14, border: '1px solid var(--jw-border)',
      padding: 22, boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)',
      position: 'sticky', top: 0,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <Chip tone={meta.tone}>{meta.label}</Chip>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--jw-text-subtle)', padding: 0 }}>
          <Icon name="x" size={18}/>
        </button>
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.3 }}>{booking.client}</div>
      <div style={{ fontSize: 13, color: 'var(--jw-text-muted)', marginTop: 2 }}>{booking.vehicle}</div>

      <div style={{ background: '#F7F9FC', borderRadius: 10, padding: 14, marginTop: 16, display: 'grid', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="calendar" size={14} color="#64748B"/>
          <div style={{ fontSize: 13 }}>{d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="clock" size={14} color="#64748B"/>
          <div style={{ fontSize: 13 }}>{booking.time} · {booking.duration} min</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <Icon name="pin" size={14} color="#64748B"/>
          <div style={{ fontSize: 13 }}>{booking.address}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="dollar" size={14} color="#64748B"/>
          <div style={{ fontSize: 13, fontWeight: 700 }}>${booking.price} <span style={{ fontWeight: 500, color: 'var(--jw-text-muted)' }}>· {booking.service}</span></div>
        </div>
      </div>

      {booking.status === 'rescheduled' && booking.rescheduledTo && (
        <div style={{ background: '#F4EDFF', border: '1px solid #D9C7FF', borderRadius: 10, padding: 12, marginTop: 12, fontSize: 12.5, color: '#4E37A8', lineHeight: 1.5 }}>
          <b>Moved to {new Date(booking.rescheduledTo + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</b>
          <div style={{ marginTop: 2, color: '#6B5BB9' }}>Client requested the new slot. Confirmed.</div>
        </div>
      )}
      {booking.status === 'cancelled' && booking.cancelReason && (
        <div style={{ background: '#FEF1F1', border: '1px solid #F4C2C2', borderRadius: 10, padding: 12, marginTop: 12, fontSize: 12.5, color: '#9A2929', lineHeight: 1.5 }}>
          <b>Cancelled</b>
          <div style={{ marginTop: 2, color: '#B04A4A' }}>{booking.cancelReason}</div>
        </div>
      )}
      {booking.reviewed && booking.rating && (
        <div style={{ background: '#FFF1DB', border: '1px solid #F5CB8F', borderRadius: 10, padding: 12, marginTop: 12, fontSize: 12.5, color: '#7A4E12', lineHeight: 1.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon key={i} name="star" size={12} color={i < booking.rating ? '#F39C4C' : '#E5C99A'}/>
            ))}
            <span style={{ marginLeft: 6 }}>{booking.rating}.0 from {booking.client.split(' ')[0]}</span>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: 8, marginTop: 18 }}>
        {booking.status === 'upcoming' && (
          <>
            <button className="jw-btn primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Icon name="pin" size={13}/> Navigate
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="jw-btn outline" style={{ flex: 1, justifyContent: 'center' }}>
                <Icon name="phone" size={13}/> Call
              </button>
              <button className="jw-btn outline" style={{ flex: 1, justifyContent: 'center' }}>Reschedule</button>
            </div>
            <button className="jw-btn outline" style={{ width: '100%', justifyContent: 'center', color: '#E24141', borderColor: '#F4C2C2' }}>
              Cancel booking
            </button>
          </>
        )}
        {booking.status === 'in-progress' && (
          <>
            <button className="jw-btn primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Icon name="check" size={13} stroke={3}/> Mark complete
            </button>
            <button className="jw-btn outline" style={{ width: '100%', justifyContent: 'center' }}>
              <Icon name="phone" size={13}/> Call client
            </button>
          </>
        )}
        {booking.status === 'completed' && !booking.reviewed && (
          <>
            <button className="jw-btn primary" style={{ width: '100%', justifyContent: 'center' }}>
              Request review
            </button>
            <button className="jw-btn outline" style={{ width: '100%', justifyContent: 'center' }}>
              View invoice
            </button>
          </>
        )}
        {booking.status === 'completed' && booking.reviewed && (
          <>
            <button className="jw-btn outline" style={{ width: '100%', justifyContent: 'center' }}>
              View invoice
            </button>
            {booking.photoCount && (
              <button className="jw-btn outline" style={{ width: '100%', justifyContent: 'center' }}>
                View {booking.photoCount} photos
              </button>
            )}
          </>
        )}
        {(booking.status === 'cancelled' || booking.status === 'rescheduled') && (
          <button className="jw-btn outline" style={{ width: '100%', justifyContent: 'center' }}>
            View original booking
          </button>
        )}
      </div>
    </aside>
  );
}

// ------------------------------------------------------------
// Calendar view — inspired by the availability calendar styling
// Shows booking chips per day instead of time ranges
// ------------------------------------------------------------
function BookingsCalendar({ year = 2026, month = 3, today = new Date(2026, 3, 24), byDate, selectedDate, onSelectDate }) {
  const monthStart = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = (monthStart.getDay() + 6) % 7;
  const label = monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="onb-calendar" style={{ background: 'white' }}>
      <div className="onb-cal-hdr">
        <button className="onb-cal-nav"><Icon name="arrow-left" size={12}/></button>
        <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: -0.2 }}>{label}</div>
        <button className="onb-cal-nav">Today</button>
      </div>
      <div className="onb-cal-grid">
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
          <div key={d} className="onb-cal-dow">{d}</div>
        ))}
        {Array.from({ length: firstDow }).map((_, i) => <div key={`pad-${i}`} className="onb-cal-pad"/>)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
          const bookings = byDate[dateStr] || [];
          const isToday = day === today.getDate();
          const isSelected = dateStr === selectedDate;
          const isPast = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const hasActive = bookings.some(b => b.status === 'upcoming' || b.status === 'in-progress');
          return (
            <button key={day}
              className={`onb-cal-day ${bookings.length ? 'active' : 'off'} ${isToday ? 'today' : ''} ${isPast ? 'past' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectDate(dateStr)}
              style={{ minHeight: 96 }}>
              <div className="onb-cal-daynum">{day}</div>
              <div className="onb-cal-blocks">
                {bookings.slice(0, 3).map((b, i) => {
                  const meta = STATUS_META[b.status];
                  return (
                    <div key={i} className="onb-cal-block" style={{
                      background: meta.tone === 'green' ? '#E0F5EA' :
                                  meta.tone === 'red' ? '#FDE8E8' :
                                  meta.tone === 'orange' ? '#FFF1DB' :
                                  meta.tone === 'purple' ? '#F0EAFF' :
                                  '#E8F6FC',
                      color: meta.tone === 'green' ? '#2CB67D' :
                             meta.tone === 'red' ? '#9A2929' :
                             meta.tone === 'orange' ? '#B06D1E' :
                             meta.tone === 'purple' ? '#5F4AB9' :
                             'var(--jw-cyan-strong)',
                      fontSize: 10, display: 'flex', alignItems: 'center', gap: 3, textDecoration: b.status === 'cancelled' ? 'line-through' : 'none',
                    }}>
                      <span style={{ fontWeight: 800 }}>{b.time}</span>
                      <span style={{ opacity: 0.9, overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.client.split(' ')[0]}</span>
                    </div>
                  );
                })}
                {bookings.length > 3 && <div className="onb-cal-more">+{bookings.length - 3}</div>}
              </div>
              {hasActive && !isPast && <div className="onb-cal-dot" style={{ background: '#2CB67D' }}/>}
            </button>
          );
        })}
      </div>
      <div className="onb-cal-legend">
        <div><span className="onb-legend-sw" style={{ background: '#E8F6FC', border: '1px solid #B6DFF0' }}/>Upcoming</div>
        <div><span className="onb-legend-sw" style={{ background: '#FFF1DB', border: '1px solid #F5CB8F' }}/>In progress</div>
        <div><span className="onb-legend-sw" style={{ background: '#E0F5EA', border: '1px solid #B8E3CE' }}/>Completed</div>
        <div><span className="onb-legend-sw" style={{ background: '#FDE8E8', border: '1px solid #F4C2C2' }}/>Cancelled</div>
        <div><span className="onb-legend-sw" style={{ background: '#F0EAFF', border: '1px solid #D9C7FF' }}/>Rescheduled</div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Module: status list
// ------------------------------------------------------------
function BookingModule({ title, icon, tone, bookings, onSelect, emptyLabel, max = 3, accent }) {
  return (
    <div className="jw-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 18px', borderBottom: '1px solid var(--jw-border)' }}>
        <div className={`jw-icon-tile ${tone}`} style={{ width: 32, height: 32 }}><Icon name={icon} size={15}/></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: -0.1 }}>{title}</div>
          <div style={{ fontSize: 11.5, color: 'var(--jw-text-muted)' }}>
            {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
          </div>
        </div>
        {bookings.length > max && (
          <button style={{ background: 'transparent', border: 'none', fontSize: 12, fontWeight: 700, color: 'var(--jw-cyan-strong)', cursor: 'pointer', fontFamily: 'inherit' }}>
            View all →
          </button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {bookings.length === 0 ? (
          <div style={{ padding: '28px 18px', textAlign: 'center', color: 'var(--jw-text-muted)', fontSize: 12.5 }}>
            {emptyLabel || 'Nothing here yet.'}
          </div>
        ) : bookings.slice(0, max).map(b => {
          const d = new Date(b.date + 'T12:00:00');
          return (
            <button key={b.id} onClick={() => onSelect(b)} style={{
              padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12,
              background: 'transparent', border: 'none', borderTop: '1px solid var(--jw-border)',
              textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', width: '100%',
              transition: 'background 0.12s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#F7FBFE'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              {accent && <div style={{ width: 3, height: 36, background: accent, borderRadius: 2 }}/>}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{b.client}</div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--jw-text-muted)', whiteSpace: 'nowrap' }}>
                    {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {b.time}
                  </div>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--jw-text-subtle)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {b.service} · {b.vehicle}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Root
// ------------------------------------------------------------
function BookingsPage() {
  const [tab, setTab] = React.useState('calendar'); // 'calendar' | 'list'
  const [selectedDate, setSelectedDate] = React.useState('2026-04-24');
  const [selectedBooking, setSelectedBooking] = React.useState(null);
  const [listFilter, setListFilter] = React.useState('all');

  const byDate = React.useMemo(bookingsByDate, []);
  const today = new Date(2026, 3, 24);

  const upcoming   = BOOKINGS.filter(b => b.status === 'upcoming').sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  const inProgress = BOOKINGS.filter(b => b.status === 'in-progress');
  const needsReview= BOOKINGS.filter(b => b.status === 'completed' && !b.reviewed).slice().reverse();
  const completed  = BOOKINGS.filter(b => b.status === 'completed' && b.reviewed).slice().reverse();
  const cancelled  = BOOKINGS.filter(b => b.status === 'cancelled').slice().reverse();
  const rescheduled= BOOKINGS.filter(b => b.status === 'rescheduled').slice().reverse();

  // Stats
  const monthBookings = BOOKINGS.filter(b => b.date.startsWith('2026-04'));
  const monthEarnings = monthBookings.filter(b => b.status === 'completed').reduce((s, b) => s + b.price, 0);
  const upcomingCount = upcoming.length + inProgress.length;
  const completedCount = completed.length + needsReview.length;

  const selectedDateBookings = byDate[selectedDate] || [];

  // filtered list for list view
  const filtered = React.useMemo(() => {
    const sorted = BOOKINGS.slice().sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
    if (listFilter === 'all') return sorted;
    if (listFilter === 'upcoming') return sorted.filter(b => b.status === 'upcoming' || b.status === 'in-progress');
    if (listFilter === 'review') return sorted.filter(b => b.status === 'completed' && !b.reviewed);
    return sorted.filter(b => b.status === listFilter);
  }, [listFilter]);

  return (
    <div className="jw-app" style={{ position: 'relative' }}>
      <Sidebar items={navTechBookings} activeKey="bookings"/>
      <div className="jw-main">
        <Topbar userName="Marcus T." initial="M"/>
        <div className="jw-content">
          <div className="jw-welcome-hdr">
            <div>
              <h1 className="jw-h1">Bookings & Calendar</h1>
              <p className="jw-sub">Every job, past and future. {upcomingCount} active · {completedCount} completed this month.</p>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 18, alignItems: 'center', borderBottom: '1px solid var(--jw-border)' }}>
            {[
              { k: 'calendar', label: 'Calendar', icon: 'calendar' },
              { k: 'list', label: 'All bookings', icon: 'doc' },
            ].map(t => {
              const active = tab === t.k;
              return (
                <button key={t.k} onClick={() => setTab(t.k)} style={{
                  background: 'transparent', border: 'none', padding: '12px 18px',
                  fontWeight: 700, fontSize: 13.5, fontFamily: 'inherit',
                  color: active ? 'var(--jw-cyan-strong)' : 'var(--jw-text-muted)',
                  cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7,
                  borderBottom: `2px solid ${active ? 'var(--jw-cyan)' : 'transparent'}`,
                  marginBottom: -1,
                }}>
                  <Icon name={t.icon} size={14}/> {t.label}
                </button>
              );
            })}
          </div>

          {tab === 'calendar' ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, marginBottom: 22, alignItems: 'start' }}>
                <BookingsCalendar year={2026} month={3} today={today} byDate={byDate} selectedDate={selectedDate} onSelectDate={(d) => { setSelectedDate(d); setSelectedBooking(null); }}/>

                {selectedBooking ? (
                  <BookingDetail booking={selectedBooking} onClose={() => setSelectedBooking(null)}/>
                ) : (
                  <aside style={{
                    background: 'white', borderRadius: 14, border: '1px solid var(--jw-border)',
                    padding: 20, position: 'sticky', top: 0,
                  }}>
                    <div style={{ fontSize: 11.5, color: 'var(--jw-text-subtle)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' })}
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.3, marginBottom: 14 }}>
                      {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                    </div>
                    {selectedDateBookings.length === 0 ? (
                      <div style={{ padding: '22px 4px', textAlign: 'center', color: 'var(--jw-text-muted)', fontSize: 12.5 }}>
                        <Icon name="calendar" size={28} color="#CBD5E1"/>
                        <div style={{ marginTop: 8, fontWeight: 600 }}>No bookings</div>
                        <div style={{ marginTop: 2 }}>Pick a day with jobs, or add a new booking.</div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {selectedDateBookings.map(b => {
                          const meta = STATUS_META[b.status];
                          return (
                            <button key={b.id} onClick={() => setSelectedBooking(b)} style={{
                              background: '#F7F9FC', border: '1px solid var(--jw-border)', borderRadius: 10,
                              padding: '10px 12px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                              display: 'flex', gap: 10, alignItems: 'center',
                              transition: 'border-color 0.15s, background 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#EEF9FE'; e.currentTarget.style.borderColor = 'var(--jw-cyan)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#F7F9FC'; e.currentTarget.style.borderColor = 'var(--jw-border)'; }}>
                              <div style={{ width: 6, height: 36, background: meta.dot, borderRadius: 3, flexShrink: 0 }}/>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                                  <div style={{ fontWeight: 700, fontSize: 13 }}>{b.time}</div>
                                  <Chip tone={meta.tone}>{meta.label}</Chip>
                                </div>
                                <div style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>{b.client}</div>
                                <div style={{ fontSize: 11, color: 'var(--jw-text-subtle)' }}>{b.service}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </aside>
                )}
              </div>

              {/* Modules grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                <BookingModule title="Upcoming" icon="calendar" tone="cyan" bookings={upcoming} onSelect={setSelectedBooking} emptyLabel="No upcoming jobs." accent="#1EA6E1"/>
                <BookingModule title="Needs review" icon="star" tone="orange" bookings={needsReview} onSelect={setSelectedBooking} emptyLabel="All reviewed!" accent="#F39C4C"/>
                <BookingModule title="Completed" icon="check-circle" tone="green" bookings={completed} onSelect={setSelectedBooking} emptyLabel="No completed jobs yet." accent="#2CB67D"/>
                <BookingModule title="Rescheduled & cancelled" icon="clock" tone="purple" bookings={[...rescheduled, ...cancelled]} onSelect={setSelectedBooking} emptyLabel="None." accent="#7C5CFF"/>
              </div>
            </>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: selectedBooking ? '1fr 340px' : '1fr', gap: 16, alignItems: 'start' }}>
              <div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                  {[
                    { k: 'all', label: 'All' },
                    { k: 'upcoming', label: 'Upcoming' },
                    { k: 'completed', label: 'Completed' },
                    { k: 'review', label: 'Needs review' },
                    { k: 'cancelled', label: 'Cancelled' },
                    { k: 'rescheduled', label: 'Rescheduled' },
                  ].map(f => {
                    const active = listFilter === f.k;
                    return (
                      <button key={f.k} onClick={() => setListFilter(f.k)} style={{
                        padding: '6px 12px', borderRadius: 999,
                        background: active ? 'var(--jw-cyan-strong)' : 'white',
                        color: active ? 'white' : 'var(--jw-text-muted)',
                        border: `1px solid ${active ? 'var(--jw-cyan-strong)' : 'var(--jw-border)'}`,
                        fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                      }}>{f.label}</button>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {filtered.map(b => (
                    <BookingListRow key={b.id} b={b} onClick={() => setSelectedBooking(b)}/>
                  ))}
                  {filtered.length === 0 && (
                    <div style={{ padding: '40px 20px', textAlign: 'center', background: 'white', border: '1px solid var(--jw-border)', borderRadius: 14, color: 'var(--jw-text-muted)' }}>
                      No bookings match this filter.
                    </div>
                  )}
                </div>
              </div>
              {selectedBooking && <BookingDetail booking={selectedBooking} onClose={() => setSelectedBooking(null)}/>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function mountBookings() {
  const el = document.getElementById('bookings-root');
  if (el && !el.__mounted) {
    el.__mounted = true;
    ReactDOM.createRoot(el).render(<BookingsPage/>);
  } else if (!el) {
    requestAnimationFrame(mountBookings);
  }
}
mountBookings();
