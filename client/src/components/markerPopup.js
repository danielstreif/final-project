import { Popup } from "react-map-gl";

export default function MarkerPopup({ index, marker, closePopup }) {
    return (
        <Popup
            latitude={marker.lat}
            longitude={marker.long}
            onClose={closePopup}
            closeButton={true}
            closeOnClick={false}
            offsetTop={-30}
        >
            <p>{index}</p>
        </Popup>
    );
}
