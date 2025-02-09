import { useLocation } from '@solidjs/router'

export default function Auth() {
  const location = useLocation()
  const mode = location.pathname.split('/').pop()
  return (
    <div>
      <h1>Auth</h1>
      <h2>Mode: {mode}</h2>
    </div>
  )
}
