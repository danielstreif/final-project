import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateBio } from "../redux/actions";
import axios from "../axios";
import { Button, TextareaAutosize } from "@material-ui/core";

export default function BioEditor() {
    const dispatch = useDispatch();
    const bio = useSelector((state) => state.activeUser.bio);
    const [textareaVisible, setTextareaVisible] = useState(false);
    const [draftBio, setDraftBio] = useState(bio);
    const [error, setError] = useState(false);

    const handleChange = (e) => {
        setDraftBio(e.target.value);
    };
    const handleUpload = () => {
        const input = { bio: draftBio };
        axios
            .post("/user/bio/edit", input)
            .then(({ data }) => {
                if (data.error) {
                    setError(true);
                }
                if (data.success) {
                    dispatch(updateBio(draftBio));
                    setError(false);
                    toggleTextarea();
                }
            })
            .catch(() => {
                setError(true);
            });
    };
    const toggleTextarea = () => {
        setTextareaVisible(!textareaVisible);
    };
    const resetTextarea = () => {
        setDraftBio(bio);
        toggleTextarea();
    };
    const emptyMode = () => {
        return (
            <div className="bio-container">
                <Button onClick={toggleTextarea}>Add Bio</Button>
            </div>
        );
    };
    const displayMode = () => {
        return (
            <div className="bio-container">
                <p className="bio-text">{bio}</p>
                <Button onClick={toggleTextarea}>Edit Bio</Button>
            </div>
        );
    };
    const editMode = () => {
        return (
            <div className="bio-container">
                {error && <p>Something went wrong.</p>}
                <TextareaAutosize onChange={handleChange} value={draftBio} />
                <span>
                    <Button onClick={handleUpload}>Save</Button>
                    <Button onClick={resetTextarea}>Close</Button>
                </span>
            </div>
        );
    };
    return (
        <>
            {textareaVisible && editMode()}
            {!textareaVisible && bio && displayMode()}
            {!textareaVisible && !bio && emptyMode()}
        </>
    );
}
