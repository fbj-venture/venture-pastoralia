import { Router, Route } from 'preact-iso'
import './global.css'
import { Login } from './login'
import { Dashboard } from './dashboard'

export function App() {
  return (
    <Router>
      <Route path="/" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
    </Router>
  )
}
