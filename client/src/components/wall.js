import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMarkerByUser, focusMarker } from "../redux/actions";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";

export default function Wall({ id }) {
    const dispatch = useDispatch();
    const mapMarker = useSelector((state) => state.personalMarker);

    useEffect(() => {
        dispatch(getMarkerByUser(id));
    }, [id]);

    if (!id || !mapMarker) {
        return <p>Loading</p>;
    }

    const getMapview = (marker) => {
        return dispatch(focusMarker(marker));
    };

    return (
        <>
            {mapMarker.length == 0 && (
                <p className="standard-text">No spots marked yet yet</p>
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
                                <Link to="/map">View on Map</Link>
                            </Button>
                        </div>
                    ))}
                </>
            )}
        </>
    );
}
