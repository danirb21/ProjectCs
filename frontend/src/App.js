/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/
// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TablaRankings from './components/TablaRankings';
import TeamDetails from './components/team-details';

function App() {
  return (
    <Router>
      <div style={{ maxWidth: '800px', margin: 'auto' }}>
        <h1>Ranking de Equipos</h1>
        <Routes>
          <Route path="/" element={<TablaRankings />} />
          <Route path="/team-details" element={<TeamDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

