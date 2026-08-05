import {hc} from 'hono/client'
import type {AppType} from '../../../server/src'

// Module-level token store. Cleared on logout or page refresh.
// Persistent sessions (survive refresh) can be layered on later via sessionStorage.
let _token: string | null = null

export function setToken(token: string | null) {
    _token = token
}

export const api = hc<AppType>('/', {
    fetch: (input: string | Request | URL, init: RequestInit | undefined) => {
        const headers = new Headers(init?.headers)
        if (_token) {
            headers.set('Authorization', `Bearer ${_token}`)
        }
        return fetch(input, {...init, headers})
    },
})
