import {Hono} from 'hono'
import {validator} from 'hono/validator'
import {supabase} from '../lib/supabase.js'

export const auth = new Hono()
    .post(
        '/login',
        validator('json', (value, c) => {
            const v = value as Record<string, unknown>
            if (typeof v.email !== 'string' || typeof v.password !== 'string') {
                return c.json({error: 'email and password are required'}, 400)
            }
            return {email: v.email, password: v.password}
        }),
        async (c) => {
            const {email, password} = c.req.valid('json')
            const {data, error} = await supabase.auth.signInWithPassword({email, password})
            console.log({data, error})
            if (error) return c.json({error: error.message}, 401)
            return c.json({
                access_token: data.session.access_token,
                expires_at: data.session.expires_at ?? null,
                user: {id: data.user.id, email: data.user.email ?? null},
            })
        },
    )
    .post('/logout', async (c) => {
        // The frontend clears its token. The JWT will expire naturally.
        // Full server-side revocation of all sessions is available via supabaseAdmin
        // and will be wired up when the user management layer is built.
        return c.json({ok: true})
    })
    .get('/me', async (c) => {
        const bearer = c.req.header('Authorization')
        const token = bearer?.startsWith('Bearer ') ? bearer.slice(7) : null
        if (!token) return c.json({user: null}, 401)

        const {data, error} = await supabase.auth.getUser(token)
        if (error || !data.user) return c.json({user: null}, 401)

        return c.json({
            user: {id: data.user.id, email: data.user.email ?? null},
        })
    })
