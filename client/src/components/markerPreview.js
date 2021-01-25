export default function MarkerPreview({ marker }) {
    return (
        <div className="recent-marker">
            {marker.url && (
                <img
                    className="popup-img"
                    src={marker.url}
                    alt={marker.title}
                />
            )}
            {marker.title != "undefined" && <p>{marker.title}</p>}
        </div>
    );
}
