import axios from "../axios";

export default function Logout() {
    const logout = () => {
        axios
            .get("/logout")
            .then(({ data }) => {
                if (data.logout) {
                    location.replace("/");
                }
            })
            .catch((err) => console.log("Logout error: ", err));
    };

    return logout();
}
