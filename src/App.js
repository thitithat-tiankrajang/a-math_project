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
  const [rack, setRack] = useState(Array(8).fill('21'));
  const [nullCount, setNullCount] = useState(8);
  const [boardState, setBoardState] = useState(
    Array.from({ length: 15 }, () => Array(15).fill('21'))
  );
  const [selectedTileInRack, setSelectedTileInRack] = useState(null);
  const [selectedTileInBoard, setSelectedTileInBoard] = useState(null);

  function selectTileFromBoard(rowIndex, colIndex) {
    if (boardState[rowIndex][colIndex] !== '21') {
      setSelectedTileInBoard({ tile: boardState[rowIndex][colIndex], rowIndex, colIndex }); // เก็บข้อมูล tile
      setSelectedTileInRack(null);
    }
  }

  // เลือก tile จาก rack
  function onRackClick(index) {
    if (selectedTileInRack) {
      setRack(prevRack => {
        const newRack = [...prevRack];
        [newRack[selectedTileInRack.index], newRack[index]] = [newRack[index], newRack[selectedTileInRack.index]];
        setSelectedTileInRack(null);
        return newRack;
      });
    }
    else if (selectedTileInBoard) {
      setBoardState(prevBoard => {
        const newBoard = [...prevBoard];
        newBoard[selectedTileInBoard.rowIndex][selectedTileInBoard.colIndex] = rack[index];
        return newBoard;
      });
      setRack(prevRack => {
        const newRack = [...prevRack];
        newRack[index] = selectedTileInBoard.tile;
        setSelectedTileInBoard(null);
        return newRack;
      });
    }
    else {
      if (rack[index] !== '21') {
        setSelectedTileInRack({ tile: rack[index], index }); // เก็บข้อมูล tile
        setSelectedTileInBoard(null);
      }
    }
  }

  function onBoardClick(row, col) {
    if (selectedTileInRack) {
      setBoardState(prevBoard => {
        const newBoard = [...prevBoard];
        if (newBoard[row][col] === '21') { // วางได้เฉพาะช่องว่าง

          newBoard[row][col] = selectedTileInRack.tile;
          // ลบ tile จาก rack
          setRack(prevRack => {
            const newRack = [...prevRack];
            newRack[selectedTileInRack.index] = '21';
            return newRack;
          });

          setSelectedTileInRack(null); // ล้าง selected tile
        } else {
          setRack(prevRack => {
            const newRack = [...prevRack];
            newRack[selectedTileInRack.index] = boardState[row][col];
            return newRack;
          });

          setBoardState(prevBoard => {
            const newBoard = [...prevBoard];
            newBoard[row][col] = selectedTileInRack.tile;
            return newBoard;
          });

          setSelectedTileInRack(null);
        }
        return newBoard;
      });
    }  
    else {
        if (selectedTileInBoard) {
          setBoardState(prevBoard => {
            const newBoard = [...prevBoard];
            [newBoard[row][col], newBoard[selectedTileInBoard.rowIndex][selectedTileInBoard.colIndex]] 
            = [newBoard[selectedTileInBoard.rowIndex][selectedTileInBoard.colIndex], newBoard[row][col]];
            setSelectedTileInBoard(null); // ล้าง selected tile

            return newBoard;
          });
        } else {
          selectTileFromBoard(row, col);
        }
    }
  }

  function addToRack(tiles) {
    tiles.forEach(tile => {
      setRack(prevRack => {
        const emptyIndex = prevRack.findIndex(cell => cell === '21');
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
      <section className='app-section'>
        <AppHeader />
        <div className="app-container">
          <section className="lefths">
            <AppBoard
              board={board}
              boardState={boardState}
              onCellClick={onBoardClick}
              selectedTileInBoard={selectedTileInBoard}
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
                onTileClick={onRackClick} // ส่งฟังก์ชันเลือก tile
                selectedTileInRack={selectedTileInRack} // ส่ง selectedTileInRack เพื่อใช้ใน CSS
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