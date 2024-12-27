import "./style/AppRack.css";
import { useEffect } from "react";

function AppRack(props) {
  const {
    rack,
    setRack,
    setBoardState,
    selectedTileInBoard,
    setSelectedTileInBoard,
    tileInBoardByTern,
    setTileInBoardByTern,
    selectedTileInRack,
    setSelectedTileInRack,
  } = props;

  // const handleKeyDown = (event) => {
  //   if (event.ctrlKey && event.key === "u") {
  //     event.preventDefault();
  //     setRack((prevRack) => {
  //       let arrIndex = 0;
  //       const newRack = prevRack.map((tile) => {
  //         if (tile.name === "empty-cell") {
            
  //           if (arrIndex < tileInBoardByTern.length) {
  //             console.log("start")
  //             const selectedTile = tileInBoardByTern[arrIndex];
  //             arrIndex++;
  //             return {
  //               name: selectedTile.name,
  //               point: selectedTile.point,
  //             };
  //           }
  //           return tile;
  //         }
  //         return tile; 
  //       });
  //       console.log(newRack);
  //       // setTileInBoardByTern([]); 
  //       return newRack;
  //     });

  //     console.log("kk");
  //   }
  // };
  
  // useEffect(() => {
  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

  function onRackClick(index) {
    console.log(tileInBoardByTern)
    if (selectedTileInRack.name !== "empty-cell") {
      setRack((prevRack) => {
        const newRack = [...prevRack];
        [newRack[selectedTileInRack.idx], newRack[index]] = [newRack[index],newRack[selectedTileInRack.idx]];
        setSelectedTileInRack({ name: "empty-cell", point: null, idx: null });
        return newRack;
      });
    } else if (selectedTileInBoard.name !== "empty-cell") {
      console.log(selectedTileInBoard);

      if (rack[index].name === "empty-cell") {
        setTileInBoardByTern((prevTiles) => {
          const newSetTile = prevTiles.filter(
            (tile) =>
              !(
                tile.rowIdx === selectedTileInBoard.rowIdx &&
                tile.colIdx === selectedTileInBoard.colIdx
              )
          );
          console.log(newSetTile);
          return newSetTile;
        });
      }

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
        return newRack;
      });

      setSelectedTileInBoard({
        name: "empty-cell",
        point: null,
        rowIdx: null,
        colIdx: null,
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

  return (
    <div className="rack">
      {rack.map((tile, index) => (
        <div
          key={index}
          className={`rack-cell ${
            tile.name === "empty-cell" ? "empty-tile" : "front-tile"
          } ${selectedTileInRack?.idx === index ? "selected" : ""}`}
          onClick={() => onRackClick(index)}
        >
          <span className="tile-name">
            {tile.name === "empty-cell" ? "" : tile.name}
          </span>
          <span className="tile-point">
            {tile.name === "empty-cell" ? "" : tile.point}
          </span>
        </div>
      ))}
    </div>
  );
}

export default AppRack;
