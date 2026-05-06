// Technician Onboarding — full multi-step flow
// Renders into <div id="onboarding-root"></div>
// 8 steps, animated, with per-step forms, progress sidebar, and celebration on finish.

const ONB_STEPS = [
  { key: 'private',    title: 'Private Profile',          icon: 'user-check', eta: '3 min',  desc: 'Your contact info & address — only we can see this.' },
  { key: 'public',     title: 'Public Profile',           icon: 'sparkle',    eta: '4 min',  desc: 'The photo, bio, and service area clients will see.' },
  { key: 'training',   title: 'Training Module',          icon: 'droplet',    eta: '25 min', desc: 'Five short videos on JustWashes standards.' },
  { key: 'policies',   title: 'Policies & Agreements',    icon: 'doc',        eta: '5 min',  desc: 'Review and sign the operator agreement.' },
  { key: 'background', title: 'Background Check',         icon: 'alert',      eta: '2 min',  desc: 'We run this through Checkr — takes 24–48 hrs.' },
  { key: 'payment',    title: 'Payment Details',          icon: 'card',       eta: '3 min',  desc: 'Where your payouts land each week.' },
  { key: 'availability', title: 'Manage Availability',    icon: 'calendar',   eta: '4 min',  desc: 'Weekly hours you can take jobs.' },
  { key: 'equipment',  title: 'Equipment & Supplies',     icon: 'car',        eta: '2 min',  desc: 'Confirm your starter kit order.' },
];

// ============================================================
// Step 1 — Private Profile
// ============================================================
function StepPrivate({ data, setData }) {
  return (
    <div className="onb-fade">
      <div className="onb-step-heading">
        <div>
          <h2 className="onb-h2">Let's start with your basics</h2>
          <p className="onb-sub">This stays private between you and JustWashes dispatch.</p>
        </div>
        <Chip tone="slate"><Icon name="alert" size={11}/> Private</Chip>
      </div>

      <div className="onb-grid-2">
        <Field label="Legal first name" required>
          <input className="onb-input" value={data.firstName || ''} placeholder="Marcus"
            onChange={e => setData({ ...data, firstName: e.target.value })}/>
        </Field>
        <Field label="Legal last name" required>
          <input className="onb-input" value={data.lastName || ''} placeholder="Thompson"
            onChange={e => setData({ ...data, lastName: e.target.value })}/>
        </Field>
        <Field label="Mobile phone" required>
          <input className="onb-input" value={data.phone || ''} placeholder="(555) 010-4482"
            onChange={e => setData({ ...data, phone: e.target.value })}/>
        </Field>
        <Field label="Email" required>
          <input className="onb-input" value={data.email || ''} placeholder="marcus@email.com"
            onChange={e => setData({ ...data, email: e.target.value })}/>
        </Field>
        <Field label="Date of birth">
          <input className="onb-input" type="date" value={data.dob || ''}
            onChange={e => setData({ ...data, dob: e.target.value })}/>
        </Field>
        <Field label="Preferred language">
          <select className="onb-input" value={data.lang || 'en'}
            onChange={e => setData({ ...data, lang: e.target.value })}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </Field>
      </div>

      <div className="onb-section-hdr">Home address</div>
      <div className="onb-grid-2">
        <Field label="Street" span={2}>
          <input className="onb-input" value={data.street || ''} placeholder="742 Maple Ave"
            onChange={e => setData({ ...data, street: e.target.value })}/>
        </Field>
        <Field label="City">
          <input className="onb-input" value={data.city || ''} placeholder="Austin"
            onChange={e => setData({ ...data, city: e.target.value })}/>
        </Field>
        <Field label="State">
          <input className="onb-input" value={data.state || ''} placeholder="TX"
            onChange={e => setData({ ...data, state: e.target.value })}/>
        </Field>
        <Field label="ZIP">
          <input className="onb-input" value={data.zip || ''} placeholder="78701"
            onChange={e => setData({ ...data, zip: e.target.value })}/>
        </Field>
      </div>
    </div>
  );
}

// ============================================================
// Step 2 — Public Profile
// ============================================================
function StepPublic({ data, setData }) {
  const fileInputRef = React.useRef(null);
  const handlePhoto = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setData({ ...data, photo: url });
  };
  const bioCount = (data.bio || '').length;

  return (
    <div className="onb-fade">
      <div className="onb-step-heading">
        <div>
          <h2 className="onb-h2">How clients will see you</h2>
          <p className="onb-sub">This profile appears when riders book a wash.</p>
        </div>
        <Chip tone="cyan"><Icon name="sparkle" size={11}/> Public</Chip>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 28, alignItems: 'flex-start' }}>
        <div>
          <div className="onb-photo-ring" onClick={() => fileInputRef.current?.click()}>
            {data.photo ? (
              <img src={data.photo} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}/>
            ) : (
              <>
                <Icon name="user-check" size={42} color="#94A3B8" stroke={1.5}/>
                <div style={{ marginTop: 10, fontSize: 12, color: 'var(--jw-text-muted)', fontWeight: 600 }}>Upload photo</div>
              </>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto}/>
          <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11.5, color: 'var(--jw-text-subtle)' }}>
            Square shots work best. PNG or JPG.
          </div>

          <div className="onb-preview-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: data.photo
                  ? `url(${data.photo}) center/cover`
                  : 'linear-gradient(135deg, #F7B267, #F4845F)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700
              }}>
                {!data.photo && (data.displayName?.[0] || 'M')}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{data.displayName || 'Your Name'}</div>
                <div style={{ fontSize: 11.5, color: 'var(--jw-text-muted)' }}>
                  <Icon name="star" size={10}/> New · {data.serviceRadius || 10} mi radius
                </div>
              </div>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--jw-text-subtle)', marginTop: 10, fontStyle: 'italic', lineHeight: 1.5 }}>
              "{data.bio || 'Your bio will appear here…'}"
            </div>
            <div style={{ fontSize: 11, color: 'var(--jw-text-muted)', marginTop: 8, fontWeight: 600 }}>
              Live preview — this is what clients see
            </div>
          </div>
        </div>

        <div>
          <Field label="Display name">
            <input className="onb-input" value={data.displayName || ''} placeholder="Marcus T."
              onChange={e => setData({ ...data, displayName: e.target.value })}/>
          </Field>
          <Field label="Short bio">
            <textarea className="onb-input" rows={4} maxLength={240}
              value={data.bio || ''}
              placeholder="Detail-obsessed, been washing cars since I could reach the roof. I take pride in leaving every vehicle cleaner than I found it."
              onChange={e => setData({ ...data, bio: e.target.value })}/>
            <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--jw-text-subtle)', marginTop: 4 }}>{bioCount}/240</div>
          </Field>
          <Field label={`Service radius — ${data.serviceRadius || 10} miles from home`}>
            <input type="range" min="2" max="40" value={data.serviceRadius || 10}
              className="onb-slider"
              onChange={e => setData({ ...data, serviceRadius: parseInt(e.target.value) })}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--jw-text-subtle)', marginTop: 4 }}>
              <span>2 mi</span><span>40 mi</span>
            </div>
          </Field>
          <Field label="Specialties (pick any)">
            <div className="onb-chips-row">
              {['Daily drivers','Luxury','EV','SUV/Truck','Motorcycle','Boats','Detailing','Ceramic coat'].map(s => {
                const active = (data.specialties || []).includes(s);
                return (
                  <button key={s} className={`onb-chip-btn ${active ? 'active' : ''}`}
                    onClick={() => {
                      const cur = data.specialties || [];
                      setData({ ...data, specialties: active ? cur.filter(x => x !== s) : [...cur, s] });
                    }}>
                    {active && <Icon name="check" size={11} stroke={3}/>}
                    {s}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Step 3 — Training
// ============================================================
function StepTraining({ data, setData }) {
  const modules = [
    { key: 'm1', title: 'Welcome to JustWashes',        duration: '3:12', desc: 'Company values, what we expect on every job.' },
    { key: 'm2', title: 'The 10-step wash process',     duration: '8:44', desc: 'Our signature wash procedure, step by step.' },
    { key: 'm3', title: 'Interior detailing standards', duration: '6:20', desc: 'Vacuuming, windows, dashboards — what good looks like.' },
    { key: 'm4', title: 'Handling tough situations',    duration: '4:58', desc: 'Customer conflicts, damage claims, safety.' },
    { key: 'm5', title: 'Final assessment',             duration: '3:30', desc: '10 questions — 80% to pass.' },
  ];
  const watched = data.watched || [];
  const [playing, setPlaying] = React.useState(null);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (!playing) return;
    setProgress(0);
    const start = Date.now();
    const t = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / 2500) * 100);
      setProgress(p);
      if (p >= 100) {
        clearInterval(t);
        setData({ ...data, watched: [...new Set([...watched, playing])] });
        setTimeout(() => { setPlaying(null); setProgress(0); }, 400);
      }
    }, 40);
    return () => clearInterval(t);
  }, [playing]);

  return (
    <div className="onb-fade">
      <div className="onb-step-heading">
        <div>
          <h2 className="onb-h2">Watch & complete training</h2>
          <p className="onb-sub">Five short videos. Watch them in order — you can rewatch anytime.</p>
        </div>
        <Chip tone="cyan">{watched.length}/5 complete</Chip>
      </div>

      <div className="onb-module-list">
        {modules.map((m, i) => {
          const done = watched.includes(m.key);
          const unlocked = i === 0 || watched.includes(modules[i-1].key);
          const isPlaying = playing === m.key;
          return (
            <div key={m.key} className={`onb-module ${done ? 'done' : ''} ${!unlocked ? 'locked' : ''}`}>
              <div className="onb-mod-thumb">
                {done ? (
                  <Icon name="check" size={20} stroke={2.5} color="white"/>
                ) : !unlocked ? (
                  <Icon name="alert" size={18} color="#94A3B8"/>
                ) : isPlaying ? (
                  <div className="onb-pulse"/>
                ) : (
                  <div className="onb-play-triangle"/>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--jw-text-subtle)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Module {i + 1}</span>
                  <span style={{ fontSize: 11, color: 'var(--jw-text-subtle)' }}>· {m.duration}</span>
                  {done && <Chip tone="green"><Icon name="check" size={10} stroke={3}/> Watched</Chip>}
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, marginTop: 3 }}>{m.title}</div>
                <div style={{ fontSize: 12, color: 'var(--jw-text-muted)', marginTop: 3 }}>{m.desc}</div>
                {isPlaying && (
                  <div style={{ marginTop: 10, height: 4, background: '#E5E9F0', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #1EA6E1, #39C1F2)', transition: 'width 40ms linear' }}/>
                  </div>
                )}
              </div>
              <button
                className={`jw-btn sm ${done ? 'outline' : 'primary'}`}
                disabled={!unlocked || isPlaying}
                style={{ opacity: unlocked ? 1 : 0.5 }}
                onClick={() => unlocked && !isPlaying && setPlaying(m.key)}>
                {done ? 'Rewatch' : isPlaying ? 'Playing…' : unlocked ? <>Play <Icon name="arrow-right" size={12}/></> : 'Locked'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Step 4 — Policies
// ============================================================
function StepPolicies({ data, setData }) {
  const items = [
    { key: 'operator', title: 'Operator Agreement', preview: 'Governs your status as an independent provider on the JustWashes platform.' },
    { key: 'conduct', title: 'Code of Conduct', preview: 'Professionalism, safety, and the standards we hold every tech to.' },
    { key: 'damage', title: 'Damage & Claims Policy', preview: 'How we handle client damage reports and your coverage.' },
    { key: 'privacy', title: 'Privacy & Data Handling', preview: 'What we collect, what we share, and your rights.' },
  ];
  const acked = data.acked || [];
  const toggle = (k) => {
    setData({ ...data, acked: acked.includes(k) ? acked.filter(x => x !== k) : [...acked, k] });
  };

  return (
    <div className="onb-fade">
      <div className="onb-step-heading">
        <div>
          <h2 className="onb-h2">Review & sign our agreements</h2>
          <p className="onb-sub">Click each to expand and acknowledge.</p>
        </div>
        <Chip tone="cyan">{acked.length}/{items.length} signed</Chip>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(it => {
          const isAcked = acked.includes(it.key);
          return (
            <div key={it.key} className={`onb-policy ${isAcked ? 'acked' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className={`onb-check ${isAcked ? 'on' : ''}`}>
                  {isAcked && <Icon name="check" size={13} stroke={3} color="white"/>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{it.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--jw-text-muted)', marginTop: 2 }}>{it.preview}</div>
                </div>
                <button className="jw-btn outline sm" onClick={() => {/* no-op preview */}}>
                  <Icon name="doc" size={12}/> Read
                </button>
                <button className={`jw-btn sm ${isAcked ? 'outline' : 'primary'}`} onClick={() => toggle(it.key)}>
                  {isAcked ? 'Unsign' : 'I agree'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="onb-signature-card">
        <div style={{ fontSize: 12.5, color: 'var(--jw-text-muted)' }}>Electronic signature</div>
        <input className="onb-signature-input" placeholder="Type your full legal name"
          value={data.signature || ''}
          onChange={e => setData({ ...data, signature: e.target.value })}/>
        <div style={{ fontSize: 11, color: 'var(--jw-text-subtle)', marginTop: 6 }}>
          Signed on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Step 5 — Background Check
// ============================================================
function StepBackground({ data, setData }) {
  const [submitting, setSubmitting] = React.useState(false);
  const submitted = data.bgSubmitted;

  const submit = () => {
    if (!data.ssn || !data.consent) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setData({ ...data, bgSubmitted: true });
    }, 1400);
  };

  if (submitted) {
    return (
      <div className="onb-fade onb-bg-submitted">
        <div className="onb-success-ring">
          <Icon name="check" size={42} stroke={2.5} color="white"/>
        </div>
        <h2 className="onb-h2" style={{ marginTop: 20 }}>Submitted to Checkr</h2>
        <p className="onb-sub" style={{ maxWidth: 440, textAlign: 'center' }}>
          Your background check is processing. Most come back within 24–48 hours. We'll email you when it clears.
        </p>
        <div className="onb-process-steps">
          <div className="onb-proc done"><Icon name="check" size={14} stroke={3} color="white"/><span>Submitted</span></div>
          <div className="onb-proc-line"/>
          <div className="onb-proc active"><div className="onb-pulse-dot"/><span>Processing</span></div>
          <div className="onb-proc-line"/>
          <div className="onb-proc"><span>3</span><span>Cleared</span></div>
        </div>
      </div>
    );
  }

  return (
    <div className="onb-fade">
      <div className="onb-step-heading">
        <div>
          <h2 className="onb-h2">Background check</h2>
          <p className="onb-sub">We partner with Checkr. Encrypted, never stored on our side.</p>
        </div>
        <Chip tone="slate"><Icon name="alert" size={11}/> Encrypted</Chip>
      </div>

      <div className="onb-grid-2">
        <Field label="Social Security Number" required>
          <input className="onb-input" value={data.ssn || ''} placeholder="•••-••-••••"
            onChange={e => setData({ ...data, ssn: e.target.value })}/>
        </Field>
        <Field label="Driver's license #">
          <input className="onb-input" value={data.license || ''} placeholder="TX123456789"
            onChange={e => setData({ ...data, license: e.target.value })}/>
        </Field>
        <Field label="License state">
          <input className="onb-input" value={data.licenseState || ''} placeholder="TX"
            onChange={e => setData({ ...data, licenseState: e.target.value })}/>
        </Field>
        <Field label="License expires">
          <input className="onb-input" type="date" value={data.licenseExp || ''}
            onChange={e => setData({ ...data, licenseExp: e.target.value })}/>
        </Field>
      </div>

      <label className="onb-consent">
        <input type="checkbox" checked={!!data.consent} onChange={e => setData({ ...data, consent: e.target.checked })}/>
        <span>I authorize JustWashes and Checkr, Inc. to run a background and motor vehicle report. I understand results may affect my eligibility to provide services.</span>
      </label>

      <button className="jw-btn primary"
        disabled={!data.ssn || !data.consent || submitting}
        style={{ marginTop: 14, opacity: (!data.ssn || !data.consent) ? 0.5 : 1 }}
        onClick={submit}>
        {submitting ? <>Submitting… <span className="onb-spin"/></> : <>Submit to Checkr <Icon name="arrow-right" size={12}/></>}
      </button>
    </div>
  );
}

// ============================================================
// Step 6 — Payment Details
// ============================================================
function StepPayment({ data, setData }) {
  return (
    <div className="onb-fade">
      <div className="onb-step-heading">
        <div>
          <h2 className="onb-h2">Where should we send your pay?</h2>
          <p className="onb-sub">Weekly direct deposit. First payout lands 7 days after your first job.</p>
        </div>
        <Chip tone="green"><Icon name="dollar" size={11}/> Stripe secured</Chip>
      </div>

      <div className="onb-radio-grid">
        {[
          { key: 'bank', label: 'Bank account (ACH)', desc: 'Free, 1–2 day deposit', icon: 'card' },
          { key: 'debit', label: 'Debit card', desc: 'Instant, 1% fee per payout', icon: 'card' },
        ].map(opt => (
          <button key={opt.key}
            className={`onb-radio-card ${(data.payoutMethod || 'bank') === opt.key ? 'active' : ''}`}
            onClick={() => setData({ ...data, payoutMethod: opt.key })}>
            <div className="onb-radio-dot"/>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{opt.label}</div>
              <div style={{ fontSize: 12, color: 'var(--jw-text-muted)', marginTop: 2 }}>{opt.desc}</div>
            </div>
            <Icon name={opt.icon} size={20} color="#6B7689"/>
          </button>
        ))}
      </div>

      <div className="onb-grid-2" style={{ marginTop: 20 }}>
        <Field label="Account holder name" required>
          <input className="onb-input" value={data.holder || ''} placeholder="Marcus Thompson"
            onChange={e => setData({ ...data, holder: e.target.value })}/>
        </Field>
        <Field label="Bank name">
          <input className="onb-input" value={data.bank || ''} placeholder="Chase"
            onChange={e => setData({ ...data, bank: e.target.value })}/>
        </Field>
        <Field label="Routing #" required>
          <input className="onb-input" value={data.routing || ''} placeholder="021000021"
            onChange={e => setData({ ...data, routing: e.target.value })}/>
        </Field>
        <Field label="Account #" required>
          <input className="onb-input" value={data.account || ''} placeholder="••••••1234"
            onChange={e => setData({ ...data, account: e.target.value })}/>
        </Field>
      </div>

      <div className="onb-tax-block">
        <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 6 }}>Tax info (W-9)</div>
        <div style={{ fontSize: 12, color: 'var(--jw-text-muted)', marginBottom: 10 }}>
          As an independent contractor, we'll issue a 1099 each year if you earn over $600.
        </div>
        <div className="onb-grid-2">
          <Field label="Filing type">
            <select className="onb-input" value={data.filing || 'individual'}
              onChange={e => setData({ ...data, filing: e.target.value })}>
              <option value="individual">Individual / Sole Proprietor</option>
              <option value="llc">Single-member LLC</option>
              <option value="corp">Corporation</option>
            </select>
          </Field>
          <Field label="Taxpayer ID (SSN or EIN)">
            <input className="onb-input" value={data.tin || ''} placeholder="•••-••-••••"
              onChange={e => setData({ ...data, tin: e.target.value })}/>
          </Field>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Step 7 — Availability (uses shared AvailabilityCalendar module)
// ============================================================
function StepAvailability({ data, setData }) {
  return (
    <AvailabilityCalendar
      value={{
        phase: data.phase || 'defaults',
        weekly: data.weekly || window.availHelpers.defaultWeekly(),
        overrides: data.overrides || {},
        selectedDate: data.selectedDate || null,
      }}
      onChange={(v) => setData({ ...data, ...v })}
    />
  );
}


// ============================================================
// Step 8 — Equipment
// ============================================================
function StepEquipment({ data, setData }) {
  const kit = [
    { key: 'bucket', name: 'Two-bucket wash system', price: 'Included', desc: 'Grit guards + color-coded buckets' },
    { key: 'soap', name: 'pH-neutral wash concentrate', price: 'Included', desc: '1 gallon, ~20 washes' },
    { key: 'towels', name: 'Microfiber set (12 ct)', price: 'Included', desc: 'Dedicated wheel, glass, and body towels' },
    { key: 'vacuum', name: 'Cordless wet/dry vacuum', price: '$149', desc: 'Optional — monthly rental available' },
    { key: 'pressure', name: 'Portable pressure washer', price: '$249', desc: 'Optional — recommended for pros' },
  ];
  const selected = data.kit || { bucket: true, soap: true, towels: true };
  const toggle = (k) => setData({ ...data, kit: { ...selected, [k]: !selected[k] } });
  const total = kit.reduce((sum, it) => {
    if (!selected[it.key]) return sum;
    const n = parseFloat(it.price.replace(/[^0-9.]/g, ''));
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  return (
    <div className="onb-fade">
      <div className="onb-step-heading">
        <div>
          <h2 className="onb-h2">Starter equipment kit</h2>
          <p className="onb-sub">Core items are included. Optional tools ship from our warehouse.</p>
        </div>
        <Chip tone="green"><Icon name="check" size={11} stroke={3}/> Ships free</Chip>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {kit.map(it => {
          const on = !!selected[it.key];
          const included = it.price === 'Included';
          return (
            <div key={it.key} className={`onb-kit-row ${on ? 'on' : ''}`} onClick={() => !included && toggle(it.key)}
              style={{ cursor: included ? 'default' : 'pointer' }}>
              <div className={`onb-kit-check ${on ? 'on' : ''}`}>
                {on && <Icon name="check" size={13} stroke={3} color="white"/>}
              </div>
              <div className="onb-kit-icon"><Icon name="car" size={22} color="#1EA6E1"/></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{it.name}</div>
                <div style={{ fontSize: 12, color: 'var(--jw-text-muted)', marginTop: 2 }}>{it.desc}</div>
              </div>
              <div style={{ fontWeight: 700, color: included ? '#2CB67D' : 'var(--jw-text)' }}>
                {it.price}
              </div>
            </div>
          );
        })}
      </div>

      <div className="onb-total-row">
        <div>
          <div style={{ fontSize: 12, color: 'var(--jw-text-muted)' }}>Shipping address</div>
          <div style={{ fontWeight: 600, marginTop: 2 }}>Same as home address →</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: 'var(--jw-text-muted)' }}>One-time charge</div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5 }}>${total.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Celebration
// ============================================================
function Celebration({ onGo }) {
  const [confetti, setConfetti] = React.useState([]);
  React.useEffect(() => {
    const arr = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 800,
      color: ['#23B7EC', '#2CB67D', '#F39C4C', '#7C5CFF', '#E24141'][i % 5],
      rot: Math.random() * 360,
      size: 8 + Math.random() * 8,
    }));
    setConfetti(arr);
  }, []);

  return (
    <div className="onb-celebrate">
      {confetti.map(c => (
        <div key={c.id} className="onb-confetti" style={{
          left: `${c.x}%`,
          animationDelay: `${c.delay}ms`,
          background: c.color,
          width: c.size, height: c.size,
          transform: `rotate(${c.rot}deg)`,
        }}/>
      ))}
      <div className="onb-celebrate-card">
        <div className="onb-success-ring big">
          <Icon name="check" size={56} stroke={2.5} color="white"/>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.5, margin: '22px 0 8px' }}>You're in!</h1>
        <p style={{ fontSize: 15, color: 'var(--jw-text-muted)', maxWidth: 480, textAlign: 'center', lineHeight: 1.5 }}>
          Onboarding complete. Your background check is still processing — once it clears, you'll be able to accept bookings right from your dashboard.
        </p>
        <div className="onb-celebrate-stats">
          <div><div className="onb-stat-num">8</div><div className="onb-stat-lbl">Steps done</div></div>
          <div><div className="onb-stat-num">~22</div><div className="onb-stat-lbl">Min to earn</div></div>
          <div><div className="onb-stat-num">4.9★</div><div className="onb-stat-lbl">Avg tech rating</div></div>
        </div>
        <button className="jw-btn primary" style={{ marginTop: 22, padding: '14px 28px', fontSize: 14 }} onClick={onGo}>
          Go to dashboard <Icon name="arrow-right" size={14}/>
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Small shared subcomponents
// ============================================================
function Field({ label, required, children, span }) {
  return (
    <div className="onb-field" style={{ gridColumn: span === 2 ? 'span 2' : undefined }}>
      <label>{label} {required && <span style={{ color: '#E24141' }}>*</span>}</label>
      {children}
    </div>
  );
}

// ============================================================
// Root
// ============================================================
function OnboardingApp() {
  const [step, setStep] = React.useState(0);
  const [done, setDone] = React.useState({});
  const [data, setData] = React.useState({});
  const [celebrate, setCelebrate] = React.useState(false);

  const markDone = () => setDone(d => ({ ...d, [ONB_STEPS[step].key]: true }));
  const isCurrentDone = done[ONB_STEPS[step].key];

  const goNext = () => {
    markDone();
    if (step < ONB_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setCelebrate(true);
    }
  };
  const goPrev = () => { if (step > 0) setStep(step - 1); };

  const progressPct = (Object.keys(done).length / ONB_STEPS.length) * 100;

  const stepContent = () => {
    const stepData = data[ONB_STEPS[step].key] || {};
    const setStepData = (d) => setData({ ...data, [ONB_STEPS[step].key]: d });
    switch (step) {
      case 0: return <StepPrivate data={stepData} setData={setStepData}/>;
      case 1: return <StepPublic data={stepData} setData={setStepData}/>;
      case 2: return <StepTraining data={stepData} setData={setStepData}/>;
      case 3: return <StepPolicies data={stepData} setData={setStepData}/>;
      case 4: return <StepBackground data={stepData} setData={setStepData}/>;
      case 5: return <StepPayment data={stepData} setData={setStepData}/>;
      case 6: return <StepAvailability data={stepData} setData={setStepData}/>;
      case 7: return <StepEquipment data={stepData} setData={setStepData}/>;
      default: return null;
    }
  };

  if (celebrate) return <Celebration onGo={() => setCelebrate(false)}/>;

  const cur = ONB_STEPS[step];

  return (
    <div className="jw-app onb-app">
      <aside className="onb-sidebar">
        <div className="jw-brand" style={{ padding: '4px 4px 20px' }}>
          <div className="jw-brand-logo">🧽</div>
          <div className="jw-brand-name">JustWashes</div>
        </div>

        <div className="onb-progress-block">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.75)', marginBottom: 8 }}>
            <span>Onboarding progress</span>
            <span>{Object.keys(done).length}/{ONB_STEPS.length}</span>
          </div>
          <div className="onb-progress-bar">
            <div className="onb-progress-fill" style={{ width: `${progressPct}%` }}/>
          </div>
        </div>

        <div className="onb-step-list">
          {ONB_STEPS.map((s, i) => {
            const isDone = done[s.key];
            const isCurrent = i === step;
            const isAhead = i > step && !isDone;
            return (
              <button key={s.key}
                className={`onb-step-item ${isCurrent ? 'current' : ''} ${isDone ? 'done' : ''} ${isAhead ? 'ahead' : ''}`}
                onClick={() => setStep(i)}>
                <div className="onb-step-num">
                  {isDone ? <Icon name="check" size={14} stroke={3} color="white"/> : (i + 1)}
                </div>
                <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <div className="onb-step-title">{s.title}</div>
                  <div className="onb-step-eta">{s.eta}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="onb-help-block">
          <Icon name="headset" size={16} color="#23B7EC"/>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>Need help?</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>We respond in under 5 min.</div>
          </div>
        </div>
      </aside>

      <div className="jw-main onb-main">
        <div className="onb-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Chip tone="cyan">Step {step + 1} of {ONB_STEPS.length}</Chip>
            <div style={{ fontSize: 13, color: 'var(--jw-text-muted)' }}>{cur.eta} · {cur.desc}</div>
          </div>
          <button className="jw-btn outline sm">Save & exit</button>
        </div>

        <div className="onb-topbar-progress">
          <div className="onb-topbar-fill" style={{ width: `${((step + 1) / ONB_STEPS.length) * 100}%` }}/>
        </div>

        <div className="onb-content">
          <div className="onb-step-head">
            <div className={`onb-step-icon-big tone-${cur.key}`}>
              <Icon name={cur.icon} size={22}/>
            </div>
            <div>
              <div className="onb-eyebrow">Step {step + 1} · {cur.eta}</div>
              <h1 className="onb-h1">{cur.title}</h1>
            </div>
          </div>

          <div key={step} className="onb-step-body">
            {stepContent()}
          </div>

          <div className="onb-footer">
            <button className="jw-btn outline" onClick={goPrev} disabled={step === 0} style={{ opacity: step === 0 ? 0.4 : 1 }}>
              ← Back
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              {!isCurrentDone && step < ONB_STEPS.length - 1 && (
                <button className="jw-btn outline" onClick={() => { markDone(); setStep(step + 1); }}>Skip for now</button>
              )}
              <button className="jw-btn primary" onClick={goNext}>
                {step === ONB_STEPS.length - 1 ? <>Finish onboarding <Icon name="check" size={14} stroke={2.5}/></> : <>Continue <Icon name="arrow-right" size={13}/></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function mountOnboarding() {
  const el = document.getElementById('onboarding-root');
  if (el && !el.__mounted) {
    el.__mounted = true;
    ReactDOM.createRoot(el).render(<OnboardingApp/>);
  } else if (!el) {
    requestAnimationFrame(mountOnboarding);
  }
}
mountOnboarding();
