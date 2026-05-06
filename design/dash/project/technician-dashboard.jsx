// Technician Dashboard — full hi-fi, interactive
// Renders inside <div id="tech-root"></div>

const navTech = [
  { key: 'dashboard', label: 'Dashboard', icon: 'home' },
  { key: 'onboarding', label: 'Onboarding Checklist', icon: 'user-check' },
  { key: 'bookings', label: 'Bookings & Calendar', icon: 'calendar' },
  { key: 'marketing', label: 'Marketing Materials', icon: 'megaphone' },
  { key: 'payments', label: 'Payments', icon: 'card' },
  { key: 'support', label: 'Support / Help', icon: 'headset' },
];

const navTechOnboarding = [
  { key: 'dashboard', label: 'Dashboard', icon: 'home' },
  { key: 'onboarding', label: 'Onboarding Checklist', icon: 'user-check' },
  { key: 'support', label: 'Support / Help', icon: 'headset' },
];

function TechStat({ label, value, sub, tone = 'cyan', icon, trend }) {
  return (
    <div className="jw-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div className="jw-label">{label}</div>
        <div className={`jw-icon-tile ${tone}`}><Icon name={icon} size={16} /></div>
      </div>
      <div className="jw-value">{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
        {trend && <Chip tone={trend.tone}>{trend.label}</Chip>}
        <div style={{ color: 'var(--jw-text-muted)', fontSize: 12 }}>{sub}</div>
      </div>
    </div>
  );
}

function JobRow({ time, client, address, vehicle, status, statusTone, distance, progress, actions }) {
  return (
    <div className="jw-booking-row" style={{ padding: '14px 16px' }}>
      <div className="left" style={{ gap: 14 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 12,
          background: 'linear-gradient(135deg, #CDEEFB, #E8F6FC)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: '#0FA8E0', border: '1px solid #B6DFF0'
        }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>{time.day}</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{time.hm}</div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="title">{client}</span>
            {status && <Chip tone={statusTone}>{status}</Chip>}
          </div>
          <div className="sub">{vehicle} · {address}{distance ? ` · ${distance}` : ''}</div>
          {typeof progress === 'number' && (
            <div style={{ marginTop: 8, width: 240 }}>
              <div className="jw-progress" style={{ height: 6 }}>
                <div className="jw-progress-fill" style={{ width: `${progress}%` }}/>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="right">{actions}</div>
    </div>
  );
}

function TechApp({ onboarded = true }) {
  const [techType, setTechType] = React.useState('Certified');
  const [availabilityTab, setAvailabilityTab] = React.useState('jobs');

  // Onboarding progress (only used when !onboarded)
  const onboardingSteps = [
    { name: 'Private Profile', desc: 'Contact info, address, vehicle details', done: true, cta: 'Review' },
    { name: 'Public Profile', desc: 'Photo, bio, service areas visible to clients', done: true, cta: 'Edit Public' },
    { name: 'Training Module', desc: '5 short videos · ~25 min total', done: true, cta: 'Review' },
    { name: 'Background Check', desc: 'Processing — results in 24–48 hrs', done: false, inProgress: true, cta: 'View status' },
    { name: 'Payment Details', desc: 'Connect bank account for payouts', done: false, cta: 'Start' },
    { name: 'Equipment Kit', desc: 'Confirm receipt of starter supplies', done: false, cta: 'Start' },
  ];
  const completed = onboardingSteps.filter(s => s.done).length;
  const total = onboardingSteps.length;
  const onboardingPct = (completed / total) * 100;

  // availability calendar data
  const daysApril = Array.from({ length: 30 }, (_, i) => i + 1);
  const firstDay = 2; // April 1 2026 is a Wednesday-ish; offset by 2 empty cells before 1
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  daysApril.forEach(d => cells.push(d));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div className="jw-app">
      <Sidebar items={onboarded ? navTech : navTechOnboarding} activeKey="dashboard" />
      <div className="jw-main">
        <Topbar userName={onboarded ? "Marcus T." : "Jordan P."} initial={onboarded ? "M" : "J"} />
        <div className="jw-content">
          <div className="jw-welcome-hdr">
            <div>
              <h1 className="jw-h1">Welcome{onboarded ? " back" : ""}, {onboarded ? "Marcus" : "Jordan"}!</h1>
              <p className="jw-sub">
                {onboarded
                  ? "3 jobs on deck today · you're booked through next week."
                  : `You're ${completed} of ${total} steps away from accepting your first job.`}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {onboarded ? (
                <>
                  <div className="jw-segment">
                    {['Certified', 'Independent'].map(t => (
                      <button key={t} className={techType === t ? 'active' : ''} onClick={() => setTechType(t)}>{t}</button>
                    ))}
                  </div>
                  <button className="jw-btn primary"><Icon name="plus" size={14} stroke={2.5}/> Block time</button>
                </>
              ) : (
                <>
                  <Chip tone="yellow"><Icon name="clock" size={11}/> Pending approval</Chip>
                  <button className="jw-btn primary">Continue Onboarding <Icon name="arrow-right" size={13}/></button>
                </>
              )}
            </div>
          </div>

          {!onboarded && (
            <div className="jw-card navy" style={{ padding: 22, borderRadius: 16, marginBottom: 18, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(35,183,236,0.25), transparent 70%)' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, position: 'relative' }}>
                <div style={{ flex: 1 }}>
                  <Chip tone="cyan" style={{ marginBottom: 8 }}>Getting started</Chip>
                  <div style={{ fontSize: 22, fontWeight: 700, marginTop: 10, marginBottom: 6, letterSpacing: -0.3 }}>Finish onboarding to start earning</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13.5, maxWidth: 560 }}>
                    Complete the remaining steps to unlock your calendar, accept bookings, and receive payouts. Most techs finish in under an hour.
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 18 }}>
                    <div style={{ flex: 1, maxWidth: 380 }}>
                      <div className="jw-progress" style={{ background: 'rgba(255,255,255,0.12)' }}>
                        <div className="jw-progress-fill" style={{ width: `${onboardingPct}%` }}/>
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 8, fontWeight: 500 }}>
                        {completed} of {total} complete · {Math.round(onboardingPct)}%
                      </div>
                    </div>
                    <button className="jw-btn primary">Resume <Icon name="arrow-right" size={13}/></button>
                  </div>
                </div>
                <div style={{ textAlign: 'center', padding: '4px 20px', borderLeft: '1px solid rgba(255,255,255,0.12)' }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>Est. time left</div>
                  <div style={{ fontSize: 32, fontWeight: 700 }}>~22</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>minutes</div>
                </div>
              </div>
            </div>
          )}

          {/* KPI row */}
          <div className="jw-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 18 }}>
            <TechStat label="Today's Earnings" value="$284" sub="vs $210 yesterday" tone="green" icon="dollar" trend={{ tone: 'green', label: '+35%' }} />
            <TechStat label="Jobs Today" value="3 / 5" sub="2 remaining" tone="cyan" icon="car" trend={{ tone: 'cyan', label: 'On track' }} />
            <TechStat label="Avg Rating" value="4.92" sub="128 reviews" tone="orange" icon="star" trend={{ tone: 'orange', label: 'Top 5%' }} />
            <TechStat label="Weekly Hours" value="32.0 / 40" sub="8 hrs to threshold" tone="purple" icon="clock" trend={{ tone: 'yellow', label: 'Peak hrs' }} />
          </div>

          {/* Next job + Onboarding checklist (onboarding variant only) / Today-at-a-glance (onboarded) */}
          <div className="jw-grid" style={{ gridTemplateColumns: '2fr 1fr', marginBottom: 18 }}>
            <div className="jw-card navy" style={{ padding: 24, borderRadius: 16, position: 'relative' }}>
              {!onboarded && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(11,37,69,0.65)', backdropFilter: 'blur(2px)', borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2, color: 'white', gap: 8, textAlign: 'center', padding: 20 }}>
                  <Icon name="alert" size={28} stroke={1.8} />
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Jobs unlock after onboarding</div>
                  <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.7)', maxWidth: 320 }}>
                    Once your background check clears and payments are set up, new bookings will appear here.
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span className="jw-dot" style={{ background: '#23B7EC', boxShadow: '0 0 0 4px rgba(35,183,236,0.25)' }}/>
                    <div style={{ fontSize: 17, fontWeight: 700 }}>Your Next Job</div>
                    <Chip tone="cyan">Starts in 42 min</Chip>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Joey A. · 2022 Toyota Camry + 2019 Ford F-150</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11.5, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.6 }}>Payout</div>
                  <div style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>$78.50</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 18 }}>
                <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: 12, borderRadius: 10 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>When</div>
                  <div style={{ fontWeight: 600 }}>Today · 11:30 AM</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: 12, borderRadius: 10 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Where</div>
                  <div style={{ fontWeight: 600 }}>312 Elm St · 4.2 mi</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: 12, borderRadius: 10 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Service</div>
                  <div style={{ fontWeight: 600 }}>Exterior + Interior</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar initial="J" tone="blue" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>Joey A.</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Member · Plus plan</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="jw-btn sm" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.16)' }}><Icon name="phone" size={12}/> Call</button>
                  <button className="jw-btn sm" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.16)' }}><Icon name="pin" size={12}/> Navigate</button>
                  <button className="jw-btn primary sm">Start Job <Icon name="arrow-right" size={12}/></button>
                </div>
              </div>
            </div>

            {onboarded ? (
              <div className="jw-card" style={{ padding: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h3 className="jw-h3">Today at a glance</h3>
                  <Chip tone="cyan">Tue, Apr 28</Chip>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="jw-icon-tile cyan" style={{ width: 38, height: 38 }}><Icon name="clock" size={16}/></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, color: 'var(--jw-text-muted)' }}>First job</div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>11:30 AM · Joey A.</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="jw-icon-tile green" style={{ width: 38, height: 38 }}><Icon name="dollar" size={16}/></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, color: 'var(--jw-text-muted)' }}>Projected earnings</div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>$412 <span style={{ color: 'var(--jw-text-muted)', fontWeight: 400, fontSize: 12 }}>· 5 jobs</span></div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="jw-icon-tile purple" style={{ width: 38, height: 38 }}><Icon name="pin" size={16}/></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, color: 'var(--jw-text-muted)' }}>Route distance</div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>22.1 mi · ~48 min drive</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="jw-icon-tile orange" style={{ width: 38, height: 38 }}><Icon name="bell" size={16}/></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, color: 'var(--jw-text-muted)' }}>Weather</div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>72°F · Clear all day</div>
                    </div>
                  </div>
                </div>
                <hr className="jw-hr" style={{ margin: '16px 0 14px' }}/>
                <button className="jw-btn outline sm" style={{ width: '100%', justifyContent: 'center' }}>View full schedule <Icon name="arrow-right" size={12}/></button>
              </div>
            ) : (
              <div className="jw-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{
                  background: 'linear-gradient(90deg, #0B2545 0%, #1EA6E1 140%)',
                  color: 'white', padding: '14px 18px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div style={{ fontWeight: 700 }}>Onboarding Checklist</div>
                  <Chip tone="yellow">{completed}/{total}</Chip>
                </div>
                {onboardingSteps.map(row => (
                  <div key={row.name} className="jw-check-row" style={{ gridTemplateColumns: '1fr auto', padding: '12px 18px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {row.done ? (
                          <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#2CB67D', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name="check" size={11} stroke={3}/>
                          </span>
                        ) : row.inProgress ? (
                          <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#FCEFDE', color: '#F39C4C', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>
                            <Icon name="clock" size={11}/>
                          </span>
                        ) : (
                          <span style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #D8DEE8', display: 'inline-block' }}/>
                        )}
                        <span style={{ fontWeight: 600, fontSize: 13.5, color: row.done ? 'var(--jw-text-muted)' : 'var(--jw-text)', textDecoration: row.done ? 'line-through' : 'none' }}>{row.name}</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--jw-text-subtle)', marginTop: 4, marginLeft: 26 }}>{row.desc}</div>
                    </div>
                    {!row.done && (
                      <button className={`jw-btn sm ${row.inProgress ? 'outline' : 'primary'}`}>{row.cta} <Icon name="chevron-right" size={12}/></button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Availability + peak hours */}
          <div className="jw-card" style={{ padding: 22, marginBottom: 18, position: 'relative' }}>
            {!onboarded && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(243,245,248,0.75)', backdropFilter: 'blur(2px)', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2, gap: 8, textAlign: 'center', padding: 20 }}>
                <Icon name="calendar" size={26} color="#6B7689" />
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--jw-text)' }}>Set your availability after you're approved</div>
                <div style={{ fontSize: 12.5, color: 'var(--jw-text-muted)', maxWidth: 400 }}>
                  Your calendar will open up once onboarding steps are complete. Until then, focus on the checklist above.
                </div>
                <button className="jw-btn primary sm" style={{ marginTop: 6 }}>Finish onboarding <Icon name="arrow-right" size={12}/></button>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h2 className="jw-h2">Manage Bookings</h2>
                <p className="jw-sub">Review availability and manage your upcoming bookings.</p>
              </div>
              <div className="jw-tabs">
                <button className={availabilityTab === 'jobs' ? 'active' : ''} onClick={() => setAvailabilityTab('jobs')}>Today's Jobs</button>
                <button className={availabilityTab === 'availability' ? 'active' : ''} onClick={() => setAvailabilityTab('availability')}>Availability</button>
              </div>
            </div>

            {availabilityTab === 'availability' && (
              <>
                <div style={{
                  background: '#FFF6E1', border: '1px solid #F5E4B8',
                  borderRadius: 10, padding: '12px 16px', marginBottom: 16,
                  display: 'flex', gap: 32
                }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#8A6A1E', fontSize: 13 }}>Peak Hours</div>
                    <div style={{ fontSize: 12, color: '#B88724', marginTop: 3 }}>Weekdays 8 AM – 6 PM · Weekends 8 AM – 4 PM</div>
                  </div>
                  <div style={{ display: 'flex', gap: 36 }}>
                    <div>
                      <div className="jw-label">Threshold</div>
                      <div className="jw-stat-big">40 hrs</div>
                    </div>
                    <div>
                      <div className="jw-label">Set</div>
                      <div className="jw-stat-big red">32.0 hrs</div>
                    </div>
                    <div>
                      <div className="jw-label">Peak hrs</div>
                      <div className="jw-stat-big">32.0 hrs</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <Chip tone="cyan">Weekly Hours: 32.0h</Chip>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button className="jw-btn outline sm">Today</button>
                    <button className="jw-btn outline sm">Back</button>
                    <button className="jw-btn outline sm">Next</button>
                    <div style={{ fontWeight: 700, marginLeft: 12 }}>April 2026</div>
                  </div>
                </div>

                <table className="jw-cal">
                  <thead>
                    <tr>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <th key={d}>{d}</th>)}</tr>
                  </thead>
                  <tbody>
                    {weeks.map((w, wi) => (
                      <tr key={wi}>
                        {w.map((d, di) => {
                          const isOutside = d === null;
                          const isWeekend = di >= 5;
                          const hasSlot = !isOutside && !isWeekend;
                          return (
                            <td key={di} className={isOutside ? 'outside' : ''}>
                              {d !== null && <div style={{ fontWeight: 600, fontSize: 11 }}>{String(d).padStart(2,'0')}</div>}
                              {hasSlot && <span className="slot">09:00 AM – 05:00 PM</span>}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {availabilityTab === 'jobs' && (
              <div className="jw-row-list">
                <JobRow
                  time={{ day: 'NOW', hm: '11:30' }}
                  client="Joey A."
                  vehicle="Toyota Camry + Ford F-150"
                  address="312 Elm St"
                  distance="4.2 mi"
                  status="In Progress"
                  statusTone="cyan"
                  progress={35}
                  actions={<>
                    <button className="jw-btn outline sm"><Icon name="pin" size={12}/> Navigate</button>
                    <button className="jw-btn primary sm">Continue</button>
                  </>}
                />
                <JobRow
                  time={{ day: 'TODAY', hm: '1:45' }}
                  client="Priya S."
                  vehicle="Honda Accord"
                  address="88 Pine Ave"
                  distance="6.1 mi"
                  status="Upcoming"
                  statusTone="slate"
                  actions={<>
                    <button className="jw-btn outline sm"><Icon name="phone" size={12}/> Call</button>
                    <button className="jw-btn outline sm"><Icon name="pin" size={12}/> Navigate</button>
                  </>}
                />
                <JobRow
                  time={{ day: 'TODAY', hm: '4:00' }}
                  client="David L."
                  vehicle="Tesla Model Y"
                  address="10 Harbor Rd"
                  distance="8.4 mi"
                  status="Confirmed"
                  statusTone="green"
                  actions={<>
                    <button className="jw-btn outline sm"><Icon name="phone" size={12}/> Call</button>
                    <button className="jw-btn outline sm"><Icon name="pin" size={12}/> Navigate</button>
                  </>}
                />
                <JobRow
                  time={{ day: 'TMRW', hm: '9:00' }}
                  client="Rachel O."
                  vehicle="Subaru Outback"
                  address="42 Ridge Blvd"
                  distance="3.1 mi"
                  status="Scheduled"
                  statusTone="slate"
                  actions={<>
                    <button className="jw-btn outline sm"><Icon name="phone" size={12}/> Call</button>
                    <button className="jw-btn outline sm">Details</button>
                  </>}
                />
              </div>
            )}
          </div>

          {/* Earnings + activity */}
          <div className="jw-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
            <div className="jw-card" style={{ position: 'relative' }}>
              {!onboarded && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(243,245,248,0.75)', backdropFilter: 'blur(2px)', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2, gap: 6, textAlign: 'center', padding: 20 }}>
                  <Icon name="dollar" size={26} color="#6B7689" />
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--jw-text)' }}>Earnings unlock after first payout</div>
                  <div style={{ fontSize: 12, color: 'var(--jw-text-muted)', maxWidth: 300 }}>Connect your bank account to start tracking payouts here.</div>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
                <div>
                  <h3 className="jw-h3">Earnings — Last 7 Days</h3>
                  <div style={{ color: 'var(--jw-text-muted)', fontSize: 12, marginTop: 2 }}>{onboarded ? '$1,284 total · $183 avg / day' : 'No payouts yet'}</div>
                </div>
                <button className="jw-btn outline sm"><Icon name="download" size={12}/> Export</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 140, padding: '0 4px' }}>
                {[
                  { d: 'Mon', v: 220 },
                  { d: 'Tue', v: 145 },
                  { d: 'Wed', v: 280 },
                  { d: 'Thu', v: 190 },
                  { d: 'Fri', v: 165 },
                  { d: 'Sat', v: 210 },
                  { d: 'Sun', v: 74 },
                ].map((x, i) => {
                  const h = (x.v / 300) * 100;
                  const isToday = i === 6;
                  return (
                    <div key={x.d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: isToday ? 'var(--jw-cyan-strong)' : 'var(--jw-text-muted)' }}>${x.v}</div>
                      <div style={{
                        width: '100%', height: `${h}%`,
                        background: isToday
                          ? 'linear-gradient(180deg, #39C1F2, #1EA6E1)'
                          : 'linear-gradient(180deg, #CDEEFB, #9BD3EC)',
                        borderRadius: '6px 6px 0 0'
                      }} />
                      <div style={{ fontSize: 11, color: 'var(--jw-text-muted)', fontWeight: isToday ? 600 : 400 }}>{x.d}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="jw-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 className="jw-h3">Recent Activity</h3>
                <Chip tone="cyan">{onboarded ? '3 new' : '2 new'}</Chip>
              </div>
              {(onboarded ? [
                { icon: 'star', tone: 'orange', text: 'Joey A. left a 5-star review', time: '12 min ago' },
                { icon: 'dollar', tone: 'green', text: 'Payout $284 sent to bank', time: '1 hr ago' },
                { icon: 'calendar', tone: 'cyan', text: 'New booking — Apr 28, 2 PM', time: '3 hr ago' },
                { icon: 'bell', tone: 'purple', text: 'Weekly summary available', time: 'Yesterday' },
              ] : [
                { icon: 'check-circle', tone: 'green', text: 'Training module completed', time: '30 min ago' },
                { icon: 'user-check', tone: 'cyan', text: 'Background check submitted', time: '2 hr ago' },
                { icon: 'headset', tone: 'purple', text: 'Welcome message from support', time: 'Yesterday' },
                { icon: 'bell', tone: 'orange', text: 'Equipment kit shipped', time: '2 days ago' },
              ]).map((a, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 0',
                  borderBottom: i < 3 ? '1px solid var(--jw-border)' : 'none'
                }}>
                  <div className={`jw-icon-tile ${a.tone}`} style={{ width: 30, height: 30, borderRadius: 8 }}>
                    <Icon name={a.icon} size={14} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{a.text}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--jw-text-subtle)', marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function mountTech() {
  const el = document.getElementById('tech-root');
  if (el && !el.__mounted) {
    el.__mounted = true;
    ReactDOM.createRoot(el).render(<TechApp onboarded={true} />);
  } else if (!el) {
    requestAnimationFrame(mountTech);
  }
}
mountTech();

function mountTechOnboarding() {
  const el = document.getElementById('tech-onboarding-root');
  if (el && !el.__mounted) {
    el.__mounted = true;
    ReactDOM.createRoot(el).render(<TechApp onboarded={false} />);
  } else if (!el) {
    requestAnimationFrame(mountTechOnboarding);
  }
}
mountTechOnboarding();
