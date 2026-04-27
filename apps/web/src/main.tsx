import { render } from 'preact'
import { LocationProvider } from 'preact-iso'
import { App } from './app'

render(
  <LocationProvider>
    <App />
  </LocationProvider>,
  document.getElementById('app')!,
)
