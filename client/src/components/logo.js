import { Link } from "react-router-dom";

export default function Logo() {
    return (
        <Link to={"/map"}>
            <h1 className="logo">tracks and trails</h1>
        </Link>
    );
}
