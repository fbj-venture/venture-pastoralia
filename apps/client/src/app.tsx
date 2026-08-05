import {Router, Route} from 'preact-iso'
import './styles/main.css'
import {Login} from './auth/login'
import {Dashboard} from './dashboard/dashboard'
import {QueryClient, QueryClientProvider} from "@tanstack/preact-query"
import {Devtools} from './devtools'

const query = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={query}>
      <Router>
        <Route path="/" component={Login}/>
        <Route path="/dashboard" component={Dashboard}/>
      </Router>
      {import.meta.env.DEV && <Devtools/>}
    </QueryClientProvider>
  )
}
