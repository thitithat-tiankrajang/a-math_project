import React, { useState } from "react";
import "./style/AppBag.css";

export default function AppBag(props) {
    
    const { onTileClick, tileBag, setTileBag, nullCount, setNullCount, selectedBag, setSelectedBag} = props;
    const [selectedStack, setSelectedStack] = useState(null);
    const [selectedTiles, setSelectedTiles] = useState([]);

    function openStackPopup() {
        setSelectedBag(true);
    }

    function openTilePopup(index) {
        closePopupStack();
        setSelectedStack({ tiles: tileBag[index], stackIndex: index });
    }

    function closePopupStack() {
        setSelectedBag(false);
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

        setNullCount(nullCount - selectedTileObjects.length);

        const keysToRemove = selectedTiles.slice(0, selectedTileObjects.length);

        onTileClick(selectedTileObjects);

        const newTileBag = tileBag.map((stack, stackIndex) => {
            if (stackIndex === selectedStack.stackIndex) {
                return stack.filter((_, tileIndex) =>
                    !keysToRemove.includes(`${stackIndex}-${tileIndex}`)
                );
            }
            return stack;
        });

        setTileBag(newTileBag);

        closePopupTiles();
    };

    return (
        <div className="app-bag">
            <div className="bag" onClick={openStackPopup}>
                Open Tile Bag
            </div>

            {selectedBag && !selectedStack && (
                <div className="popup-stack">
                    <button className="close-popup-stack-button" onClick={closePopupStack}>
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
                        <button className="close-popup-tiles-button" onClick={closePopupTiles}>
                            CLOSE
                        </button>
                        <div className="tiles">
                            {selectedStack.tiles.map((tile, tileIndex) => (
                                <div
                                    key={tileIndex}
                                    className={`back-tile ${selectedTiles.includes(
                                        `${selectedStack.stackIndex}-${tileIndex}`
                                    )
                                            ? "selected"
                                            : ""
                                        }`}
                                    onClick={() =>
                                        toggleSelectedTile(
                                            selectedStack.stackIndex,
                                            tileIndex
                                        )
                                    }
                                >
                                    {tile.name}
                                    <div className="tile-point">{tile.point}</div>
                                </div>
                            ))}
                        </div>
                        <button className="pick-popup-tiles-button" onClick={addTilesToRack}>
                            PICK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
