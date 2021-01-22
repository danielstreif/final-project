import axios from "../axios";

export default function Logout() {
    const handleClick = () => {
        axios
            .get("/logout")
            .then(({ data }) => {
                if (data.logout) {
                    location.replace("/");
                }
            })
            .catch((err) => console.log("Logout error: ", err));
    };

    return <div onClick={handleClick}>Logout</div>;
}
