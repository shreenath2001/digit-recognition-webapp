import React from 'react';
import './App.css';
import Draw from './components/draw';

function App() {
  return (
    <div className="App">
      <h1>Digit Recognition App</h1>
      <p className = "instruct mt-0">(Draw any digit between 0 to 9)</p>
      <Draw />
    </div>
  );
}

export default App;
