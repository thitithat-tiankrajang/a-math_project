import React, { useState } from "react";
import "./style/AppExchange.css";

function AppExchange(props) {
  const {
    tileBag,
    setTileBag,
    rack,
    setRack,
    openBag,
    setOpenBag,
    nullCount,
    setNullCount,
    randomTileBag,
  } = props;

  const [exchangeMode, setExchangeMode] = useState(false);
  const [exchangeTiles, setExchangeTiles] = useState([]);

  // Function to confirm exchange
  const confirmExchange = () => {
    // Create copies of the rack
    let updatedRack = [...rack];

    // Collect tiles to be exchanged
    const exchangedTiles = exchangeTiles.map((index) => {
      const tile = updatedRack[index.idx];

      // Set the tile in the rack to "empty-cell"
      updatedRack[index.idx] = { name: "empty-cell", point: 0 };

      return tile;
    });

    setNullCount(exchangeTiles.length);

    setRack(updatedRack);

    setOpenBag(true);

    return exchangedTiles;
  };

  // Toggle tile selection in the rack
  const toggleRackTileSelection = (index) => {
    // Only allow selection of non-empty tiles
    if (rack[index].name === "empty-cell") return;

    setExchangeTiles((prev) => {
      if (prev.some((item) => item.idx === index)) {
        return prev.filter((item) => item.idx !== index);
      } else {
        return [
          ...prev,
          {
            data: { name: rack[index].name, point: rack[index].point },
            idx: index,
          },
        ];
      }
    });
  };

  // Start the exchange process
  const startExchange = () => {
    // Only start exchange if there are no null cells and not already in exchange mode
    if (nullCount === 0 && !exchangeMode) {
      setExchangeMode(true);
      setExchangeTiles([]);
    }
  };

  // Cancel the exchange process and update the bag
  const cancelExchange = () => {
    // Create a new array to hold the updated openBag

    let updatedBag = [];

    tileBag.forEach((stackIndex) => {
      stackIndex.forEach((tileIndex) => {
        updatedBag.push(tileIndex);
      });
    });

    // Loop through the tileBag and add exchanged tiles back to the bag
    exchangeTiles.forEach((tile) => {
      updatedBag.push({ name: tile.data.name, point: tile.data.point });
    });

    // Update the openBag with the new array
    setTileBag(randomTileBag(updatedBag));

    // Reset the state
    setExchangeMode(false);
    setExchangeTiles([]);
  };

  return (
    <div className="exchange-instructions">
      <div
        className="app-exchange"
        onClick={!exchangeMode && nullCount === 0 ? startExchange : undefined}
      >
        EXCHANGE
      </div>
      {exchangeMode && (
        <div className="exchange-ui">
          <div className="rack">
            {rack &&
              rack.length > 0 &&
              rack.map((tile, index) => (
                <div
                  key={index}
                  className={`rack-tile 
                                    ${
                                      tile.name === "empty-cell" ? "empty" : ""
                                    } 
                                    ${
                                      exchangeTiles.some(
                                        (item) => item.idx === index
                                      )
                                        ? "selected"
                                        : ""
                                    }`}
                  onClick={() => toggleRackTileSelection(index)}
                >
                  {tile.name !== "empty-cell" ? (
                    <>
                      {tile.name}
                      <div className="tile-point">{tile.point}</div>
                    </>
                  ) : (
                    <div className="empty-tile"></div>
                  )}
                </div>
              ))}
          </div>

          <div className="exchange-buttons">
            <button
              onClick={confirmExchange}
              disabled={exchangeTiles.length === 0}
            >
              Confirm
            </button>
            <button onClick={cancelExchange}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppExchange;
