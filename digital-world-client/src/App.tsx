import { ThemeProvider } from './components/ThemeProvider/ThemeProvider'
import useRouteElements from './useRouteElements'

function App() {
  const routeElements = useRouteElements()

  return <>{routeElements}</>
}

export default App
