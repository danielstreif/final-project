import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMarkerByUser, focusMarker } from "../redux/actions";
import { Link } from "react-router-dom";
import { Button, makeStyles } from "@material-ui/core";
import CommentModal from "./commentModal";

import "../app_components/profile.css";

const useStyles = makeStyles(() => ({
    buttonSpacing: {
        marginRight: "10px",
    },
}));

export default function Wall({ id }) {
    const dispatch = useDispatch();
    const mapMarker = useSelector((state) => state.personalMarker);
    const [showModal, setModal] = useState(false);
    const [activePost, setPostActive] = useState({});
    const { buttonSpacing } = useStyles();

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

    return (
        <>
            {showModal && (
                <CommentModal
                    activePost={activePost}
                    toggleModal={toggleModal}
                />
            )}
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
                            <Button
                                className={buttonSpacing}
                                variant="outlined"
                                onClick={() => getMapview(marker)}
                            >
                                <Link to="/">View on Map</Link>
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => toggleModal(marker)}
                            >
                                View Comments
                            </Button>
                        </div>
                    ))}
                </>
            )}
        </>
    );
}
