import { createAuthClient } from 'better-auth/solid'

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL, // the base url of your auth server
})
