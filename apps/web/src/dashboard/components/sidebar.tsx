import {IconClock, IconCog, IconDoc, IconGrid, IconPeople, IconPin, IconShield, IconStar} from "../../components/icons";
import {JSX} from "preact";

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
    user: User;
}

export function Sidebar({open, onClose}: Props): JSX.Element {

    return (
        <aside class={`sidebar${open ? ' sidebar--open' : ''}`}>
            <div class="sidebar__logo">
                <span class="sidebar__logomark">✦</span>
                <span class="sidebar__logotext">Pastoralia</span>
            </div>

            <nav class="sidebar__nav">
                {NAV.map(({id, label, Icon, active}) => (
                    <a key={id} href="#" class={`sidebar__navitem${active ? ' sidebar__navitem--active' : ''}`}
                       onClick={onClose}>
                        <span class="sidebar__navicon"><Icon/></span>
                        <span>{label}</span>
                    </a>
                ))}

                <div class="sidebar__section">
                    <span class="sidebar__section-label">Administration</span>
                    <a href="#" class="sidebar__navitem sidebar__navitem--admin" onClick={onClose}>
                        <span class="sidebar__navicon"><IconShield/></span>
                        <span>Admin Panel</span>
                    </a>
                    <a href="#" class="sidebar__navitem sidebar__navitem--superuser" onClick={onClose}>
                        <span class="sidebar__navicon"><IconStar/></span>
                        <span>Super User</span>
                        <span class="sidebar__badge">SU</span>
                    </a>
                </div>
            </nav>

            <div class="sidebar__footer">
                <a href="#" class="sidebar__navitem" onClick={onClose}>
                    <span class="sidebar__navicon"><IconCog/></span>
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

export default Sidebar
