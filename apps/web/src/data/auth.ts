import { api, setToken } from "./api";
import { Login, User } from "@app/shared";

export const tryLogin = async (credentials: Login) => {
  const res = await api.api.auth.login.$post({json: credentials})
  if (res.ok) {
    const result = await res.json()
    setToken(result.access_token)
    return result.user
  }

  const message = await res.json() as { error: string }
  throw new Error(message.error)
}

export const tryLogout = async () => {
  const res = await api.api.auth.logout.$post()
  if (res.ok) {
    setToken(null)
  }
}

export const getMe = async () => {
  const res = await api.api.auth.me.$get()
  if (res.ok) {
    const result = await res.json()
    return result.user as User
  }

  return null
}