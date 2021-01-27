import { useState } from "react";
import { FormControlLabel, Checkbox } from "@material-ui/core";

export default function MapStyleMenu({ setStyle }) {
    const [checked, setChecked] = useState({ ["streets-v11"]: true });
    const setCheckmark = (e) => {
        const category = e.target.name;
        setStyle(`mapbox://styles/mapbox/${category}`);
        setChecked({ [category]: true });
    };

    console.log(checked);

    return (
        <div
            className={`map-style-menu ${
                checked["satellite-v9"] ? "dark-theme" : ""
            }`}
        >
            <FormControlLabel
                control={
                    <Checkbox
                        checked={checked["streets-v11"] ? true : false}
                        onChange={setCheckmark}
                        name="streets-v11"
                        color="primary"
                    />
                }
                label="Basic"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={checked["outdoors-v11"] ? true : false}
                        onChange={setCheckmark}
                        name="outdoors-v11"
                        color="primary"
                    />
                }
                label="Outdoor"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={checked["satellite-v9"] ? true : false}
                        onChange={setCheckmark}
                        name="satellite-v9"
                        color="primary"
                    />
                }
                label="Satellite"
            />
        </div>
    );
}
