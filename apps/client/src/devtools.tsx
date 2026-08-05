import { useEffect, useRef } from 'preact/hooks'
import { TanStackDevtools } from '@tanstack/preact-devtools'
import type { TanStackDevtoolsPreactPlugin } from '@tanstack/preact-devtools'
import type { TanStackDevtoolsPluginProps } from '@tanstack/devtools'
import { FormDevtoolsCore } from '@tanstack/form-devtools'
import { PreactQueryDevtoolsPanel } from '@tanstack/preact-query-devtools'

function FormDevtoolsPanel(props: TanStackDevtoolsPluginProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const core = new FormDevtoolsCore()
    if (ref.current) {
      core.mount(ref.current, props)
    }
    return () => core.unmount()
  }, [])

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />
}

const formDevtoolsPlugin: TanStackDevtoolsPreactPlugin = {
  id: 'tanstack-form-devtools',
  name: 'TanStack Form',
  render: (_el, props) => <FormDevtoolsPanel {...props} />,
}

const queryDevtoolsPlugin: TanStackDevtoolsPreactPlugin = {
  id: 'tanstack-query-devtools',
  name: 'TanStack Query',
  render: <PreactQueryDevtoolsPanel/>,
}

export function Devtools() {
  return <TanStackDevtools plugins={[formDevtoolsPlugin, queryDevtoolsPlugin]}/>
}