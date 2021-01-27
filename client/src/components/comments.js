import { ListItem, List, Button, TextareaAutosize } from "@material-ui/core";
import { useState, useEffect } from "react";
import axios from "../axios";

export default function Comments({ markerId }) {
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
                            {comment.first} {comment.last}
                        </ListItem>
                    ))}
            </List>
        </div>
    );
}
