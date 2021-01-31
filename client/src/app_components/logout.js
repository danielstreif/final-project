import axios from "../axios";
import { useEffect } from "react";

export default function Logout() {
    useEffect(() => {
        logout();
    });
    
    const logout = () => {
        axios
            .get("/auth/logout")
            .then(({ data }) => {
                if (data.logout) {
                    location.replace("/");
                }
            })
            .catch((err) => console.log("Logout error: ", err));
    };

    return null;
}
