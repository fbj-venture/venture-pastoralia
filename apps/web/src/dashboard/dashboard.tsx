import {api} from '../data/api'
import {useState, useEffect} from 'preact/hooks'
import {useLocation} from 'preact-iso'
import {Sidebar} from "./components/sidebar";
import {Stats} from "./components/stats";
import {FollowUpsPanel} from "./components/followups-panel";
import {RecentVisitsPanel} from "./components/recent-visits";
import {Header} from "./components/header";

export function Dashboard() {
    const {route} = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        api.api.auth.me.$get()
            .then(res => res.json())
            .then(data => {
                if (!data.user) route('/')
                else setChecked(true)
            })
            .catch(() => route('/'))
    }, [])

    if (!checked) return null

    return (
        <div class="layout">
            {menuOpen && <div class="sidebar-backdrop" onClick={() => setMenuOpen(false)}/>}
            <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)}/>
            <main class="main">
                <Header onMenuToggle={() => setMenuOpen(o => !o)}/>
                <div class="content">
                    <Stats/>
                    <div class="panels">
                        <FollowUpsPanel/>
                        <RecentVisitsPanel/>
                    </div>
                </div>
            </main>
        </div>
    )
}
