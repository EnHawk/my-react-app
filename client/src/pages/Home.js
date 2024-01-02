import '../App.css'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Welcome To A React Based Application! 👋</p>
        <br />
        <p>Links</p>
        <ul>
          <li>
            <Link to="/about" target="_blank">About Page</Link>
          </li>
        </ul>
      </header>
    </div>
  )
}

export default Home