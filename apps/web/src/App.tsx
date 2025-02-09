import { createResource, createSignal, Suspense, Switch, Match } from 'solid-js'
import solidLogo from './assets/solid.svg'
import viteLogo from '/vite.svg'
import './App.css'

const apiUrl = import.meta.env.VITE_API_URL

const fetchTeat = async () => {
  console.log('apiUrl', apiUrl)

  const response = await fetch(`${apiUrl}/`)
  return response.text()
}

function App() {
  const [count, setCount] = createSignal(0)
  const [test] = createResource(fetchTeat)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={solidLogo} class="logo solid" alt="Solid logo" />
        </a>
      </div>
      <h1>Vite + Solid</h1>
      <div class="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count()}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <h3>Server Data</h3>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Match when={test.error}>
            <span>Error: {test.error.message}</span>
          </Match>
          <Match when={test()}>
            <div>{JSON.stringify(test())}</div>
          </Match>
        </Switch>
      </Suspense>
      <p class="read-the-docs">
        Click on the Vite and Solid logos to learn more
      </p>
    </>
  )
}

export default App
