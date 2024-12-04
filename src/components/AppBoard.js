import React from "react";
import "./_css/AppBoard.css";

export default function AppBoard(props) {
  const { board } = props;
  return (
    <main className="board">
      {board.map((row, rowIndex) => (
        <div className="row" key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <div
              className={`cell ${getClassForCell(cell)}`}
              key={`${rowIndex}-${cellIndex}`}
            >
              {cell === "str" ? (
                <img src="./star-image.png" alt="Star" className="str-image" />
              ) : (getNameForCell(cell))}
            </div>
          ))}
        </div>
      ))}
    </main>
  );
};

const classMapping = {
  Px1: "gray-cell",
  Px2: "orange-cell",
  Px3: "blue-cell",
  Ex2: "yellow-cell",
  Ex3: "red-cell",
};

const nameMapping = {
  Px1: "",
  Px2: "2xP",
  Px3: "3xP",
  Ex2: "2xE",
  Ex3: "3xE",
};

const getClassForCell = (cell) => classMapping[cell] || "";
const getNameForCell = (name) => nameMapping[name] || "";