import { useState } from "react";
import useStatefulFields from "../hooks/useStatefulFields";
import { useDispatch } from "react-redux";
import { addMapMarker } from "../redux/actions";
import {
    Button,
    Input,
    Select,
    FormHelperText,
    MenuItem,
    FormControl,
    makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
    inputSpacing: {
        marginBottom: "15px",
        width: "100%",
    },
}));

export default function MarkerUploader({ cancelMarker, newMarker }) {
    const dispatch = useDispatch();
    const [values, handleChange] = useStatefulFields();
    const [imgFile, setImgFile] = useState();
    const [category, setCategory] = useState("");
    const [error, setError] = useState(false);
    const { inputSpacing } = useStyles();

    const handleFileChange = (e) => {
        setImgFile(e.target.files[0]);
    };

    const handleSelect = (e) => {
        setCategory(e.target.value);
    };

    const saveMarker = (e) => {
        e.preventDefault();
        if (!imgFile || !values.title || !category) {
            return setError(true);
        }
        setError(false);
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
            {error && (
                <p className="error-message">
                    Please provide more information...
                </p>
            )}
            <form
                name="upload-form"
                method="POST"
                action="/user/image/upload"
                encType="multipart/form-data"
                autoComplete="off"
            >
                {" "}
                <div>
                    <Input
                        className={inputSpacing}
                        onChange={handleChange}
                        name="title"
                        placeholder="Location"
                        type="text"
                        required
                    />
                </div>
                <div>
                    <Input
                        className={inputSpacing}
                        onChange={handleChange}
                        name="description"
                        placeholder="Description"
                        type="text"
                        required
                    />
                </div>
                <Input
                    className={inputSpacing}
                    name="image"
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                />
                <div>
                    <FormControl className={inputSpacing}>
                        <Select
                            labelId="marker-category"
                            id="select"
                            value={category}
                            onChange={handleSelect}
                            required
                        >
                            <MenuItem value="boulder">Bouldering</MenuItem>
                            <MenuItem value="sport">Sport Climbing</MenuItem>
                            <MenuItem value="trad">Trad Climbing</MenuItem>
                        </Select>
                        <FormHelperText>
                            Chose a climbing category
                        </FormHelperText>
                    </FormControl>
                </div>
                <Button
                    className={inputSpacing}
                    variant="outlined"
                    onClick={saveMarker}
                >
                    Add this location
                </Button>
            </form>
            <Button onClick={cancelMarker}>Cancel</Button>
        </div>
    );
}
