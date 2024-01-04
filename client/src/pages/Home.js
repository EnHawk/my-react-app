import '../App.css'
import React, { useEffect } from 'react'

function Home() {
  useEffect(() => {
    document.title = `Baru Project`
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        Dino asem celek 😂
      </header>
    </div>
  )
}

export default Home