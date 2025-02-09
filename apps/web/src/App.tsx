import { createResource, Suspense, Switch, Match, JSX } from 'solid-js'

const apiUrl = import.meta.env.VITE_API_URL

const fetchTeat = async () => {
  console.log('apiUrl', apiUrl)

  const response = await fetch(`${apiUrl}/`)
  return response.text()
}

export default function App(props: { children: JSX.Element }) {
  const [test] = createResource(fetchTeat)

  return (
    <div>
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
      <hr />
      {props.children}
    </div>
  )
}
