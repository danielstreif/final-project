import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfilePic } from "../redux/actions";
import axios from "../axios";

export default function Uploader({ toggleModal }) {
    const dispatch = useDispatch();
    const imageUrl = useSelector((state) => state.activeUser.url);
    const [imgFile, setImgFile] = useState();
    const [imgFileLabel, setImgFileLabel] = useState("Choose file");
    const [error, setError] = useState(false);

    const handleChange = (e) => {
        setImgFile(e.target.files[0]);
        setImgFileLabel(e.target.files[0].name);
    };

    const uploadImage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", imgFile);
        const { data } = await axios.post("/user/image/upload", formData);
        if (data.error) {
            return setError(true);
        }
        if (data.url) {
            return dispatch(updateProfilePic(data.url));
        }
    };

    const deleteImage = async (e) => {
        e.preventDefault();
        const { data } = await axios.get("/user/image/delete");
        if (data.success) {
            return dispatch(updateProfilePic(null));
        }
    };

    const closeModal = (e) => {
        if (e.target.className === "modal") {
            toggleModal();
        }
    };

    return (
        <div className="modal" onClick={closeModal}>
            <div className="modal-box">
                <div className="modal-header">
                    <h2>Change profile picture</h2>
                    <button className="close-button" onClick={toggleModal}>
                        X
                    </button>
                </div>
                {error && (
                    <p className="error-message">Something went wrong...</p>
                )}
                <form
                    name="upload-form"
                    method="POST"
                    action="/user/image/upload"
                    encType="multipart/form-data"
                    autoComplete="off"
                >
                    <input
                        name="image"
                        className="input-file"
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                    />
                    <label className="input-field" htmlFor="image">
                        {imgFileLabel}
                    </label>
                    <img src="/img/upload.png" onClick={uploadImage} />
                    {imageUrl && (
                        <button onClick={deleteImage}>
                            Delete Current Image
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}
