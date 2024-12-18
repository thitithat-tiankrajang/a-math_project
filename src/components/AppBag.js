import React, { useState } from "react";
import "./style/AppBag.css";

export default function AppBag(props) {
  const {
    tileBag,
    setTileBag,
    nullCount,
    setNullCount,
    openBag,
    setOpenBag,
    setRack,
    exchangeMode,
    setExchangeMode,
    exchangeTiles,
    setExchangeTiles,
    randomTileBag,
    exchangeConfirm,
    setExchangeConfirm,
  } = props;

  const [selectedStack, setSelectedStack] = useState(null);
  const [selectedTiles, setSelectedTiles] = useState([]);

  function addToRack(tiles) {
    tiles.forEach((tile) => {
      setRack((prevRack) => {
        const emptyIndex = prevRack.findIndex(
          (cell) => cell.name === "empty-cell"
        );
        if (emptyIndex !== -1) {
          const newRack = [...prevRack];
          newRack[emptyIndex] = tile;
          return newRack;
        }
        return prevRack;
      });
    });
  }
  // Cancel the exchange process and update the bag
  function putTileInBag(nowTileBag, nowNullCount) {

    if (exchangeMode && nowNullCount === 0) {
      // Create a new array to hold the updated openBag
      let updatedBag = [];

      nowTileBag.forEach((stackIndex) => {
        stackIndex.forEach((tileIndex) => {
          updatedBag.push(tileIndex);
        });
      });
    
      // Loop through the tileBag and add exchanged tiles back to the bag
      exchangeTiles.forEach((tile) => {
        updatedBag.push({ name: tile.data.name, point: tile.data.point });
      });

      // Reset the state
      setExchangeMode(false);
      setExchangeTiles([]);
      setTileBag(randomTileBag(updatedBag));
      return;
    }

    // Update the openBag with the new array
    setTileBag(nowTileBag);
  }

  function openStackPopup() {
      setOpenBag(true);
  }

  function openTilePopup(index) {
    closePopupStack();
    setSelectedStack({ tiles: tileBag[index], stackIndex: index });
  }

  function closePopupStack() {
    setOpenBag(false);
  }

  function closePopupTiles() {
    setSelectedStack(null);
    setSelectedTiles([]);
    openStackPopup();
  }

  function toggleSelectedTile(stackIndex, tileIndex) {
    const tileKey = `${stackIndex}-${tileIndex}`;
    setSelectedTiles((prevTiles) => {
      if (prevTiles.includes(tileKey)) {
        return prevTiles.filter((tile) => tile !== tileKey);
      } else {
        return [...prevTiles, tileKey];
      }
    });
  }

  const addTilesToRack = () => {
    let selectedTileObjects = selectedTiles.map((key) => {
      const [stackIndex, tileIndex] = key.split("-").map(Number);
      return tileBag[stackIndex][tileIndex]; // เก็บทั้ง `name` และ `point`
    });

    if (selectedTileObjects.length > nullCount) {
      selectedTileObjects = selectedTileObjects.slice(0, nullCount);
    }
    const nowNullCount = nullCount - selectedTileObjects.length;
    setNullCount(nowNullCount);

    const keysToRemove = selectedTiles.slice(0, selectedTileObjects.length);

    addToRack(selectedTileObjects);

    const newTileBag = tileBag.map((stack, stackIndex) => {
      if (stackIndex === selectedStack.stackIndex) {
        return stack.filter(
          (_, tileIndex) => !keysToRemove.includes(`${stackIndex}-${tileIndex}`)
        );
      }
      return stack;
    });

    closePopupTiles();

    putTileInBag(newTileBag, nowNullCount);

    if (nowNullCount === 0) {
      if (exchangeConfirm) {
        setExchangeMode(false);
        setExchangeConfirm(false);
      }
      closePopupStack();
    }
  };

  return (
    <div className="app-bag">
      {!openBag && !selectedStack && (
        <div className="bag" onClick={openStackPopup}>
          Open Tile Bag
        </div>)
      }

      {openBag && !selectedStack && (
        <div className="popup-stack">
          <button
            className="close-popup-stack-button"
            onClick={closePopupStack}
          >
            CLOSE
          </button>
          <div className="popup-stack-content">
            {tileBag.map((stack, index) => (
              <div
                key={index}
                className="stack"
                onClick={() => openTilePopup(index)}
              >
                STACK {index}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedStack && (
        <div className="popup-tiles">
          <div className="popup-tiles-content">
            <button
              className="close-popup-tiles-button"
              onClick={closePopupTiles}
            >
              CLOSE
            </button>
            <div className="tiles">
              {selectedStack.tiles.map((tile, tileIndex) => (
                <div
                  key={tileIndex}
                  className={`back-tile ${
                    selectedTiles.includes(
                      `${selectedStack.stackIndex}-${tileIndex}`
                    )
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    toggleSelectedTile(selectedStack.stackIndex, tileIndex)
                  }
                >
                  {/* {tile.name}
                  <div className="tile-point">{tile.point}</div> */}
                </div>
              ))}
            </div>
            <button
              className="pick-popup-tiles-button"
              onClick={addTilesToRack}
            >
              PICK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
