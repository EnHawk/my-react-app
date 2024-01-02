import './App.css';
import { Route, Routes } from 'react-router-dom'
import About from './pages/About.js'
import Home from './pages/Home.js'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;
