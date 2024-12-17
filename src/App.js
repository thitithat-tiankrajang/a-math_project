import { useState } from "react";
import "./App.css";
import AppHeader from "./components/AppHeader.js";
import AppBoard from "./components/AppBoard.js";
import AppRack from "./components/AppRack.js";
import AppBag from "./components/AppBag.js";
import AppScore from "./components/AppScore.js";
import board from "./data/board.js";
import tileDistribution from "./data/tileDistribution.js";
import AppExchange from "./components/AppExchange.js";
import AppSubmit from "./components/AppSubmit.js";
import AppPass from "./components/AppPass.js";

function App() {
  const [firstTern, setFirstTern] = useState(true);
  const [rack, setRack] = useState(
    Array(8).fill({ name: "empty-cell", point: null })
  );

  const [nullCount, setNullCount] = useState(8);
  const [boardState, setBoardState] = useState(
    Array.from({ length: 15 }, () =>
      Array(15).fill({ data: { name: "empty-cell", point: null }, lock: false })
    )
  );

  const [selectedTileInRack, setSelectedTileInRack] = useState({
    name: "empty-cell",
    point: null,
    idx: null,
  });

  const [selectedTileInBoard, setSelectedTileInBoard] = useState({
    name: "empty-cell",
    point: null,
    rowIdx: null,
    colIdx: null,
  });

  const [openBag, setOpenBag] = useState(false);

  const [tileInBoardByTern, setTileInBoardByTern] = useState([]);

  const startTileBag = [];
  for (const [tile, data] of Object.entries(tileDistribution)) {
    for (let i = 0; i < data.count; i++) {
      startTileBag.push({ name: tile, point: data.point }); // เก็บเป็นวัตถุ
    }
  }

  const [tileBag, setTileBag] = useState(randomTileBag(startTileBag));

  function randomTileBag(tiles) {
    // สุ่มลำดับของ tiles ด้วย Fisher-Yates Shuffle
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }

    // แบ่ง tiles เป็นกลุ่ม ๆ (เช่น 10 ชุด ๆ ละ 10 ตัว)
    const tileBag = [];
    for (let i = 0; i < 10; i++) {
      tileBag.push(tiles.slice(i * 10, (i + 1) * 10));
    }

    return tileBag;
  };

  // เลือก tile จาก rack
  function onRackClick(index) {
    if (selectedTileInRack.name !== "empty-cell") {
      setRack((prevRack) => {
        const newRack = [...prevRack];
        [newRack[selectedTileInRack.idx], newRack[index]] = [
          newRack[index],
          newRack[selectedTileInRack.idx],
        ];
        setSelectedTileInRack({ name: "empty-cell", point: null, idx: null });
        return newRack;
      });
    } else if (selectedTileInBoard.name !== "empty-cell") {
      setBoardState((prevBoard) => {
        const newBoard = [...prevBoard];
        newBoard[selectedTileInBoard.rowIdx][selectedTileInBoard.colIdx] = {
          data: { name: rack[index].name, point: rack[index].point },
          lock: false,
        };
        return newBoard;
      });

      setRack((prevRack) => {
        const newRack = [...prevRack];
        newRack[index] = {
          name: selectedTileInBoard.name,
          point: selectedTileInBoard.point,
        };

        setSelectedTileInBoard({
          name: "empty-cell",
          point: null,
          rowIdx: null,
          colIdx: null,
        });
        return newRack;
      });

      setTileInBoardByTern((prevTiles) => {
        const newSetTile = [...prevTiles];
        newSetTile.filter(
          (tile) =>
            !(
              tile.rowIdx === selectedTileInBoard.rowIdx &&
              tile.colIdx === selectedTileInBoard.colIdx
            )
        );
        return newSetTile;
      });
    } else {
      if (rack[index].name !== "empty-cell") {
        setSelectedTileInRack({
          name: rack[index].name,
          point: rack[index].point,
          idx: index,
        }); // เก็บข้อมูล tile
        setSelectedTileInBoard({
          name: "empty-cell",
          point: null,
          rowIdx: null,
          colIdx: null,
        });
      }
    }
  }

  function onBoardClick(row, col) {
    if (boardState[row][col].lock) {
      return;
    }
    if (selectedTileInRack.name !== "empty-cell") {
      setBoardState((prevBoard) => {
        const newBoard = [...prevBoard];
        if (newBoard[row][col].data.name === "empty-cell") {
          // วางได้เฉพาะช่องว่าง
          newBoard[row][col] = {
            data: {
              name: selectedTileInRack.name,
              point: selectedTileInRack.point,
            },
            lock: false,
          };

          // เพิ่มข้อมูลลงใน tileInBoardByTern
          setTileInBoardByTern((prevTiles) => [
            ...prevTiles,
            { rowIdx: row, colIdx: col },
          ]);

          // ลบ tile จาก rack
          setRack((prevRack) => {
            const newRack = [...prevRack];
            newRack[selectedTileInRack.idx] = {
              name: "empty-cell",
              point: null,
            };
            return newRack;
          });

          setSelectedTileInRack({ name: "empty-cell", point: null, idx: null }); // ล้าง selected tile
        } else {
          // ย้ายเบี้ยจาก rack ไปแทนที่เบี้ยในกระดาน
          setRack((prevRack) => {
            const newRack = [...prevRack];
            newRack[selectedTileInRack.idx] = boardState[row][col].data;
            return newRack;
          });

          setBoardState((prevBoard) => {
            const newBoard = [...prevBoard];
            newBoard[row][col] = {
              data: {
                name: selectedTileInRack.name,
                point: selectedTileInRack.point,
              },
              lock: false,
            };

            // อัปเดตตำแหน่งใน tileInBoardByTern
            setTileInBoardByTern((prevTiles) => {
              return prevTiles.map((tile) =>
                tile.rowIdx === row && tile.colIdx === col
                  ? { rowIdx: row, colIdx: col }
                  : tile
              );
            });

            return newBoard;
          });

          setSelectedTileInRack({ name: "empty-cell", point: null, idx: null });
        }
        return newBoard;
      });
    } else if (selectedTileInBoard.name !== "empty-cell") {
      setBoardState((prevBoard) => {
        const newBoard = [...prevBoard];
        [
          newBoard[row][col],
          newBoard[selectedTileInBoard.rowIdx][selectedTileInBoard.colIdx],
        ] = [
          newBoard[selectedTileInBoard.rowIdx][selectedTileInBoard.colIdx],
          newBoard[row][col],
        ];

        // อัปเดตตำแหน่งใน tileInBoardByTern
        setTileInBoardByTern((prevTiles) => {
          return prevTiles.map((tile) =>
            tile.rowIdx === selectedTileInBoard.rowIdx &&
            tile.colIdx === selectedTileInBoard.colIdx
              ? { rowIdx: row, colIdx: col }
              : tile
          );
        });

        setSelectedTileInBoard({
          name: "empty-cell",
          point: null,
          rowIdx: null,
          colIdx: null,
        }); // ล้าง selected tile
        return newBoard;
      });
    } else {
      if (boardState[row][col].data.name !== "empty-cell") {
        setSelectedTileInBoard({
          name: boardState[row][col].data.name,
          point: boardState[row][col].data.point,
          rowIdx: row,
          colIdx: col,
        }); // เก็บข้อมูล tile
        setSelectedTileInRack({ name: "empty-cell", point: null, idx: null });
      }
    }
  }

  function addToRack(tiles) {
    tiles.forEach((tile) => {
      setRack((prevRack) => {
        const emptyIndex = prevRack.findIndex(
          (cell) => cell.name === "empty-cell"
        );
        if (emptyIndex !== -1) {
          const newRack = [...prevRack];
          newRack[emptyIndex] = tile;
          return newRack;
        }
        return prevRack;
      });
    });
  }

  function isValidEquation(equation) {
    // ฟังก์ชันตรวจสอบความถูกต้องของสมการ

    // แปลงเครื่องหมายพิเศษ
    function normalizeOperators(arr) {
      return arr.map((item) => {
        if (item === "×") return "*";
        if (item === "÷") return "/";
        if (item === "−") return "-";
        return item;
      });
    }

    // ฟังก์ชันแปลง array เป็นสตริงสมการ
    function arrayToEquation(arr) {
      return arr
        .map((item) => (typeof item === "number" ? item.toString() : item))
        .join("");
    }

    // ฟังก์ชันตรวจสอบกฎข้อที่ 1 เกี่ยวกับการเรียงตัวเลข
    function checkNumberRules(arr) {
      const equationStr = arrayToEquation(arr);

      // ตรวจสอบเลขนำหน้าด้วย 0
      if (/\b0\d/.test(equationStr)) return false;

      // ตรวจสอบเลขหลายหลัก
      const numberMatches = equationStr.match(/\d+/g) || [];
      for (let num of numberMatches) {
        // ไม่เกิน 3 หลัก
        if (num.length > 3) return false;

        // ตรวจสอบเลข 10-20 ไม่สามารถติดกับเลขอื่นได้
        if (/1[0-9]|20/.test(num)) {
          const index = equationStr.indexOf(num);
          if (index > 0 && /\d/.test(equationStr[index - 1])) return false;
          if (
            index < equationStr.length - num.length &&
            /\d/.test(equationStr[index + num.length])
          )
            return false;
        }
      }
      return true;
    }

    // ฟังก์ชันประมวลผลสมการ
    function evaluateEquation(equation) {
      // แยกส่วนด้วย =
      const parts = equation.split("=");

      // คำนวณแต่ละส่วน
      const evaluatedParts = parts.map((part) => {
        // คำนวณคูณ/หาร ก่อน
        part = part.replace(
          /(\d+)\s*[*/]\s*(\d+)/g,
          (match, a, b, offset, fullString) => {
            const operator = match.includes("*") ? "*" : "/";
            return operator === "*"
              ? parseInt(a) * parseInt(b)
              : parseInt(a) / parseInt(b);
          }
        );

        // คำนวณบวก/ลบ
        return eval(part);
      });

      // ตรวจสอบว่าทุกส่วนเท่ากัน
      return evaluatedParts.every((val) => val === evaluatedParts[0]);
    }

    // ตรวจสอบเงื่อนไข
    function validateEquation(arr) {
      // นอร์มอไลซ์เครื่องหมาย
      arr = normalizeOperators(arr);

      // ตรวจสอบว่ามี = อย่างน้อย 1 ตัว
      if (!arr.includes("=")) return false;

      // ตรวจสอบกฎการเรียงตัวเลข
      if (!checkNumberRules(arr)) return false;

      // แปลง array เป็นสตริง
      const equationStr = arrayToEquation(arr);

      // ตรวจสอบการประเมินสมการ
      return evaluateEquation(equationStr);
    }

    return validateEquation(equation);
  }

  // ตัวอย่างการใช้งาน
  const testCases = [
    [7, "−", 5, "=", 3, "−", 1, "=", 6, "÷", 3], // ถูกต้อง
    [7, "−", 5, "=", 6, "−", 4, "=", 3, "+", 1], // ถูกต้อง
    [2, "=", 2, "=", 4], // ไม่ถูกต้อง
    [5, "×", 3, "+", 2, "=", 17], // ทดสอบการคูณ
    [1, 0, 8, "÷", 2, "+", 3, "=", 5, 7], // ทดสอบการหาร
    [0, 5, 8, "+", 3], // ทดสอบเลขนำหน้าด้วย 0
  ];

  // testCases.forEach((testCase, index) => {
  //   console.log(
  //     `Test Case ${index + 1}: ${testCase} - ${isValidEquation(testCase)}`
  //   );
  // });

  function onSubmitClick() {
    if (firstTern && boardState[7][7].data.name === "empty-cell") {
      alert("wrong");
      return;
    }
    if (nullCount !== 0) {
      return;
    }

    console.log(tileInBoardByTern);
    let checkRow = true,
      checkCol = true,
      firstRow = null,
      firstCol = null;
    if (tileInBoardByTern.length === 0) {
      alert("wrong");
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
        for (
          let i = sortedArr[0].colIdx;
          i <= sortedArr[sortedArr.length - 1].colIdx;
          i++
        ) {
          if (boardState[firstRow][i].data.name === "empty-cell") {
            inline = false;
          }
        }
        if (inline) {
          console.log("correct");
          setBoardState((prevBoard) => {
            const newBoard = [...prevBoard];
            for (let i = 0; i < tileInBoardByTern.length; i++) {
              newBoard[tileInBoardByTern[i].rowIdx][
                tileInBoardByTern[i].colIdx
              ].lock = true;
            }
            return newBoard;
          });
        } else {
          alert("wrong");
        }
      } else {
        sortedArr = [...tileInBoardByTern].sort((a, b) => a.rowIdx - b.rowIdx);
        for (
          let i = sortedArr[0].rowIdx;
          i <= sortedArr[sortedArr.length - 1].rowIdx;
          i++
        ) {
          if (boardState[i][firstCol].data.name === "empty-cell") {
            inline = false;
          }
        }
        if (inline) {
          console.log("correct");
          setBoardState((prevBoard) => {
            const newBoard = [...prevBoard];
            for (let i = 0; i < tileInBoardByTern.length; i++) {
              newBoard[tileInBoardByTern[i].rowIdx][
                tileInBoardByTern[i].colIdx
              ].lock = true;
            }
            return newBoard;
          });
        } else {
          alert("wrong");
        }
      }
      console.log(sortedArr);
    }
    if (firstTern) {
      setFirstTern(false);
    }
    setNullCount(tileInBoardByTern.length);
    setTileInBoardByTern([]);
  }

  return (
    <div className="App">
      <section className="app-section">
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
                tileBag={tileBag}
                setTileBag={setTileBag}
                nullCount={nullCount}
                setNullCount={setNullCount}
                openBag={openBag}
                setOpenBag={setOpenBag}
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
                  onSubmitClick={onSubmitClick}
                />
                <AppExchange
                  onTileClick={addToRack}
                  tileBag={tileBag}
                  setTileBag={setTileBag}
                  rack={rack}
                  setRack={setRack}
                  openBag={openBag}
                  setOpenBag={setOpenBag}
                  nullCount={nullCount}
                  setNullCount={setNullCount}
                  randomTileBag={randomTileBag}
                />
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
