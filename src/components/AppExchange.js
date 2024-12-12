import React, { useState } from "react";
import "./style/AppExchange.css";

function AppExchange(props) {

    const { onTileClick, tileBag, setTileBag, rack, setRack, selectedBag, setSelectedBag, nullCount, setNullCount} = props;

    const [exchangeMode, setExchangeMode] = useState(false);
    const [exchangeTiles, setExchangeTiles] = useState([]);

    const confirmExchange = () => {
        setSelectedBag(true);
    }

    const toggleRackTileSelection = (index) => {
        setExchangeTiles((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    const startExchange = () => {
        setExchangeMode(true);
        setExchangeTiles([]);
    };

    const cancelExchange = () => {
        setExchangeMode(false);
        setExchangeTiles([]);
    };

    return (
        <div className="exchange-instructions">
            <div 
                className="app-exchange"
                onClick={!exchangeMode ? startExchange : undefined}
            >Exchange</div>
            {exchangeMode && (
                <div className="exchange-ui">
                    <div className="rack">
                        {rack.map((tile, index) => (
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