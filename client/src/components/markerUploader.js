import { useState } from "react";
import useStatefulFields from "../hooks/useStatefulFields";
import { useDispatch } from "react-redux";
import { addMapMarker } from "../redux/actions";
import {
    Button,
    Input,
    Select,
    InputLabel,
    MenuItem,
    FormControl,
} from "@material-ui/core";

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
            <form
                name="upload-form"
                method="POST"
                action="/user/image/upload"
                encType="multipart/form-data"
                autoComplete="off"
            >
                <Input
                    onChange={handleChange}
                    name="title"
                    placeholder="Title"
                    type="text"
                />
                <Input
                    onChange={handleChange}
                    name="description"
                    placeholder="Description"
                    type="text"
                />
                <Input
                    name="image"
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <FormControl>
                    <InputLabel id="marker-category">
                        Climbing category:
                    </InputLabel>
                    <Select
                        labelId="marker-category"
                        id="select"
                        value={category}
                        onChange={handleSelect}
                    >
                        <MenuItem value="boulder">Bouldering</MenuItem>
                        <MenuItem value="sport">Sport Climbing</MenuItem>
                        <MenuItem value="trad">Trad Climbing</MenuItem>
                    </Select>
                </FormControl>
                <Button onClick={saveMarker}>Add</Button>
            </form>
            <Button onClick={cancelMarker}>Cancel</Button>
        </div>
    );
}
