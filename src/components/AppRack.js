import "./style/AppRack.css";

function AppRack(props) {
  const {
    rack,
    setRack,
    setBoardState,
    selectedTileInBoard,
    setSelectedTileInBoard,
    setSelectedTileInRack,
    setTileInBoardByTern,
    selectedTileInRack,
  } = props;
  
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
