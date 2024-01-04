import '../App.css'
import React, { useEffect } from 'react' 

function About() {
  useEffect(() => {
    document.title = `About Baru Project`
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <p>We are a dead group of developers. 🪦</p>
      </header>
    </div>
  )
}

export default About