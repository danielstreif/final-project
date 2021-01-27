import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMarkerByUser } from "../redux/actions";

export default function Wall({ id }) {
    const dispatch = useDispatch();
    const mapMarker = useSelector((state) => state.personalMarker);

    useEffect(() => {
        dispatch(getMarkerByUser(id));
    }, [id]);

    if (!id || !mapMarker) {
        return <p>Loading</p>;
    }

    return (
        <>
            {mapMarker.length == 0 && (
                <p className="standard-text">No spots marked yet yet</p>
            )}
            {mapMarker && (
                <>
                    {mapMarker.map((post) => (
                        <div className="post-container" key={post.id}>
                            <img className="wall-img" src={post.url} alt={`Image ${post.id}`} />
                            <p className="standard-text">{post.description}</p>
                        </div>
                    ))}
                </>
            )}
        </>
    );
}
