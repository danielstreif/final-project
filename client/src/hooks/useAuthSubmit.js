import { useState } from "react";
import axios from "../axios";

export default function useAuthSubmit(path, fields) {
    const [error, setError] = useState(false);

    const handleSubmit = async () => {
        try {
            const { data } = await axios.post(path, fields);
            data.success ? location.replace("/") : setError(true);
        } catch (err) {
            setError(true);
        }
    };

    return [error, handleSubmit];
}
