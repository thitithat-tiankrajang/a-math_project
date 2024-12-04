import { useState } from "react";
import './App.css';
import AppHeader from './components/AppHeader';
import AppBoard from './components/AppBoard';
import AppRack from './components/AppRack';
import AppBag from './components/AppBag';
import AppScore from "./components/AppScore";
import board from './data/board';
import tileDistribution from './data/tileDistribution';

export default function App() {
  const [rack, setRack] = useState(Array(8).fill(null));
  const [nullCount, setNullCount] = useState(8);

  function addToRack(tiles) {
    tiles.forEach(tile => {
      setRack(prevRack => {
        const emptyIndex = prevRack.findIndex(cell => cell === null);
        if (emptyIndex !== -1) {
          const newRack = [...prevRack];
          newRack[emptyIndex] = tile;
          return newRack;
        }
        return prevRack;
      });
    });
  }

  return (
    <div className="App">
      <AppHeader />
      <section className='app-section'>
        <div className="app-container">
          <section className="lefths">
            <AppBoard
              board={board}
            />
          </section>
          <section className="righths">
            <section className="top-section">
              <AppScore />
            </section>
            <section className="center-section">
              <AppBag
                onTileClick={addToRack}
                tileDistribution={tileDistribution}
                nullCount={nullCount}
                setNullCount={setNullCount}
              />
            </section>
            <section className="bottom-section">
              <AppRack
                rack={rack}
              />
              <div className="action">
                <button className="submit-button"> SUBMIT </button>
                <button className="exchange-button"> EXCHANGE </button>
                <button className="pass-button"> PASS </button>
              </div>
            </section>
          </section>
        </div>
      </section>
    </div>
  );
}
