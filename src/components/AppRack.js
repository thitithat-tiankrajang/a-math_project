import "./_css/AppRack.css";

export default function AppRack({ rack }) {
    return (
        <div className="rack">
            {Array.from({ length: 8 }).map((_, index) => (
                <div
                    className={`rack-cell rack-cell-${index} ${rack[index] ? "front-tile" : "empty-tile"}`}
                    key={index}
                >
                    {rack[index] || ""}
                </div>
            ))}
        </div>
    );
}
