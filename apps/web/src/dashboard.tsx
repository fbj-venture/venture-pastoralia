import { useState } from 'preact/hooks'

const FOLLOW_UPS = [
  { id: 1, name: 'Margaret Chen', reason: 'Hospital follow-up', due: 'Today', urgent: true },
  { id: 2, name: 'Robert Whitfield', reason: 'Grief support check-in', due: 'Today', urgent: true },
  { id: 3, name: 'The Morrison Family', reason: 'New member welcome', due: 'Thu', urgent: false },
  { id: 4, name: 'James Alcott', reason: 'Counseling follow-up', due: 'Fri', urgent: false },
  { id: 5, name: 'Eleanor Voss', reason: 'Bereavement support', due: 'Mon', urgent: false },
]

const RECENT_VISITS = [
  { id: 1, name: 'Patricia Okafor', type: 'Home', date: 'Yesterday', notes: 'Health concerns, prayed together' },
  { id: 2, name: 'Thomas & Linda Grant', type: 'Hospital', date: 'Mon', notes: 'Pre-surgery prayer, family present' },
  { id: 3, name: 'Youth Group', type: 'Group', date: 'Sun', notes: 'Post-service check-ins, 8 members' },
  { id: 4, name: 'Carl Benedetti', type: 'Counseling', date: 'Sat', notes: 'Marriage counseling, 2nd session' },
]

// ── Icons ────────────────────────────────────────────────

function IconGrid() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1" y="1" width="5.5" height="5.5" rx="1" fill="currentColor" />
      <rect x="8.5" y="1" width="5.5" height="5.5" rx="1" fill="currentColor" />
      <rect x="1" y="8.5" width="5.5" height="5.5" rx="1" fill="currentColor" />
      <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" fill="currentColor" />
    </svg>
  )
}

function IconPeople() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="4.5" r="2.5" fill="currentColor" />
      <path d="M2 13.5c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconPin() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M7.5 1C5.29 1 3.5 2.79 3.5 5c0 3.5 4 9 4 9s4-5.5 4-9c0-2.21-1.79-4-4-4z" fill="currentColor" />
      <circle cx="7.5" cy="5" r="1.25" fill="var(--bg-surface)" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7.5 4V7.5l2.5 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconDoc() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="2.5" y="1" width="10" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 5h5M5 7.5h5M5 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M7.5 1.5L2 3.5v3.75C2 10.5 4.5 13 7.5 13.5c3-.5 5.5-3 5.5-6.25V3.5L7.5 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M5 7.5l1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconStar() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M7.5 1.5l1.545 4.018H13.5l-3.436 2.455 1.309 4.027L7.5 9.59l-3.873 2.41 1.31-4.027L1.5 5.518h4.455L7.5 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

function IconCog() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M3.2 3.2l1.06 1.06M10.74 10.74l1.06 1.06M3.2 11.8l1.06-1.06M10.74 4.26l1.06-1.06" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function IconHamburger() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function IconPlus() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

// ── Nav config ───────────────────────────────────────────

const NAV = [
  { id: 'dashboard', label: 'Dashboard', Icon: IconGrid, active: true },
  { id: 'people', label: 'People', Icon: IconPeople },
  { id: 'visits', label: 'Visits', Icon: IconPin },
  { id: 'followups', label: 'Follow-ups', Icon: IconClock },
  { id: 'reports', label: 'Reports', Icon: IconDoc },
]

// ── Components ───────────────────────────────────────────

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <aside class={`sidebar${open ? ' sidebar--open' : ''}`}>
      <div class="sidebar__logo">
        <span class="sidebar__logomark">✦</span>
        <span class="sidebar__logotext">Pastoralia</span>
      </div>

      <nav class="sidebar__nav">
        {NAV.map(({ id, label, Icon, active }) => (
          <a key={id} href="#" class={`sidebar__navitem${active ? ' sidebar__navitem--active' : ''}`} onClick={onClose}>
            <span class="sidebar__navicon"><Icon /></span>
            <span>{label}</span>
          </a>
        ))}

        <div class="sidebar__section">
          <span class="sidebar__section-label">Administration</span>
          <a href="#" class="sidebar__navitem sidebar__navitem--admin" onClick={onClose}>
            <span class="sidebar__navicon"><IconShield /></span>
            <span>Admin Panel</span>
          </a>
          <a href="#" class="sidebar__navitem sidebar__navitem--superuser" onClick={onClose}>
            <span class="sidebar__navicon"><IconStar /></span>
            <span>Super User</span>
            <span class="sidebar__badge">SU</span>
          </a>
        </div>
      </nav>

      <div class="sidebar__footer">
        <a href="#" class="sidebar__navitem" onClick={onClose}>
          <span class="sidebar__navicon"><IconCog /></span>
          <span>Settings</span>
        </a>
        <div class="sidebar__user">
          <div class="sidebar__avatar">FJ</div>
          <div class="sidebar__userinfo">
            <span class="sidebar__username">Pastor Francis</span>
            <span class="sidebar__userrole">Super User</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  const date = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <header class="header">
      <div class="header__left">
        <button class="header__hamburger" onClick={onMenuToggle} aria-label="Toggle menu">
          <IconHamburger />
        </button>
        <div>
          <h1 class="header__title">{greeting}, Pastor Francis</h1>
          <p class="header__date">{date}</p>
        </div>
      </div>
      <button class="btn btn--primary">
        <IconPlus />
        <span class="btn__label">Log a visit</span>
      </button>
    </header>
  )
}

function Stats() {
  return (
    <div class="stats">
      <div class="stat">
        <span class="stat__value">7</span>
        <span class="stat__label">Visits this week</span>
        <span class="stat__trend stat__trend--positive">↑ 2 from last week</span>
      </div>
      <div class="stat stat--alert">
        <span class="stat__value">12</span>
        <span class="stat__label">Follow-ups pending</span>
        <span class="stat__trend stat__trend--warn">3 due today</span>
      </div>
      <div class="stat">
        <span class="stat__value">148</span>
        <span class="stat__label">Active members</span>
      </div>
      <div class="stat">
        <span class="stat__value">4</span>
        <span class="stat__label">New this month</span>
        <span class="stat__trend stat__trend--positive">↑ Welcome them</span>
      </div>
    </div>
  )
}

function FollowUpsPanel() {
  return (
    <section class="panel">
      <div class="panel__header">
        <h2 class="panel__title">Upcoming Follow-ups</h2>
        <a href="#" class="panel__link">View all</a>
      </div>
      <ul class="list">
        {FOLLOW_UPS.map(fu => (
          <li key={fu.id} class={`list__item${fu.urgent ? ' list__item--urgent' : ''}`}>
            <div class="list__main">
              <span class="list__name">{fu.name}</span>
              <span class="list__sub">{fu.reason}</span>
            </div>
            <div class="list__meta">
              <span class={`list__due${fu.urgent ? ' list__due--urgent' : ''}`}>{fu.due}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function RecentVisitsPanel() {
  return (
    <section class="panel">
      <div class="panel__header">
        <h2 class="panel__title">Recent Visits</h2>
        <a href="#" class="panel__link">View all</a>
      </div>
      <ul class="list">
        {RECENT_VISITS.map(v => (
          <li key={v.id} class="list__item">
            <div class="list__main">
              <div class="list__name-row">
                <span class="list__name">{v.name}</span>
                <span class="list__badge">{v.type}</span>
              </div>
              <span class="list__sub">{v.notes}</span>
            </div>
            <div class="list__meta">
              <span class="list__due">{v.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

// ── Dashboard page ───────────────────────────────────────

export function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div class="layout">
      {menuOpen && <div class="sidebar-backdrop" onClick={() => setMenuOpen(false)} />}
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main class="main">
        <Header onMenuToggle={() => setMenuOpen(o => !o)} />
        <div class="content">
          <Stats />
          <div class="panels">
            <FollowUpsPanel />
            <RecentVisitsPanel />
          </div>
        </div>
      </main>
    </div>
  )
}
