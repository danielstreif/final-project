import { Marker } from "react-map-gl";

export default function CustomMarker({ index, marker }) {
    return (
        <Marker longitude={marker.longitude} latitude={marker.latitude}>
            <div className="marker">
                <span>
                    <b>{index + 1}</b>
                </span>
            </div>
        </Marker>
    );
}
