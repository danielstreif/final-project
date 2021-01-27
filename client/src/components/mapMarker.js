import { Marker } from "react-map-gl";

export default function MapMarker({ index, marker, openPopup }) {
    return (
        <Marker latitude={marker.lat} longitude={marker.long}>
            <div
                className="marker"
                onClick={() => openPopup(index == 0 ? "0" : index)}
            >
                <span className={`marker ${marker.category}`}> </span>
            </div>
        </Marker>
    );
}
