import "./AppRack.css";

function AppRack({ rack, onTileClick, selectedTileInRack }) {
  return (
    <div className="rack">
      {rack.map((tile, index) => (
        <div
          key={index}
          className={`rack-cell ${tile === '21' ? "empty-tile" : "front-tile"} ${
            selectedTileInRack?.index === index ? "selected" : ""
          }`}
          onClick={() => onTileClick(index)}
        >
          {tile === '21' ? "" : tile}
        </div>
      ))}
    </div>
  );
}

export default AppRack;

