import {api, setToken} from "./api";
import {Login} from "@venture-pastoralia/shared";


export const tryLogin = async (credentials: Login) => {
  const res = await api.api.auth.login.$post({json: credentials})
  if (res.ok) {
    const result = await res.json()
    setToken(result.access_token)
    return result.user
  }

  const result = await res.json() as { error: string }
  throw result.error
}
