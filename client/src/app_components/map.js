import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMapMarker, addMapMarker } from "../redux/map/actions";
import ReactMapGL, { Marker } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import CustomMarker from "../components/customMarker";
import "./map.css";

export default function Map() {
    const dispatch = useDispatch();
    const mapboxKey = useSelector((state) => state.activeUser.mapboxKey);
    const mapMarker = useSelector((state) => state.mapMarker);
    const [viewport, setViewport] = useState({
        latitude: 45.50884,
        longitude: -73.58781,
        zoom: 15,
    });
    const [tempMarker, setTempMarker] = useState();
    const mapRef = useRef();
    const handleViewportChange = useCallback(
        (newViewport) => setViewport(newViewport),
        []
    );

    useEffect(() => {
        dispatch(getMapMarker());
    }, []);

    const handleClick = (e) => {
        setTempMarker({
            longitude: e.lngLat[0],
            latitude: e.lngLat[1],
        });
    };

    const saveMarker = () => {
        dispatch(addMapMarker(tempMarker));
        setTempMarker(null);
    };

    return (
        <div style={{ height: "100vh" }}>
            <ReactMapGL
                ref={mapRef}
                {...viewport}
                className="map"
                onViewportChange={handleViewportChange}
                onClick={handleClick}
                mapboxApiAccessToken={mapboxKey}
            >
                <Geocoder
                    mapRef={mapRef}
                    enableEventLogging={false}
                    marker={false}
                    onViewportChange={handleViewportChange}
                    mapboxApiAccessToken={mapboxKey}
                />
                <button onClick={saveMarker}>Add</button>
                {tempMarker && (
                    <Marker
                        longitude={tempMarker.longitude}
                        latitude={tempMarker.latitude}
                    >
                        <div className="marker temporary-marker">
                            <span></span>
                        </div>
                    </Marker>
                )}
                {mapMarker.map((marker, index) => {
                    return (
                        <CustomMarker
                            key={`marker-${index}`}
                            index={index}
                            marker={marker}
                        />
                    );
                })}
            </ReactMapGL>
        </div>
    );
}
