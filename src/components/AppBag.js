import React, { useState } from "react";
import "./AppBag.css";

export default function AppBag(props) {
    const { onTileClick, tileDistribution, nullCount, setNullCount } = props;

    const createTileBag = () => {
        const tiles = [];
    
        // สร้างรายการ tiles จาก tileDistribution
        for (const [tile, data] of Object.entries(tileDistribution)) {
            for (let i = 0; i < data.count; i++) { 
                tiles.push({ name: tile, point: data.point }); // เก็บเป็นวัตถุ
            }
        }
    
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

    const [tileBag, setTileBag] = useState(createTileBag());
    const [selectedBag, setSelectedBag] = useState(false);
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
