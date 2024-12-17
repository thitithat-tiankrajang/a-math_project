import React from "react";
import "./style/AppBoard.css";

function AppBoard(props) {
  const {
    board,
    setRack,
    boardState,
    setBoardState,
    selectedTileInRack,
    setSelectedTileInRack,
    selectedTileInBoard,
    setSelectedTileInBoard,
    setTileInBoardByTern,
  } = props;

  function getNameFromClass(s) {
    switch (s) {
      case "Px1":
        return "";
      case "Px2":
        return "2xP";
      case "Px3":
        return "3xP";
      case "Ex2":
        return "2xE";
      case "Ex3":
        return "3xE";
      default:
        break;
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

  const createElementInCell = (rowIndex, cellIndex) => {
    if (boardState[rowIndex][cellIndex].data.name === "empty-cell") {
      return board[rowIndex][cellIndex] === "str" ? (
        <img src="./star-image.png" alt="Star" className="str-image" />
      ) : (
        getNameFromClass(board[rowIndex][cellIndex])
      );
    } else {
      return (
        <div
          className={`tile 
            ${
              selectedTileInBoard?.rowIdx === rowIndex &&
              selectedTileInBoard?.colIdx === cellIndex
                ? "selected"
                : ""
            }
            ${boardState[rowIndex][cellIndex].lock ? "locked" : ""}`}
        >
          <span className="tile-name">
            {boardState[rowIndex][cellIndex].data.name === "empty-cell"
              ? ""
              : boardState[rowIndex][cellIndex].data.name}
          </span>
          <span className="tile-point">
            {boardState[rowIndex][cellIndex].data.name === "empty-cell"
              ? ""
              : boardState[rowIndex][cellIndex].data.point}
          </span>
        </div>
      );
    }
  };

  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div className="row" key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <div
              className={`cell ${cell}`}
              onClick={() => onBoardClick(rowIndex, cellIndex)}
            >
              {createElementInCell(rowIndex, cellIndex)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default AppBoard;
