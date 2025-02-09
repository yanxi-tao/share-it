/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'
import App from '~/app.tsx'
import Auth from '~/pages/auth'
import Dashboard from '~/pages/dashboard'

import { Route, Router } from '@solidjs/router'

const root = document.getElementById('root')

render(
  () => (
    <Router root={(props) => <App>{props.children}</App>}>
      <Route path={['/auth/login', '/auth/register']} component={Auth} />
      <Route path="/dashboard" component={Dashboard} />
    </Router>
  ),
  root!
)
