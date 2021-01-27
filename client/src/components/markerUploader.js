import { useState } from "react";
import useStatefulFields from "../hooks/useStatefulFields";
import { useDispatch } from "react-redux";
import { addMapMarker } from "../redux/actions";
import { FormControl, Button, Input, Select, FormLabel } from "@material-ui/core";

export default function MarkerUploader({ cancelMarker, newMarker }) {
    const dispatch = useDispatch();
    const [values, handleChange] = useStatefulFields();
    const [imgFile, setImgFile] = useState();
    const [category, setCategory] = useState();

    const handleFileChange = (e) => {
        setImgFile(e.target.files[0]);
    };

    const handleSelect = (e) => {
        setCategory(e.target.value);
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
        formData.append("category", category);
        dispatch(addMapMarker(formData));
        cancelMarker();
    };

    return (
        <div>
            <FormControl
                name="upload-form"
                method="POST"
                action="/user/image/upload"
                encType="multipart/form-data"
                autoComplete="off"
            >
                <Input
                    className="input-field"
                    onChange={handleChange}
                    name="title"
                    placeholder="Title"
                    type="text"
                />
                <Input
                    className="input-field"
                    onChange={handleChange}
                    name="description"
                    placeholder="Description"
                    type="text"
                />
                <FormLabel htmlFor="marker-type">
                    Choose climbing category:
                </FormLabel>
                <Select
                    name="marker-type"
                    id="marker-type"
                    onChange={handleSelect}
                >
                    <option value="boulder">Bouldering</option>
                    <option value="sport">Sport Climbing</option>
                    <option value="trad">Trad Climbing</option>
                </Select>
                <Input
                    name="image"
                    className="input-file"
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <Button onClick={saveMarker}>Add</Button>
            </FormControl>
            <Button onClick={cancelMarker}>Cancel</Button>
        </div>
    );
}
