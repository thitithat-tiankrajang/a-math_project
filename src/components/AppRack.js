import "./AppRack.css";

function AppRack({ rack, onTileClick, selectedTileInRack }) {
  return (
    <div className="rack">
      {rack.map((tile, index) => (
        <div
          key={index}
          className={`rack-cell ${tile.name === 'empty-cell' ? "empty-tile" : "front-tile"} ${
            selectedTileInRack?.idx === index ? "selected" : ""
          }`}
          onClick={() => onTileClick(index)}
        >
          <span className="tile-name">{tile.name === 'empty-cell' ? "" : tile.name}</span>
          <span className="tile-point">{tile.name === 'empty-cell' ? "" : tile.point}</span>
        </div>
      ))}
    </div>
  );
}

export default AppRack;
