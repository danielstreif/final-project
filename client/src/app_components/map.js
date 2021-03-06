import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMapMarker, removeMapMarker } from "../redux/actions";
import ReactMapGL, { Marker } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import MarkerPopup from "../components/markerPopup";
import MapMarker from "../components/mapMarker";
import MarkerUploader from "../components/markerUploader";
import MapControl from "../components/mapControl";
import MapStyleMenu from "../components/mapStyleMenu";
import CommentModal from "../components/commentModal";

import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "./map.css";

export default function Map() {
    const dispatch = useDispatch();
    const mapboxKey = useSelector((state) => state.activeUser.mapboxKey);
    const activeUser = useSelector((state) => state.activeUser);
    const mapMarker = useSelector((state) => state.mapMarker);
    const focusMarker = useSelector((state) => state.focusMarker);
    const [viewport, setViewport] = useState({
        latitude: focusMarker ? focusMarker.lat : 52.520008,
        longitude: focusMarker ? focusMarker.long : 13.404954,
        zoom: 1,
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
    const [style, setStyle] = useState("mapbox://styles/mapbox/streets-v11");
    const [showModal, setModal] = useState(false);
    const [activePost, setPostActive] = useState({});

    const toggleModal = (post) => {
        setPostActive(post);
        setModal(!showModal);
    };

    useEffect(() => {
        dispatch(getMapMarker());
    }, []);

    let filteredMarker;
    if (mapMarker) {
        filteredMarker = mapMarker.filter((marker) => filter[marker.category]);
    }

    const updateTempMarker = (e) => {
        e.preventDefault();
        setTempMarker({
            userId: activeUser.id,
            long: e.lngLat[0],
            lat: e.lngLat[1],
        });
        setSelectedMarker(null);
    };

    const focusViewport = (marker) => {
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
            {showModal && (
                <CommentModal
                    activePost={activePost}
                    toggleModal={toggleModal}
                />
            )}
            <div className="preview-container">
                {tempMarker && (
                    <div className="add-marker-box">
                        <h2>Add a new crag</h2>
                        <MarkerUploader
                            cancelMarker={cancelMarker}
                            newMarker={tempMarker}
                        />
                    </div>
                )}
                {!tempMarker && (
                    <MapControl
                        setCategoryFilter={setCategoryFilter}
                        focusViewport={focusViewport}
                        toggleModal={toggleModal}
                        filter={filter}
                        filteredMarker={filteredMarker}
                    />
                )}
            </div>
            <div className="map-container">
                <ReactMapGL
                    ref={mapRef}
                    {...viewport}
                    width="100%"
                    height="100%"
                    onViewportChange={handleViewportChange}
                    onContextMenu={updateTempMarker}
                    mapboxApiAccessToken={mapboxKey}
                    mapStyle={style}
                >
                    <Geocoder
                        mapRef={mapRef}
                        enableEventLogging={false}
                        marker={false}
                        onViewportChange={handleViewportChange}
                        mapboxApiAccessToken={mapboxKey}
                        position="top-left"
                        clearAndBlurOnEsc={true}
                    />
                    <MapStyleMenu style={style} setStyle={setStyle} />
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
                            userId={activeUser.id}
                            toggleModal={toggleModal}
                        />
                    )}
                </ReactMapGL>
                {!tempMarker && (
                    <p>Right click on the map to add a new climbing spot.</p>
                )}
            </div>
        </div>
    );
}
