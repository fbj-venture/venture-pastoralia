import {
  IconClock,
  IconCog,
  IconDoc,
  IconGrid,
  IconLogout,
  IconPeople,
  IconPin,
  IconShield,
  IconStar, IconSync
} from "../../components/icons";
import { JSX } from "preact";
import { User } from "@app/shared";
import { useLocation } from "preact-iso";
import { tryLogout } from "../../data/auth";

const NAV = [
  {id: 'dashboard', label: 'Dashboard', Icon: IconGrid, active: true},
  {id: 'people', label: 'People', Icon: IconPeople},
  {id: 'visits', label: 'Visits', Icon: IconPin},
  {id: 'followups', label: 'Follow-ups', Icon: IconClock},
  {id: 'reports', label: 'Reports', Icon: IconDoc},
]

interface Props {
  open: boolean;
  onClose: () => void
  user: User | null;
}

export const Sidebar = ({open, onClose, user}: Props): JSX.Element => {
  const {route} = useLocation()

  const handleLogout = async () => {
    await tryLogout()
    route('/')
  }

  return (
    <aside class={ `sidebar${ open ? ' sidebar--open' : '' }` }>
      <div class="sidebar__logo">
        <span class="sidebar__logomark">✦</span>
        <span class="sidebar__logotext">Pastoralia</span>
      </div>

      <nav class="sidebar__nav">
        { NAV.map(({id, label, Icon, active}) => (
          <a key={ id } href="#" class={ `sidebar__navitem${ active ? ' sidebar__navitem--active' : '' }` }
             onClick={ onClose }>
            <span class="sidebar__navicon"><Icon/></span>
            <span>{ label }</span>
          </a>
        )) }

        <div class="sidebar__section">
          <span class="sidebar__section-label">Administration</span>
          <a href="#" class="sidebar__navitem sidebar__navitem--admin" onClick={ onClose }>
            <span class="sidebar__navicon"><IconShield/></span>
            <span>Admin Panel</span>
          </a>
          <a href="#" class="sidebar__navitem sidebar__navitem--superuser" onClick={ onClose }>
            <span class="sidebar__navicon"><IconSync/></span>
            <span>Synchronise</span>
          </a>
          <a href="#" class="sidebar__navitem sidebar__navitem--superuser" onClick={ onClose }>
            <span class="sidebar__navicon"><IconStar/></span>
            <span>Super User</span>
            <span class="sidebar__badge">SU</span>
          </a>
        </div>
      </nav>

      <div class="sidebar__footer">
        <button
          type="button"
          class="sidebar__user"
          popovertarget="user-menu"
          popovertargetaction="toggle"
        >
          <div class="sidebar__avatar">FJ</div>
          <div class="sidebar__userinfo">
            <span class="sidebar__username">Francis</span>
            <span class="sidebar__userrole">Super User</span>
          </div>
        </button>

        <div id="user-menu" popover="auto" class="sidebar__menu">
          <a href="#" class="sidebar__navitem" onClick={ onClose }>
            <span class="sidebar__navicon"><IconCog/></span>
            <span>Settings</span>
          </a>
          <button type="button" class="sidebar__navitem sidebar__navitem--danger" onClick={ handleLogout }>
            <span class="sidebar__navicon"><IconLogout/></span>
            <span>Log out</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
