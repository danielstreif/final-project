import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfilePic from "./profilePic";
import Logo from "./logo";
import Logout from "../app_components/logout";

export default function Header() {
    const activeUser = useSelector((state) => state.activeUser);
    return (
        <header>
            <Logo />
            <div className="navbar-menu">
                <button>
                    <Link to="/users">Connect</Link>
                </button>
                <div className="navbar-profile-pic">
                    <ProfilePic props={activeUser} />
                </div>
                <button>
                    <Link to="/">Profile</Link>
                </button>
                <button>
                    <Link to="/friends">Friends</Link>
                </button>
                <button>
                    <Logout />
                </button>
            </div>
        </header>
    );
}
