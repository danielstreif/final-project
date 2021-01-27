import { useState } from "react";
import axios from "../axios";

export default function useAuthSubmit(path, fields, redirect) {
    const [error, setError] = useState(false);

    const handleSubmit = async () => {
        try {
            const { data } = await axios.post(path, fields);
            if (redirect) {
                data.success ? location.replace(redirect) : setError(true);
            } else {
                data.success ? setError(false) : setError(true);
            }
        } catch (err) {
            setError(true);
        }
    };

    return [error, handleSubmit];
}
