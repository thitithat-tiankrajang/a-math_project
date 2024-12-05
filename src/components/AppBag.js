import React, { useState } from "react";
import "./AppBag.css";

export default function AppBag(props) {
    const { onTileClick, tileDistribution, nullCount, setNullCount } = props;

    const createTileBag = () => {
        const tiles = [];

        for (const [tile, count] of Object.entries(tileDistribution)) {
            for (let i = 0; i < count; i++) {
                tiles.push(tile);
            }
        }

        for (let i = tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
        }

        const tileBag = [];
        for (let i = 0; i < 10; i++) {
            tileBag.push(tiles.slice(i * 10, (i + 1) * 10));
        }
        return tileBag;
    };

    const [tileBag, setTileBag] = useState(createTileBag());
    const [selectedBag, setSelectedBag] = useState(false); // Set to true when opening the bag popup
    const [selectedStack, setSelectedStack] = useState(null);
    const [selectedTiles, setSelectedTiles] = useState([]);

    function openStackPopup() {
        setSelectedBag(true); // เปิด popup สำหรับ stack ทั้งหมดใน tileBag
    }

    function openTilePopup(index) {
        closePopupStack();
        setSelectedStack({ tiles: tileBag[index], stackIndex: index });
    }

    function closePopupStack() {
        setSelectedBag(false); // ปิด popup ของ stack ทั้งหมด
    }

    function closePopupTiles() {
        setSelectedStack(null);
        setSelectedTiles([]); // ล้างสถานะเมื่อปิด popup
        openStackPopup();
    }

    function toggleSelectedTile(stackIndex, tileIndex) {
        const tileKey = `${stackIndex}-${tileIndex}`; // ใช้ตำแหน่งที่ไม่ซ้ำเป็นตัวบ่งชี้

        setSelectedTiles((prevTiles) => {
            if (prevTiles.includes(tileKey)) {
                return prevTiles.filter((tile) => tile !== tileKey);
            } else {
                return [...prevTiles, tileKey];
            }
        });
    }

    const addTilesToRack = () => {
        let selectedTileValues = selectedTiles.map((key) => {
            const [stackIndex, tileIndex] = key.split("-").map(Number);
            return tileBag[stackIndex][tileIndex];
        });

        if (selectedTileValues.length > nullCount) {
            selectedTileValues = selectedTileValues.slice(0, nullCount);
        }

        setNullCount(nullCount - selectedTileValues.length);

        const keysToRemove = selectedTiles.slice(0, selectedTileValues.length);

        onTileClick(selectedTileValues);

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
                        Close
                    </button>
                    <div className="popup-stack-content">
                        {tileBag.map((stack, index) => (
                            <div
                                key={index}
                                className="stack"
                                onClick={() => openTilePopup(index)}
                            >
                                Stack {index}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedStack && (
                <div className="popup-tiles">
                    <div className="popup-tiles-content">
                        <button className="close-popup-tiles-button" onClick={closePopupTiles}>
                            Close
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
                                    {/* {tile} */}
                                </div>
                            ))}
                        </div>
                        <button className="pick-popup-tiles-button" onClick={addTilesToRack}>
                            Pick
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
