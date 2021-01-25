import { Marker } from "react-map-gl";

export default function MapMarker({ index, marker, openPopup }) {
    return (
        <Marker latitude={marker.lat} longitude={marker.long}>
            <div className="marker" onClick={() => openPopup(index)}>
                <span> </span>
            </div>
        </Marker>
    );
}
