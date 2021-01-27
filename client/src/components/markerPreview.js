export default function MarkerPreview({ marker, focus }) {
    if (marker == undefined) {
        return null;
    }
    return (
        <div className="recent-marker" onClick={() => focus(marker)}>
            {marker.url && (
                <img
                    className="preview-img"
                    src={marker.url}
                    alt={marker.title}
                />
            )}
            {marker.title != "undefined" && <p>{marker.title}</p>}
        </div>
    );
}
