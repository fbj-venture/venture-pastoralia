import { useState, useEffect } from 'preact/hooks'
import { useLocation } from 'preact-iso'
import { useQuery } from '@tanstack/preact-query'
import { Sidebar } from "./components/sidebar";
import { Stats } from "./components/stats";
import { FollowUpsPanel } from "./components/followups-panel";
import { RecentVisitsPanel } from "./components/recent-visits";
import { Header } from "./components/header";
import { getMe } from "../data/auth";

export function Dashboard() {
  const {route} = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const {data: user, isPending} = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
  })

  useEffect(() => {
    if (!isPending && !user) route('/')
  }, [isPending, user])

  if (!user) return null

  return (
    <div class="layout">
      { menuOpen && <div class="sidebar-backdrop" onClick={ () => setMenuOpen(false) }/> }
      <Sidebar open={ menuOpen } onClose={ () => setMenuOpen(false) } user={user}/>
      <main class="main">
        <Header onMenuToggle={ () => setMenuOpen(o => !o) }/>
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
