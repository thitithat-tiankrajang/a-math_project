import { useState, useEffect } from "react";
import './App.css';
import AppHeader from './components/AppHeader.js';
import AppBoard from './components/AppBoard.js';
import AppRack from './components/AppRack.js';
import AppBag from './components/AppBag.js';
import AppScore from "./components/AppScore.js";
import board from './data/board.js';
import tileDistribution from './data/tileDistribution.js';
import AppExchange from "./components/AppExchange.js";
import AppSubmit from "./components/AppSubmit.js";
import AppPass from "./components/AppPass.js";

function App() {
  const [rack, setRack] = useState(Array(8).fill({name: 'empty-cell', point: null}));
  const [nullCount, setNullCount] = useState(8);
  const [boardState, setBoardState] = useState(
    Array.from({ length: 15 }, () => Array(15).fill({data: {name: 'empty-cell', point: null}, lock: false}))
  );
  const [selectedTileInRack, setSelectedTileInRack] = useState({name: 'empty-cell', point: null, idx: null});
  const [selectedTileInBoard, setSelectedTileInBoard] = useState({name: 'empty-cell', point: null, rowIdx: null, colIdx: null});
  const [tileInBoardByTern, setTileInBoardByTern] = useState([]);

  function selectTileFromBoard(row, col) {
    if (boardState[row][col].data.name !== 'empty-cell') {
      setSelectedTileInBoard({ name: boardState[row][col].data.name, point: boardState[row][col].data.point, rowIdx: row, colIdx: col }); // เก็บข้อมูล tile
      setSelectedTileInRack({name: 'empty-cell', point: null, idx: null});
    }
  }

  // เลือก tile จาก rack
  function onRackClick(index) {
    if (selectedTileInRack.name !== 'empty-cell') {
      setRack(prevRack => {
        const newRack = [...prevRack];
        [newRack[selectedTileInRack.idx], newRack[index]] = [newRack[index], newRack[selectedTileInRack.idx]];
        setSelectedTileInRack({ name: 'empty-cell', point: null, idx: null });
        return newRack;
      });
    } else if (selectedTileInBoard.name !== 'empty-cell') {

      setBoardState(prevBoard => {
        const newBoard = [...prevBoard];
        newBoard[selectedTileInBoard.rowIdx][selectedTileInBoard.colIdx] 
        = {data: {name: rack[index].name, point: rack[index].point}, lock: false};
        return newBoard;
      });

      setRack(prevRack => {
        const newRack = [...prevRack];
        newRack[index] = { name: selectedTileInBoard.name, point: selectedTileInBoard.point };
  
        // ลบตำแหน่งเบี้ยออกจาก tileInBoardByTern
        setTileInBoardByTern(prevTiles =>
          prevTiles.filter(
            tile =>
              !(tile.rowIdx === selectedTileInBoard.rowIdx && tile.colIdx === selectedTileInBoard.colIdx)
          )
        );
  
        setSelectedTileInBoard({ name: 'empty-cell', point: null, rowIdx: null, colIdx: null });
        return newRack;
      });
    } else {
      if (rack[index].name !== 'empty-cell') {
        setSelectedTileInRack({ name: rack[index].name, point: rack[index].point, idx: index }); // เก็บข้อมูล tile
        setSelectedTileInBoard({ name: 'empty-cell', point: null, rowIdx: null, colIdx: null });
      }
    }
  }

  function onBoardClick(row, col) {
    if (selectedTileInRack.name !== 'empty-cell') {
      setBoardState(prevBoard => {
        const newBoard = [...prevBoard];
        if (newBoard[row][col].data.name === 'empty-cell') { // วางได้เฉพาะช่องว่าง
          newBoard[row][col] = {data: { name: selectedTileInRack.name, point: selectedTileInRack.point }, lock: false};
  
          // เพิ่มข้อมูลลงใน tileInBoardByTern
          setTileInBoardByTern(prevTiles => [...prevTiles, { rowIdx: row, colIdx: col }]);
  
          // ลบ tile จาก rack
          setRack(prevRack => {
            const newRack = [...prevRack];
            newRack[selectedTileInRack.idx] = { name: 'empty-cell', point: null };
            return newRack;
          });
  
          setSelectedTileInRack({ name: 'empty-cell', point: null, idx: null }); // ล้าง selected tile
        } else {
          // ย้ายเบี้ยจาก rack ไปแทนที่เบี้ยในกระดาน
          setRack(prevRack => {
            const newRack = [...prevRack];
            newRack[selectedTileInRack.idx] = boardState[row][col].data;
            return newRack;
          });
  
          setBoardState(prevBoard => {
            const newBoard = [...prevBoard];
            newBoard[row][col] = {data: { name: selectedTileInRack.name, point: selectedTileInRack.point }, lock: false};
  
            // อัปเดตตำแหน่งใน tileInBoardByTern
            setTileInBoardByTern(prevTiles => {
              return prevTiles.map(tile =>
                tile.rowIdx === row && tile.colIdx === col
                  ? { rowIdx: row, colIdx: col }
                  : tile
              );
            });
  
            return newBoard;
          });
  
          setSelectedTileInRack({ name: 'empty-cell', point: null, idx: null });
        }
        return newBoard;
      });
    } else if (selectedTileInBoard.name !== 'empty-cell') {
      setBoardState(prevBoard => {
        const newBoard = [...prevBoard];
        [newBoard[row][col], newBoard[selectedTileInBoard.rowIdx][selectedTileInBoard.colIdx]] =
          [newBoard[selectedTileInBoard.rowIdx][selectedTileInBoard.colIdx], newBoard[row][col]];
  
        // อัปเดตตำแหน่งใน tileInBoardByTern
        setTileInBoardByTern(prevTiles => {
          return prevTiles.map(tile =>
            tile.rowIdx === selectedTileInBoard.rowIdx && tile.colIdx === selectedTileInBoard.colIdx
              ? { rowIdx: row, colIdx: col }
              : tile
          );
        });
  
        setSelectedTileInBoard({ name: 'empty-cell', point: null, rowIdx: null, colIdx: null }); // ล้าง selected tile
        return newBoard;
      });
    } else {
      selectTileFromBoard(row, col);
    }
  }
  

  function addToRack(tiles) {
    tiles.forEach(tile => {
      setRack(prevRack => {
        const emptyIndex = prevRack.findIndex(cell => cell.name === 'empty-cell');
        if (emptyIndex !== -1) {
          const newRack = [...prevRack];
          newRack[emptyIndex] = tile;
          return newRack;
        }
        return prevRack;
      });
    });
  }

  function isEquationValid(arr) {
    let equation = arr.map(item => boardState[item.rowIdx][item.colIdx].name).join('');  // รวม array เป็น string เดียว
    // console.log(equation);
    // let parts = equation.split('=');  // แยก string ตามเครื่องหมาย "="

    // if (parts.length < 2) return false;  // ต้องมีเครื่องหมาย "=" อย่างน้อยหนึ่งตัว

    // for (let i = 0; i < parts.length - 1; i++) {
    //     let leftSide = parts[i].trim();
    //     let rightSide = parts[i + 1].trim();

    //     try {
    //         // คำนวณค่าทั้งสองฝั่งของ "="
    //         let leftValue = new Function('return ' + leftSide)();   
    //         let rightValue = new Function('return ' + rightSide)(); 

    //         if (leftValue !== rightValue) {
    //             return false;  // หากค่าทั้งสองฝั่งไม่เท่ากัน ให้คืนค่า false
    //         }
    //     } catch (error) {
    //         return false;  // หากเกิดข้อผิดพลาดในขณะคำนวณ ให้คืนค่า false
    //     }
    // }
    return true;  // หากทุกอย่างถูกต้อง
  }

  function infixToPostfix() {
    let checkRow = true, checkCol = true, firstRow = null, firstCol = null;
    if (tileInBoardByTern.length === 0) {
      return;
    }

    for (let i = 0; i < tileInBoardByTern.length; i++) {
      if (firstCol === null && firstRow === null) {
        firstRow = tileInBoardByTern[i].rowIdx;
        firstCol = tileInBoardByTern[i].colIdx;
      } else {
        if (firstRow !== tileInBoardByTern[i].rowIdx) {
          checkRow = false;
        }
        if (firstCol !== tileInBoardByTern[i].colIdx) {
          checkCol = false;
        }
      }
    }
    
    if (checkRow || checkCol) {
      let sortedArr = [];
      let inline = true;
      if (checkRow) {
        sortedArr = [...tileInBoardByTern].sort((a, b) => a.colIdx - b.colIdx);
        for (let i = sortedArr[0].colIdx; i <= sortedArr[sortedArr.length - 1].colIdx; i++) {
          if (boardState[firstRow][i].data.name === 'empty-cell') {
            inline = false;
          }
        }
        if (inline && isEquationValid(tileInBoardByTern)) {
          setBoardState(prevBoard => {
            const newBoard = [...prevBoard];
            for (let i = 0; i < tileInBoardByTern.length; i++) {
              newBoard[tileInBoardByTern[i].rowIdx][tileInBoardByTern[i].colIdx].lock = true;
            }
            return newBoard;
          })
        } else {
          console.log("wrong");

        }
      } else {
        sortedArr = [...tileInBoardByTern].sort((a, b) => a.rowIdx - b.rowIdx);
        for (let i = sortedArr[0].rowIdx; i <= sortedArr[sortedArr.length - 1].rowIdx; i++) {
          if (boardState[i][firstCol].data.name === 'empty-cell') {
            inline = false;
          }
        }
        if (inline) {
          console.log("correct");
          setBoardState(prevBoard => {
            const newBoard = [...prevBoard];
            for (let i = 0; i < tileInBoardByTern.length; i++) {
              newBoard[tileInBoardByTern[i].rowIdx][tileInBoardByTern[i].colIdx].lock = true;
            }
            return newBoard;
          })

        } else {
          alert("wrong");
        }
      }
      console.log(sortedArr);
    }
    setNullCount(tileInBoardByTern.length);
    setTileInBoardByTern([]);
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
                <AppSubmit 
                  boardState={boardState}
                  onSubmitClick={infixToPostfix}
                />
                <AppExchange />
                <AppPass />
              </div>
            </section>
          </section>
        </div>
      </section>
    </div>
  );
}

export default App;