import React, { useState } from "react";
import "./style/AppExchange.css";

function AppExchange(props) {
    const { onTileClick, tileBag, setTileBag, rack, setRack, selectedBag, setSelectedBag, nullCount, setNullCount } = props;

    const [exchangeMode, setExchangeMode] = useState(false);
    const [exchangeTiles, setExchangeTiles] = useState([]);

    // Function to confirm exchange
    const confirmExchange = () => {
        setNullCount(exchangeTiles.length);

        // Create copies of the rack and tileBag
        let updatedRack = [...rack];
        let updatedTileBag = [...tileBag];

        // Loop through the selected tiles and make them empty in the rack
        exchangeTiles.forEach(index => {
            // Get the selected tile from the rack
            const tile = updatedRack[index];

            // Set the tile in the rack to "empty-cell"
            updatedRack[index] = { name: "empty-cell", point: 0 };

            // Add the tile to the tileBag (to be swapped with new tiles)
            updatedTileBag.push(tile);
        });

        // Update the rack and tileBag states
        setRack(updatedRack);
        setTileBag(updatedTileBag);

        // Mark the exchange as confirmed
        setSelectedBag(true);
    };

    // Toggle tile selection in the rack
    const toggleRackTileSelection = (index) => {
        setExchangeTiles((prev) => {
            if (prev.includes(index)) {
                return prev.filter((i) => i !== index);
            } else {
                return [...prev, index];
            }
        });
    };

    // Start the exchange process
    const startExchange = () => {
        if (nullCount !== 0) {
            return;
        }
        setExchangeMode(true);
        setExchangeTiles([]);
    };

    // Cancel the exchange process
    const cancelExchange = () => {
        setExchangeMode(false);
        setExchangeTiles([]);
    };

    return (
        <div className="exchange-instructions">
            <div 
                className="app-exchange"
                onClick={(!exchangeMode && nullCount === 0) ? startExchange : undefined}
            >
                Exchange
            </div>
            {exchangeMode && (
                <div className="exchange-ui">
                    <div className="rack">
                        {rack && rack.length > 0 && rack.map((tile, index) => (
                            <div
                                key={index}
                                className={`rack-tile ${exchangeTiles.includes(index) ? "selected" : ""}`}
                                onClick={() => toggleRackTileSelection(index)}
                            >
                                {tile.name !== 'empty-cell' ? (
                                    <>
                                        {tile.name}
                                        <div className="tile-point">{tile.point}</div>
                                    </>
                                ) : (
                                    <div className="empty-tile">Empty</div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="exchange-buttons">
                        <button onClick={confirmExchange}>Confirm</button>
                        <button onClick={cancelExchange}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AppExchange;