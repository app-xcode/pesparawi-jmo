import MapView from "./components/MapView"
import { useState } from "react"

function App() {
  const [refresh, setRefresh] = useState(false)
  return (
    <div className="relative">
      <MapView key={refresh} setRefresh={setRefresh} refresh={refresh} />
    </div>
  )
}

export default App