import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMarkerByUser, focusMarker } from "../redux/actions";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import Comments from "./comments";

import "../app_components/profile.css";

export default function Wall({ id }) {
    const dispatch = useDispatch();
    const mapMarker = useSelector((state) => state.personalMarker);
    const [showModal, setModal] = useState(false);
    const [activePost, setPostActive] = useState({});

    useEffect(() => {
        dispatch(getMarkerByUser(id));
    }, [id]);

    const getMapview = (marker) => {
        return dispatch(focusMarker(marker));
    };

    const toggleModal = (post) => {
        setPostActive(post);
        setModal(!showModal);
    };

    if (!id || !mapMarker) {
        return <p>Loading</p>;
    }

    const modal = (
        <div className="modal">
            <div className="modal-img-box">
                <div className="modal-header">
                    <h2>{activePost.title}</h2>
                    <Button onClick={toggleModal}>X</Button>
                </div>
                <img src={activePost.url} alt={`Image ${activePost.id}`} />
                <p className="standard-text">{activePost.description}</p>
                <Comments markerId={activePost.id} />
            </div>
        </div>
    );

    return (
        <>
            {showModal && modal}
            {mapMarker.length == 0 && (
                <p className="standard-text">No crags marked yet</p>
            )}
            {mapMarker && (
                <>
                    {mapMarker.map((marker) => (
                        <div className="post-container" key={marker.id}>
                            <img
                                className="wall-img"
                                src={marker.url}
                                alt={`Image ${marker.id}`}
                            />
                            <p>{marker.description}</p>
                            <Button onClick={() => getMapview(marker)}>
                                <Link to="/">View on Map</Link>
                            </Button>
                            <Button onClick={() => toggleModal(marker)}>
                                View Comments
                            </Button>
                        </div>
                    ))}
                </>
            )}
        </>
    );
}
