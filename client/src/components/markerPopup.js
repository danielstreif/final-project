import { Popup } from "react-map-gl";

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
            <p>Test</p>
            <button onClick={() => removeMarker(marker.id)}>Remove</button>
        </Popup>
    );
}
