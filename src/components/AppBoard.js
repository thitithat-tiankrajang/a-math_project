import React from "react";
import "./AppBoard.css";

const AppBoard = ({ board, boardState, onCellClick, selectedTileInBoard}) => {

  const createElementInCell = (rowIndex, cellIndex) => {
    if (boardState[rowIndex][cellIndex] === '21') {
      return (
        board[rowIndex][cellIndex] === "str" ? ( <img src="./star-image.png" alt="Star" className="str-image" />) 
          : board[rowIndex][cellIndex] === "Px1" ? "" : board[rowIndex][cellIndex]
      );
    } else {
      return (
        <div 
          className={`tile
            ${(selectedTileInBoard?.rowIndex === rowIndex && selectedTileInBoard?.colIndex === cellIndex) ? 
              "selected" : ""}`}
        >
          {boardState[rowIndex][cellIndex]}
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
