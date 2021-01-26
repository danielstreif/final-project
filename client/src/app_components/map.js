import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMapMarker, removeMapMarker } from "../redux/actions";
import ReactMapGL, { Marker } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import MarkerPopup from "../components/markerPopup";
import MapMarker from "../components/mapMarker";
import MarkerUploader from "../components/markerUploader";
import MarkerPreview from "../components/markerPreview";

import "./map.css";

export default function Map() {
    const dispatch = useDispatch();
    const mapboxKey = useSelector((state) => state.activeUser.mapboxKey);
    const activeUser = useSelector((state) => state.activeUser);
    const mapMarker = useSelector((state) => state.mapMarker);
    const [viewport, setViewport] = useState({
        latitude: 52.520008,
        longitude: 13.404954,
        zoom: 9,
    });

    const [tempMarker, setTempMarker] = useState();
    const [selectedMarker, setSelectedMarker] = useState(null);
    const mapRef = useRef();
    const handleViewportChange = useCallback(
        (newViewport) => setViewport(newViewport),
        []
    );
    const [boulder, setBoulder] = useState(true);
    const [sport, setSport] = useState(true);
    const [trad, setTrad] = useState(true);

    useEffect(() => {
        dispatch(getMapMarker());
    }, []);

    const updateTempMarker = (e) => {
        setTempMarker({
            userId: activeUser.id,
            long: e.lngLat[0],
            lat: e.lngLat[1],
        });
        setSelectedMarker(null);
    };

    const cancelMarker = () => {
        setTempMarker(null);
    };

    const removeMarker = (id) => {
        dispatch(removeMapMarker(id));
        setSelectedMarker(null);
    };

    const openPopup = (index) => {
        setSelectedMarker(index);
    };

    const closePopup = () => {
        setSelectedMarker(null);
    };

    const setBoulderStat = () => {
        setBoulder(!boulder);
    };

    const setSportStat = () => {
        setSport(!sport);
    };

    const setTradStat = () => {
        setTrad(!trad);
    };

    return (
        <div className="page-container">
            <div className="preview-container">
                <h2>Recently added</h2>
                <div className="select-category">
                    <input
                        type="checkbox"
                        id="boulder"
                        name="boulder"
                        value="boulder"
                        onClick={setBoulderStat}
                    />
                    <label
                        className={`${boulder ? "" : "active"}`}
                        htmlFor="boulder"
                    >
                        {" "}
                        Bouldering
                    </label>
                    <input
                        type="checkbox"
                        id="sport"
                        name="sport"
                        value="sport"
                        onClick={setSportStat}
                    />
                    <label
                        className={`${sport ? "" : "active"}`}
                        htmlFor="sport"
                    >
                        {" "}
                        Sport Climbing
                    </label>
                    <input
                        type="checkbox"
                        id="trad"
                        name="trad"
                        value="trad"
                        onClick={setTradStat}
                    />
                    <label className={`${trad ? "" : "active"}`} htmlFor="trad">
                        {" "}
                        Trad Climbing
                    </label>
                </div>
                {mapMarker && mapMarker.length > 0 && (
                    <>
                        <MarkerPreview
                            marker={mapMarker[mapMarker.length - 1]}
                        />
                        <MarkerPreview
                            marker={mapMarker[mapMarker.length - 2]}
                        />
                        <MarkerPreview
                            marker={mapMarker[mapMarker.length - 3]}
                        />
                    </>
                )}
            </div>
            <div className="map-container">
                <div className="add-marker-box">
                    {!tempMarker && (
                        <p>Click anywhere on the map to add a trip.</p>
                    )}
                    {tempMarker && (
                        <MarkerUploader
                            cancelMarker={cancelMarker}
                            newMarker={tempMarker}
                        />
                    )}
                </div>
                <ReactMapGL
                    ref={mapRef}
                    {...viewport}
                    width="100%"
                    height="100%"
                    onViewportChange={handleViewportChange}
                    onClick={updateTempMarker}
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
                            draggable={true}
                            onDragEnd={updateTempMarker}
                        >
                            <>
                                <div className="marker temporary-marker">
                                    <span></span>
                                </div>
                            </>
                        </Marker>
                    )}
                    {mapMarker &&
                        mapMarker.length > 0 &&
                        mapMarker.map((marker, index) => {
                            return (
                                <MapMarker
                                    key={index}
                                    index={index}
                                    marker={marker}
                                    openPopup={openPopup}
                                />
                            );
                        })}
                    {selectedMarker && (
                        <MarkerPopup
                            marker={mapMarker[selectedMarker]}
                            closePopup={closePopup}
                            removeMarker={removeMarker}
                        />
                    )}
                </ReactMapGL>
            </div>
        </div>
    );
}
