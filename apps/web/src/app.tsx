import {Router, Route} from 'preact-iso'
import './global.css'
import {Login} from './auth/login'
import {Dashboard} from './dashboard/dashboard'
import {QueryClient, QueryClientProvider} from "@tanstack/preact-query"

const query = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={query}>
      <Router>
        <Route path="/" component={Login}/>
        <Route path="/dashboard" component={Dashboard}/>
      </Router>
    </QueryClientProvider>
  )
}
