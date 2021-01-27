import { Button } from "@material-ui/core";

export default function MarkerPreview({ marker, focus, toggleModal }) {
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
            <Button variant="outlined" onClick={() => toggleModal(marker)}>View Comments</Button>
        </div>
    );
}
