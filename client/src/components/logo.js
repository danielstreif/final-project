import { Link } from "react-router-dom";

export default function Logo() {
    return (
        <Link to={"/map"}>
            <h1 className="logo">final project</h1>
        </Link>
    );
}
