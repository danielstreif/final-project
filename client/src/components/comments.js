import { Link } from "react-router-dom";
import { ListItem, List, Button, TextareaAutosize } from "@material-ui/core";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ProfilePic from "./profilePic";
import axios from "../axios";

export default function Comments({ markerId }) {
    const userId = useSelector((state) => state.activeUser.id);
    const [state, setState] = useState({});
    const [error, setError] = useState(false);

    useEffect(() => {
        (async () => {
            const { data } = await axios.get(`/map/comments/${markerId}`);
            setState({ ...state, comments: data });
        })();
    }, []);

    const handleChange = (e) => {
        setState({ ...state, draft: e.target.value });
    };

    const resetTextarea = () => {
        setState({ ...state, draft: null });
    };

    const handleSubmit = () => {
        const input = {
            markerId: markerId,
            userId: userId,
            comment: state.draft,
        };
        axios
            .post("/map/comment", input)
            .then(({ data }) => {
                if (data.success) {
                    setError(false);
                    setState({
                        ...state,
                        comments: [data.success, ...state.comments],
                        draft: null,
                    });
                } else {
                    setError(true);
                }
            })
            .catch(() => {
                setError(true);
            });
    };

    const deleteComment = async (commentId) => {
        const { data } = await axios.get(`/map/comments/delete/${commentId}`);
        if (data.success) {
            setState({
                ...state,
                comments: state.comments.filter(
                    (comment) => comment.id != commentId
                ),
            });
        }
    };

    return (
        <div className="comment-container">
            {error && <p className="error-message">Something went wrong.</p>}
            <TextareaAutosize
                placeholder="Compose Message"
                onChange={handleChange}
                value={state.draft ? state.draft : ""}
            />
            <Button onClick={handleSubmit}>Comment</Button>
            <Button onClick={resetTextarea}>Cancel</Button>
            <List>
                {state.comments &&
                    state.comments.map((comment) => (
                        <ListItem key={comment.id}>
                            {comment.comment}
                            <Link
                                className="chat-user"
                                to={`/users/${comment.user}`}
                            >
                                <div className="message-profile-pic">
                                    <ProfilePic props={comment} />
                                </div>
                            </Link>
                            <span className="user-info">
                                {comment.first} {comment.last}
                                {comment.time}
                                {userId == comment.user && (
                                    <img
                                        className="delete-icon"
                                        src="/img/bin.png"
                                        alt="delete"
                                        onClick={() =>
                                            deleteComment(comment.id)
                                        }
                                    />
                                )}
                            </span>
                        </ListItem>
                    ))}
            </List>
        </div>
    );
}
