import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [backendData, setBackendData] = useState([{}])
  
  useEffect(() => {
    fetch(`/api`).then(res => { return res.json() }).then(data => { setBackendData(data) })
  }, [])

  return (
    <div className="App">
      {
        (typeof backendData.data === `undefined`) ?
        (<p>Loading Data...</p>) :
        (<div>
          <blockquote>{backendData.data.quote}</blockquote>
          <blockquote>- {backendData.data.author}</blockquote>
        </div>)
      }
    </div>
  );
}

export default App;
