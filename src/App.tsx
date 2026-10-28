import { GameProvider, useGame } from './game/store'
import Shell from './components/Shell'
import Home from './screens/Home'
import Battle from './screens/Battle'
import Inventory from './screens/Inventory'
import Tower from './screens/Tower'
import League from './screens/League'

function Screens() {
  const { screen } = useGame()
  return (
    <div key={screen} className="animate-fade-up">
      {screen === 'home' && <Home />}
      {screen === 'battle' && <Battle />}
      {screen === 'inventory' && <Inventory />}
      {screen === 'tower' && <Tower />}
      {screen === 'league' && <League />}
    </div>
  )
}

export default function App() {
  return (
    <GameProvider>
      <Shell>
        <Screens />
      </Shell>
    </GameProvider>
  )
}
