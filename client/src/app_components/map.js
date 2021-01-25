import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMapMarker, addMapMarker } from "../redux/actions";
import ReactMapGL, { Marker } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import MarkerPopup from "../components/markerPopup";
import MapMarker from "../components/mapMarker";

import "./map.css";

export default function Map() {
    const dispatch = useDispatch();
    const mapboxKey = useSelector((state) => state.activeUser.mapboxKey);
    const activeUser = useSelector((state) => state.activeUser);
    const mapMarker = useSelector((state) => state.mapMarker);
    const [viewport, setViewport] = useState({
        latitude: 45.50884,
        longitude: -73.58781,
        zoom: 15,
    });

    const [tempMarker, setTempMarker] = useState();
    const [selectedMarker, setSelectedMarker] = useState(null);
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
            userId: activeUser.id,
            long: e.lngLat[0],
            lat: e.lngLat[1],
        });
    };

    const saveMarker = () => {
        dispatch(addMapMarker(tempMarker));
        setTempMarker(null);
    };

    const openPopup = (markerIndex) => {
        setSelectedMarker(markerIndex);
    };

    const closePopup = () => {
        setSelectedMarker(null);
    };

    return (
        <div className="map-container">
            <ReactMapGL
                ref={mapRef}
                {...viewport}
                width="100%"
                height="100%"
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

                {tempMarker && (
                    <Marker
                        longitude={tempMarker.long}
                        latitude={tempMarker.lat}
                    >
                        <>
                            <div className="marker temporary-marker">
                                <span></span>
                            </div>
                            <button onClick={saveMarker}>Add</button>
                        </>
                    </Marker>
                )}
                {mapMarker &&
                    mapMarker.length > 0 &&
                    mapMarker.map((marker, index) => {
                        return (
                            <MapMarker
                                key={`marker-${index}`}
                                index={index}
                                marker={marker}
                                openPopup={openPopup}
                            />
                        );
                    })}
                {selectedMarker && (
                    <MarkerPopup
                        index={selectedMarker}
                        marker={mapMarker[selectedMarker]}
                        closePopup={closePopup}
                    />
                )}
            </ReactMapGL>
        </div>
    );
}
