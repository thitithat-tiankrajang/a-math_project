import React from "react";
import "./AppBoard.css";

const AppBoard = ({ board, boardState, onCellClick, selectedTileInBoard}) => {

  function getNameFromClass(s) {
    switch (s) {
      case 'Px1': return "";
      case 'Px2': return "2xP";
      case 'Px3': return "3xP";
      case 'Ex2': return "2xE";
      case 'Ex3': return "3xE";
      default: break;
    }
  }
  const createElementInCell = (rowIndex, cellIndex) => {
    if (boardState[rowIndex][cellIndex].data.name === '21') {
      return (
        board[rowIndex][cellIndex] === "str" ? ( <img src="./star-image.png" alt="Star" className="str-image" />) 
          : getNameFromClass(board[rowIndex][cellIndex])
      );
    } else {
      return (
        <div 
          className={`tile 
            ${(selectedTileInBoard?.rowIdx === rowIndex && selectedTileInBoard?.colIdx === cellIndex) 
              ? "selected" : ""}
            ${(boardState[rowIndex][cellIndex].lock) 
              ? "locked" : ""}`}
        >
          <span className="tile-name">{boardState[rowIndex][cellIndex].data.name === '21' ? "" : boardState[rowIndex][cellIndex].data.name}</span>
          <span className="tile-point">{boardState[rowIndex][cellIndex].data.name === '21' ? "" : boardState[rowIndex][cellIndex].data.point}</span>
        </div>
      );
    }
  }

  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div className="row" key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <div
              className={`cell ${cell}`}
              onClick={() => onCellClick(rowIndex, cellIndex)}
            >
              {createElementInCell(rowIndex, cellIndex)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AppBoard;
