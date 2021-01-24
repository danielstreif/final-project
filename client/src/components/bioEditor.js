import { useState } from "react";
import { useSelector } from "react-redux";
import { updateBio } from "../redux/user/actions";
import axios from "../axios";

export default function BioEditor() {
    const activeUser = useSelector((state) => state.activeUser);
    const [textareaVisible, setTextareaVisible] = useState(false);
    const [draftBio, setDraftBio] = useState(activeUser.bio);
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
                    updateBio(draftBio);
                    setError(false);
                    toggleTextarea();
                }
            })
            .catch((err) => {
                console.log(err);
                setError(true);
            });
    };
    const toggleTextarea = () => {
        setTextareaVisible(textareaVisible);
    };
    const resetTextarea = () => {
        setDraftBio(activeUser.bio);
        toggleTextarea();
    };
    const emptyMode = () => {
        return (
            <div className="bio-container">
                <button onClick={toggleTextarea}>Add Bio</button>
            </div>
        );
    };
    const displayMode = () => {
        return (
            <div className="bio-container">
                <p className="bio-text">{activeUser.bio}</p>
                <button onClick={toggleTextarea}>Edit Bio</button>
            </div>
        );
    };
    const editMode = () => {
        return (
            <div className="bio-container">
                {error && <p>Something went wrong.</p>}
                <textarea onChange={handleChange} value={draftBio} />
                <span>
                    <button onClick={handleUpload}>Save</button>
                    <button onClick={resetTextarea}>Close</button>
                </span>
            </div>
        );
    };
    return (
        <>
            {textareaVisible && editMode()}
            {!textareaVisible && activeUser.bio && displayMode()}
            {!textareaVisible && !activeUser.bio && emptyMode()}
        </>
    );
}
