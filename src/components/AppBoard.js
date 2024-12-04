import React from "react";
import "./AppBoard.css";

const AppBoard = (props) => {
    const { board } = props;
    const getClassForCell = (cell) => {
        switch (cell) {
            case "Px1":
                return "gray-cell";
            case "Px2":
                return "orange-cell";
            case "Px3":
                return "blue-cell";
            case "Ex2":
                return "yellow-cell";
            case "Ex3":
                return "red-cell";
            default:
                return "";
        }
    };

    const getNameForCell = (name) => {
        switch (name) {
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
                return "";
        }
    };

    return (
      <div className="board">
        {board.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <div
                className={`cell ${getClassForCell(cell)}`}
                key={`${rowIndex}-${cellIndex}`}
              >
                {cell === "str" ? (
                  <img src="./star-image.png" alt="Star" className="str-image" />
                ) : (
                  getNameForCell(cell)
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
};

export default AppBoard;
