import React, { useState } from "react";
import "./style/AppExchange.css";

export default function AppExchange(props) {
    const { tileDistribution = {}, rackTiles = [], setRackTiles } = props;

    const createTileBag = () => {
        const tiles = [];
        for (const [tile, data] of Object.entries(tileDistribution)) {
            for (let i = 0; i < data.count; i++) {
                tiles.push({ name: tile, point: data.point });
            }
        }
        for (let i = tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
        }
        return tiles;
    };

    const [tileBag, setTileBag] = useState(createTileBag());
    const [exchangeMode, setExchangeMode] = useState(false);
    const [exchangeTiles, setExchangeTiles] = useState([]);
    const [selectedBagTiles, setSelectedBagTiles] = useState([]);

    const toggleRackTileSelection = (index) => {
        setExchangeTiles((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    const toggleBagTileSelection = (index) => {
        setSelectedBagTiles((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    const startExchange = () => {
        setExchangeMode(true);
        setExchangeTiles([]);
        setSelectedBagTiles([]);
    };

    const cancelExchange = () => {
        setExchangeMode(false);
        setExchangeTiles([]);
        setSelectedBagTiles([]);
    };

    const confirmExchange = () => {
        if (exchangeTiles.length !== selectedBagTiles.length) {
            alert("Please select the same number of tiles to exchange!");
            return;
        }

        const newRack = [...rackTiles];

        // Replace selected rack tiles with new tiles from the bag
        exchangeTiles.forEach((rackIndex, i) => {
            newRack[rackIndex] = tileBag[selectedBagTiles[i]];
        });

        // Update the bag by removing selected tiles and adding the exchanged tiles
        const newTileBag = [...tileBag];
        const returnedTiles = exchangeTiles.map((rackIndex) => rackTiles[rackIndex]);
        returnedTiles.forEach((tile) => newTileBag.push(tile));
        setTileBag(newTileBag.filter((_, index) => !selectedBagTiles.includes(index)));

        // Update rack and reset the state
        setRackTiles(newRack);
        setExchangeMode(false);
        setExchangeTiles([]);
        setSelectedBagTiles([]);
    };

    return (
        <div
            className="app-exchange"
            onClick={!exchangeMode ? startExchange : undefined} // Start exchange when clicking on the container
        >
            {!exchangeMode ? (
                <div className="exchange-instructions">Exchange</div>
            ) : (
                <div className="exchange-ui">
                    <div className="rack">
                        {rackTiles.map((tile, index) => (
                            <div
                                key={index}
                                className={`rack-tile ${exchangeTiles.includes(index) ? "selected" : ""}`}
                                onClick={() => toggleRackTileSelection(index)}
                            >
                                {tile ? (
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

                    <div className="tile-bag">
                        <div className="bag-title">Select Tiles from the Bag</div>
                        <div className="tiles">
                            {tileBag.map((tile, index) => (
                                <div
                                    key={index}
                                    className={`bag-tile ${selectedBagTiles.includes(index) ? "selected" : ""}`}
                                    onClick={() => toggleBagTileSelection(index)}
                                >
                                    {tile.name}
                                    <div className="tile-point">{tile.point}</div>
                                </div>
                            ))}
                        </div>
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