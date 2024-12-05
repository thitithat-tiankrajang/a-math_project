import React from "react";
import "./AppBoard.css";

const AppBoard = ({ board, boardState, onPlaceTile }) => {

  const createElementInCell = (rowIndex, cellIndex) => {
    if (boardState[rowIndex][cellIndex] === null) {
      return (
        board[rowIndex][cellIndex] === "str" ? ( <img src="./star-image.png" alt="Star" className="str-image" />) 
          : board[rowIndex][cellIndex] === "Px1" ? "" : board[rowIndex][cellIndex]
      );
    } else {
      return (
        <div className="tile">
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
              onClick={() => onPlaceTile(rowIndex, cellIndex)}
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
