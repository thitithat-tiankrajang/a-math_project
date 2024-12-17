import { useState } from "react";
import "./App.css";
import AppHeader from "./components/AppHeader.js";
import AppBoard from "./components/AppBoard.js";
import AppRack from "./components/AppRack.js";
import AppBag from "./components/AppBag.js";
import AppScore from "./components/AppScore.js";
import board from "./data/board.js";
import tileDistribution from "./data/tileDistribution.js";
import AppExchange from "./components/AppExchange.js";
import AppSubmit from "./components/AppSubmit.js";
import AppPass from "./components/AppPass.js";

function App() {
  const [firstTern, setFirstTern] = useState(true);
  const [rack, setRack] = useState(
    Array(8).fill({ name: "empty-cell", point: null })
  );

  const [nullCount, setNullCount] = useState(8);
  const [boardState, setBoardState] = useState(
    Array.from({ length: 15 }, () =>
      Array(15).fill({ data: { name: "empty-cell", point: null }, lock: false })
    )
  );

  const [selectedTileInRack, setSelectedTileInRack] = useState({
    name: "empty-cell",
    point: null,
    idx: null,
  });

  const [selectedTileInBoard, setSelectedTileInBoard] = useState({
    name: "empty-cell",
    point: null,
    rowIdx: null,
    colIdx: null,
  });

  const [openBag, setOpenBag] = useState(false);

  const [tileInBoardByTern, setTileInBoardByTern] = useState([]);

  const startTileBag = [];
  for (const [tile, data] of Object.entries(tileDistribution)) {
    for (let i = 0; i < data.count; i++) {
      startTileBag.push({ name: tile, point: data.point });
    }
  }
  const [tileBag, setTileBag] = useState(randomTileBag(startTileBag));

  function randomTileBag(tiles) {
    // สุ่มลำดับของ tiles ด้วย Fisher-Yates Shuffle
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }

    // แบ่ง tiles เป็นกลุ่ม ๆ (เช่น 10 ชุด ๆ ละ 10 ตัว)
    const tileBag = [];
    for (let i = 0; i < 10; i++) {
      tileBag.push(tiles.slice(i * 10, (i + 1) * 10));
    }

    return tileBag;
  };

  return (
    <div className="App">
      <section className="app-section">
        <AppHeader />
        <div className="app-container">
          <section className="lefths">
            <AppBoard
              board={board}
              setRack={setRack}
              boardState={boardState}
              setBoardState={setBoardState}
              selectedTileInRack={selectedTileInRack}
              setSelectedTileInRack={setSelectedTileInRack}
              selectedTileInBoard={selectedTileInBoard}
              setSelectedTileInBoard={setSelectedTileInBoard}
              setTileInBoardByTern={setTileInBoardByTern}
            />
          </section>
          <section className="righths">
            <section className="top-section">
              <AppScore />
            </section>
            <section className="center-section">
              <AppBag
                tileBag={tileBag}
                setTileBag={setTileBag}
                nullCount={nullCount}
                setNullCount={setNullCount}
                openBag={openBag}
                setOpenBag={setOpenBag}
                setRack={setRack}
              />
            </section>
            <section className="bottom-section">
              <AppRack
                rack={rack}
                setRack={setRack}
                setBoardState={setBoardState}
                selectedTileInBoard={selectedTileInBoard}
                setSelectedTileInBoard={setSelectedTileInBoard}
                setSelectedTileInRack={setSelectedTileInRack}
                setTileInBoardByTern={setTileInBoardByTern}
                selectedTileInRack={selectedTileInRack}
              />
              <div className="action">
                <AppSubmit
                  boardState={boardState}
                  setBoardState={setBoardState}
                  firstTern={firstTern}
                  setFirstTern={setFirstTern}
                  nullCount={nullCount}
                  setNullCount={setNullCount}
                  tileInBoardByTern={tileInBoardByTern}
                  setTileInBoardByTern={setTileInBoardByTern}
                />
                <AppExchange
                  tileBag={tileBag}
                  setTileBag={setTileBag}
                  rack={rack}
                  setRack={setRack}
                  openBag={openBag}
                  setOpenBag={setOpenBag}
                  nullCount={nullCount}
                  setNullCount={setNullCount}
                  randomTileBag={randomTileBag}
                />
                <AppPass />
              </div>
            </section>
          </section>
        </div>
      </section>
    </div>
  );
}

export default App;
