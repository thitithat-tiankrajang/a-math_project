import "./style/AppSubmit.css";

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
  } = props;

  function isValidEquation(equation) {
    // แปลงเครื่องหมายพิเศษ
    function normalizeOperators(arr) {
      return arr.map((item) => {
        if (item === "×") return "*";
        if (item === "÷") return "/";
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
    <div className="app-submit">
      <div className="submit-text" onClick={() => onSubmitClick()}>
        SUBMIT
      </div>
    </div>
  );
}

export default AppSubmit;
