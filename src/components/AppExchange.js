import React, { useState } from "react";
import "./style/AppExchange.css";

function AppExchange(props) {
    const { onTileClick, tileBag , setTileBag, rack , setRack, selectedBag, setSelectedBag, nullCount, setNullCount } = props;

    const [exchangeMode, setExchangeMode] = useState(false);
    const [exchangeTiles, setExchangeTiles] = useState([]);

    // Function to confirm exchange
    const confirmExchange = () => {
        // Create copies of the rack
        let updatedRack = [...rack];

        // Collect tiles to be exchanged
        const exchangedTiles = exchangeTiles.map(index => {
            const tile = updatedRack[index];
            
            // Set the tile in the rack to "empty-cell"
            updatedRack[index] = { name: "empty-cell", point: 0 };
            
            return tile;
        });

        // Set the number of null cells to exchange
        setNullCount(exchangeTiles.length);

        // Update the rack 
        setRack(updatedRack);

        // Mark the exchange as confirmed
        setSelectedBag(true);

        // Return exchangedTiles for parent component to handle
        return exchangedTiles;
    };

    // Toggle tile selection in the rack
    const toggleRackTileSelection = (index) => {
        // Only allow selection of non-empty tiles
        if (rack[index].name === 'empty-cell') return;

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
        // Only start exchange if there are no null cells and not already in exchange mode
        if (nullCount === 0 && !exchangeMode) {
            setExchangeMode(true);
            setExchangeTiles([]);
        }
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
                                className={`rack-tile 
                                    ${tile.name === 'empty-cell' ? 'empty' : ''} 
                                    ${exchangeTiles.includes(index) ? "selected" : ""}`}
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