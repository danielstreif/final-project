import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMapMarker, removeMapMarker } from "../redux/actions";
import ReactMapGL, { Marker } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import MarkerPopup from "../components/markerPopup";
import MapMarker from "../components/mapMarker";
import MarkerUploader from "../components/markerUploader";
import MarkerPreview from "../components/markerPreview";
import { FormControlLabel, Checkbox } from "@material-ui/core";

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
    const [filter, setFilter] = useState({
        boulder: true,
        sport: true,
        trad: true,
    });

    useEffect(() => {
        dispatch(getMapMarker());
    }, []);
    
    let filteredMarker;
    if (mapMarker) {
        filteredMarker = mapMarker.filter((marker) => filter[marker.category]);
    }

    const updateTempMarker = (e) => {
        setTempMarker({
            userId: activeUser.id,
            long: e.lngLat[0],
            lat: e.lngLat[1],
        });
        setSelectedMarker(null);
    };

    const focusMarker = (marker) => {
        setViewport({ latitude: marker.lat, longitude: marker.long, zoom: 9 });
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

    const setCategoryFilter = (e) => {
        const category = e.target.name;
        setFilter({
            ...filter,
            [category]: e.target.checked,
        });
    };

    return (
        <div className="page-container">
            <div className="preview-container">
                <h2>Recently added</h2>
                <div className="select-category">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={filter.boulder}
                                onChange={setCategoryFilter}
                                name="boulder"
                                color="primary"
                            />
                        }
                        label="Bouldering"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={filter.sport}
                                onChange={setCategoryFilter}
                                name="sport"
                                color="primary"
                            />
                        }
                        label="Sport Climbing"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={filter.trad}
                                onChange={setCategoryFilter}
                                name="trad"
                                color="primary"
                            />
                        }
                        label="Trad Climbing"
                    />
                </div>
                {filteredMarker && filteredMarker.length > 0 && (
                    <>
                        <MarkerPreview
                            marker={filteredMarker[filteredMarker.length - 1]}
                            focus={focusMarker}
                        />
                        <MarkerPreview
                            marker={filteredMarker[filteredMarker.length - 2]}
                            focus={focusMarker}
                        />
                        <MarkerPreview
                            marker={filteredMarker[filteredMarker.length - 3]}
                            focus={focusMarker}
                        />
                    </>
                )}
            </div>
            <div className="map-container">
                <div className="add-marker-box">
                    {!tempMarker && (
                        <p>
                            Click anywhere on the map to add a new climbing
                            spot.
                        </p>
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
                    {filteredMarker &&
                        filteredMarker.length > 0 &&
                        filteredMarker.map((marker, index) => {
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
                            marker={filteredMarker[selectedMarker]}
                            closePopup={closePopup}
                            removeMarker={removeMarker}
                        />
                    )}
                </ReactMapGL>
            </div>
        </div>
    );
}
