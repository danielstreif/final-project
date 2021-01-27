import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfilePic } from "../redux/actions";
import axios from "../axios";
import { Button, Input } from "@material-ui/core";
import { CloudUpload } from "@material-ui/icons";

import "./imgUploader.css";

export default function Uploader({ toggleModal }) {
    const dispatch = useDispatch();
    const imageUrl = useSelector((state) => state.activeUser.url);
    const [imgFile, setImgFile] = useState();
    const [error, setError] = useState(false);

    const handleChange = (e) => {
        setImgFile(e.target.files[0]);
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
            toggleModal();
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
                    <Button onClick={toggleModal}>X</Button>
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
                    <Input
                        name="image"
                        className="input-file"
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                    />
                    <Button onClick={uploadImage} startIcon={<CloudUpload />}>
                        Upload
                    </Button>
                    {imageUrl && (
                        <Button onClick={deleteImage}>
                            Delete Current Image
                        </Button>
                    )}
                </form>
            </div>
        </div>
    );
}
