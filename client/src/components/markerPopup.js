import { Popup } from "react-map-gl";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";

import "./markerPopup.css";

export default function MarkerPopup({
    marker,
    closePopup,
    removeMarker,
    userId,
    toggleModal,
}) {
    return (
        <>
            <Popup
                latitude={marker.lat}
                longitude={marker.long}
                onClose={closePopup}
                closeButton={true}
                closeOnClick={false}
                offsetTop={-30}
            >
                <div className="popup-box">
                    {marker.url && (
                        <img
                            className="popup-img"
                            src={marker.url}
                            alt={marker.title}
                        />
                    )}
                    {marker.title != "undefined" && <p>{marker.title}</p>}
                    {marker.first && (
                        <Link to={`/users/${marker.user_id}`}>
                            <div className="navbar-profile-pic">
                                <img
                                    className="profile-pic"
                                    src={marker.user_url}
                                    alt={`${marker.first} ${marker.last}`}
                                />
                            </div>
                        </Link>
                    )}
                    <Button onClick={() => toggleModal(marker)}>
                        View Comments
                    </Button>
                    {userId == marker.user_id && (
                        <img
                            className="delete-icon"
                            src="/img/bin.png"
                            alt="delete"
                            onClick={() => removeMarker(marker.id)}
                        />
                    )}
                </div>
            </Popup>
        </>
    );
}
