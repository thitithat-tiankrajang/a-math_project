import "./style/AppExchange.css";
import "./style/AppRack.css";

function AppExchange(props) {
  const {
    rack,
    setRack,
    setOpenBag,
    nullCount,
    setNullCount,
    exchangeMode,
    setExchangeMode,
    exchangeTiles,
    setExchangeTiles,
    exchangeConfirm,
    setExchangeConfirm,
  } = props;

  function cancelExchange() {
    setExchangeTiles([]);
    setExchangeMode(false);
  }

  // Function to confirm exchange
  function confirmExchange() {
    setExchangeConfirm(true);
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

    setExchangeConfirm(true); // Mark the exchange as confirmed

    return exchangedTiles;
  };

  // Toggle tile selection in the rack
  const toggleRackTileSelection = (index) => {
    // Only allow selection of non-empty tiles
    if (rack[index].name === "empty-cell" || exchangeConfirm) return;

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

  return (
    <div className="app-exchange">
      {!exchangeMode && (
        <div
          className="exchange-text"
          onClick={!exchangeMode && nullCount === 0 ? startExchange : undefined}
        >
          EXCHANGE
        </div>
      )}
      {exchangeMode && (
        <div className="exchange-ui">
          <div className="temp-rack">
            {rack.map((tile, index) => (
              <div
                key={index}
                className={`rack-cell ${
                  tile.name === "empty-cell" ? "empty-tile" : "front-tile"
                } ${
                  exchangeTiles.some((item) => item.idx === index)
                    ? "selected"
                    : ""
                }`}
                onClick={() => toggleRackTileSelection(index)}
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

          <div className="exchange-buttons">
            {!exchangeConfirm && (
              <section className="tool">
                <button
                  onClick={confirmExchange}
                  disabled={exchangeTiles.length === 0}
                >
                  CONFIRM
                </button>
                <button
                  onClick={cancelExchange}
                >
                  CANCEL
                </button>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AppExchange;