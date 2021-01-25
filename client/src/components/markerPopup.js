import { Popup } from "react-map-gl";
import "./markerPopup.css";

export default function MarkerPopup({ marker, closePopup, removeMarker }) {
    return (
        <Popup
            latitude={marker.lat}
            longitude={marker.long}
            onClose={closePopup}
            closeButton={true}
            closeOnClick={false}
            offsetTop={-30}
        >
            <div className="popup-box">
                {marker.url && (
                    <img
                        className="popup-img"
                        src={marker.url}
                        alt={marker.title}
                    />
                )}
                {marker.title != "undefined" && <p>{marker.title}</p>}
                {marker.description != "undefined" && (
                    <p>{marker.description}</p>
                )}
                <button onClick={() => removeMarker(marker.id)}>Remove</button>
            </div>
        </Popup>
    );
}
