import { useState } from "react";
import './App.css';
import AppHeader from './components/AppHeader.js';
import AppBoard from './components/AppBoard.js';
import AppRack from './components/AppRack.js';
import AppBag from './components/AppBag.js';
import AppScore from "./components/AppScore.js";
import board from './data/board.js';
import tileDistribution from './data/tileDistribution.js';

function App() {
  const [rack, setRack] = useState(Array(8).fill(null));
  const [nullCount, setNullCount] = useState(8);
  const [boardState, setBoardState] = useState(board.map(row => [...row])); // Clone of initial board state
  const [selectedTile, setSelectedTile] = useState(null); // Track selected tile

  // เลือก tile จาก rack
  function selectTileFromRack(index) {
  if (rack[index] !== null) {
    console.log("Selected tile:", rack[index], "at index", index);
    setSelectedTile({ tile: rack[index], index }); // เก็บข้อมูล tile
  }
}


  function placeTileOnBoard(row, col) {
    if (selectedTile) {
      setBoardState(prevBoard => {
        const newBoard = [...prevBoard];
        let boolOfBoard = (newBoard[row][col] === 'Px1' || newBoard[row][col] === 'Px2' || newBoard[row][col] === 'Px3'
          || newBoard[row][col] === 'Ex2' || newBoard[row][col] === 'Ex3'
        );
        if (boolOfBoard) { // วางได้เฉพาะช่องว่าง
          newBoard[row][col] = selectedTile.tile;

          // ลบ tile จาก rack
          const newRack = [...rack]; // ใช้ rack ปัจจุบัน (ไม่ใช้ prevRack)
          newRack[selectedTile.index] = null;
          setRack(newRack); // อัปเดต rack ทันที
          setSelectedTile(null); // ล้าง selected tile
        }
        return newBoard;
      });
    }
  }

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
              board={boardState}
              onPlaceTile={placeTileOnBoard}
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
                onTileClick={selectTileFromRack} // ส่งฟังก์ชันเลือก tile
                selectedTile={selectedTile} // ส่ง selectedTile เพื่อใช้ใน CSS
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

export default App;