import { useState } from "react";
import useStatefulFields from "../hooks/useStatefulFields";
import { useDispatch } from "react-redux";
import { addMapMarker } from "../redux/actions";

export default function MarkerUploader({ cancelMarker, newMarker }) {
    const dispatch = useDispatch();
    const [values, handleChange] = useStatefulFields();
    const [imgFile, setImgFile] = useState();
    const [imgFileLabel, setImgFileLabel] = useState("Choose file");

    const handleFileChange = (e) => {
        setImgFile(e.target.files[0]);
        setImgFileLabel(e.target.files[0].name);
    };

    const saveMarker = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", imgFile);
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("userId", newMarker.userId);
        formData.append("long", newMarker.long);
        formData.append("lat", newMarker.lat);
        dispatch(addMapMarker(formData));
        cancelMarker();
    };

    return (
        <div>
            <form
                name="upload-form"
                method="POST"
                action="/user/image/upload"
                encType="multipart/form-data"
                autoComplete="off"
            >
                <input
                    className="input-field"
                    onChange={handleChange}
                    name="title"
                    placeholder="Title"
                    type="text"
                />
                <input
                    className="input-field"
                    onChange={handleChange}
                    name="description"
                    placeholder="Description"
                    type="text"
                />
                <input
                    name="image"
                    className="input-file"
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <label className="input-field" htmlFor="image">
                    {imgFileLabel}
                </label>
                <button onClick={saveMarker}>Add</button>
            </form>
            <button onClick={cancelMarker}>Cancel</button>
        </div>
    );
}