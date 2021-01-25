import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfilePic from "../components/profilePic";
import BioEditor from "../components/bioEditor";

export default function Profile() {
    const activeUser = useSelector((state) => state.activeUser);

    return (
        <div className="profile-container">
            <div className="profile-container-left">
                <h2>
                    {activeUser.first} {activeUser.last}
                </h2>
                <div className="bio-profile-pic">
                    <ProfilePic props={activeUser} />
                </div>
                <BioEditor />
                <Link to="/account">
                    <button>Account Settings</button>
                </Link>
            </div>
            <div className="profile-container-right">
                <p>map and gallery?</p>
            </div>
        </div>
    );
}