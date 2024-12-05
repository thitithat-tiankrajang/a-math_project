import "./AppRack.css";

function AppRack({ rack, onTileClick, selectedTile }) {
  return (
    <div className="rack">
      {rack.map((tile, index) => (
        <div
          key={index}
          className={`rack-cell ${tile ? "front-tile" : "empty-tile"} ${
            selectedTile?.index === index ? "selected" : ""
          }`}
          onClick={() => onTileClick(index)}
        >
          {tile || ""}
        </div>
      ))}
    </div>
  );
}

export default AppRack;

