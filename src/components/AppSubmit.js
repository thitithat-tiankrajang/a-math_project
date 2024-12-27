import "./style/AppSubmit.css";
import * as math from "mathjs";

function AppSubmit(props) {
  const {
    boardState,
    setBoardState,
    firstTern,
    setFirstTern,
    nullCount,
    setNullCount,
    tileInBoardByTern,
    setTileInBoardByTern,
    exchangeMode,
  } = props;

  function isValidEquation(equation) {
    // Function to convert string array to appropriate format
    function parseInput(arr) {
      return arr.map((item) => {
        // Check if item is an operator
        if (["+", "-", "×", "*", "÷", "/", "=", "−"].includes(item)) {
          // Standardize operators
          if (item === "×" || item === "*") return "x";
          if (item === "÷") return "/";
          if (item === "−") return "-";
          return item;
        }
        // Convert string numbers to actual numbers
        const num = parseInt(item);
        if (isNaN(num)) return null;
        return num;
      });
    }

    // Function to check operator placement rules
    function checkOperatorRules(arr) {
      for (let i = 0; i < arr.length - 1; i++) {
        const current = arr[i];
        const next = arr[i + 1];

        // Check if both current and next items are operators
        if (typeof current === "string" && typeof next === "string") {
          // The only allowed adjacent operators are '=' followed by '-'
          if (current === "=" && next === "-") {
            continue;
          }
          // Any other combination of adjacent operators is invalid
          return false;
        }
      }
      return true;
    }

    // Function to combine consecutive digits according to rules
    function combineNumbers(arr) {
      let result = [];
      let currentNum = "";

      for (let i = 0; i < arr.length; i++) {
        if (typeof arr[i] === "number") {
          // Check if it's a two-digit number (10-20)
          if (arr[i] >= 10) {
            if (currentNum !== "") {
              result.push(parseInt(currentNum));
              currentNum = "";
            }
            result.push(arr[i]);
            continue;
          }

          // Handle single digits
          if (currentNum === "0") {
            // Leading zero rule
            return null;
          }
          currentNum += arr[i].toString();

          // Check if current number exceeds 3 digits
          if (currentNum.length > 3) {
            return null;
          }
        } else {
          if (currentNum !== "") {
            result.push(parseInt(currentNum));
            currentNum = "";
          }
          result.push(arr[i]);
        }
      }

      if (currentNum !== "") {
        result.push(parseInt(currentNum));
      }

      return result;
    }

    // Function to evaluate a simple expression without =
    function evaluateExpression(expr) {
      try {
        // Convert expression array to math.js compatible string
        const exprStr = expr
          .map((item) => {
            if (item === "x") return "*";
            return item;
          })
          .join("");

        // Use math.evaluate from math.js
        const result = math.evaluate(exprStr);

        // Check if result is a number and valid
        if (typeof result !== "number" || !isFinite(result)) {
          return null;
        }

        return result;
      } catch (error) {
        return null;
      }
    }

    // Main validation logic
    try {
      // Parse the input first
      const arr = parseInput(equation);

      // Check for invalid input
      if (arr.includes(null)) {
        return false;
      }

      // Check operator placement rules
      if (!checkOperatorRules(arr)) {
        return false;
      }

      // Check if array contains at least one equals sign
      if (!arr.includes("=")) {
        return false;
      }

      // Combine consecutive numbers according to rules
      const processed = combineNumbers(arr);
      if (processed === null) {
        return false;
      }

      // Split equation into parts by equals sign
      const parts = [];
      let currentPart = [];

      for (const item of processed) {
        if (item === "=") {
          if (currentPart.length === 0) return false;
          parts.push(currentPart);
          currentPart = [];
        } else {
          currentPart.push(item);
        }
      }

      if (currentPart.length > 0) {
        parts.push(currentPart);
      }

      // Evaluate each part using math.js
      const results = parts.map((part) => evaluateExpression(part));

      // Check if any part is invalid
      if (results.includes(null)) {
        return false;
      }

      // Check if all parts are equal
      const firstResult = results[0];
      return results.every(
        (result) => Math.abs(result - firstResult) < 0.000001
      );
    } catch (error) {
      return false;
    }
  }

  // ตัวอย่างการใช้งาน
  const testCases = [
    ["2", "=", "2", "=", "2"],
    ["7", "-", "5", "=", "3", "-", "1", "=", "6", "÷", "3"],
    ["7", "-", "5", "=", "6", "-", "4", "=", "3", "+", "1"],
    ["2", "=", "2", "=", "4"],
    ["5", "×", "3", "+", "2", "=", "17"],
    ["3", "+", "1", "0", "8", "÷", "2", "=", "5", "7"],
    ["0", "5", "+", "0", "8", "=", "1", "3"],
    ["1", "÷", "3", "+", "2", "÷", "3", "=", "1"],
    ["19", "÷", "13", "+", "1", "4", "÷", "2", "6", "=", "2"],
    ["-", "5", "+", "9", "=", "4"],
    ["5", "×", "-", "5", "=", "-", "2", "5"],
    ["-", "5", "×", "5", "=", "-", "2", "5"],
    ["1", "0", "8", "5", "=", "1", "0", "8", "5"],
    ["7", "÷", "10", "=", "7", "÷", "10"],
  ];

  testCases.forEach((testCase, index) => {
    console.log(
      `Test Case ${index + 1}: ${testCase} - ${isValidEquation(testCase)}`
    );
  });

  function onSubmitClick() {
    console.log(tileInBoardByTern)
    // Early return checks
    if (
      (firstTern && boardState[7][7].data.name === "empty-cell") ||
      nullCount !== 0 ||
      tileInBoardByTern.length === 0
    ) {
      if (
        tileInBoardByTern.length === 0 ||
        (firstTern && boardState[7][7].data.name === "empty-cell")
      ) {
        console.log("wrong0");
      }
      return;
    }

    // Find first tile position and check alignment
    const firstTile = tileInBoardByTern[0];
    const alignment = tileInBoardByTern.reduce(
      (acc, tile) => ({
        row: acc.row && firstTile.rowIdx === tile.rowIdx,
        col: acc.col && firstTile.colIdx === tile.colIdx,
      }),
      { row: true, col: true }
    );

    if (!alignment.row && !alignment.col) {
      console.log("wrong1");
      return;
    }

    // Check if tiles are inline and update board
    const checkAndUpdateBoard = (isRow) => {
      const sortedTiles = [...tileInBoardByTern].sort((a, b) =>
        isRow ? a.colIdx - b.colIdx : a.rowIdx - b.rowIdx
      );

      const start = isRow ? sortedTiles[0].colIdx : sortedTiles[0].rowIdx;
      const end = isRow
        ? sortedTiles[sortedTiles.length - 1].colIdx
        : sortedTiles[sortedTiles.length - 1].rowIdx;
      const fixedIndex = isRow ? firstTile.rowIdx : firstTile.colIdx;

      // Check if all cells in line are filled
      const isInline = Array.from({ length: end - start + 1 }, (_, i) => {
        const pos = start + i;
        return isRow
          ? boardState[fixedIndex][pos].data.name !== "empty-cell"
          : boardState[pos][fixedIndex].data.name !== "empty-cell";
      }).every(Boolean);

      if (!isInline) {
        console.log("wrong2");
        return false;
      }

      // Update board state
      setBoardState((prevBoard) => {
        const newBoard = [...prevBoard];
        tileInBoardByTern.forEach((tile) => {
          newBoard[tile.rowIdx][tile.colIdx].lock = true;
        });
        return newBoard;
      });

      return true;
    };

    // Process tiles based on alignment
    const success = alignment.row
      ? checkAndUpdateBoard(true)
      : checkAndUpdateBoard(false);

    if (success) {
      if (firstTern) {
        setFirstTern(false);
      }
      setNullCount(tileInBoardByTern.length);
      setTileInBoardByTern([]);
    }
  }

  return (
    <div className="app-submit">
      {!exchangeMode && (
        <div className="submit-text" onClick={() => onSubmitClick()}>
          SUBMIT
        </div>
      )}
    </div>
  );
}

export default AppSubmit;
