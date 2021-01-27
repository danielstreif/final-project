import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfilePic from "../components/profilePic";
import BioEditor from "../components/bioEditor";
import Wall from "../components/wall";
import { Button } from "@material-ui/core";

import "./profile.css";

export default function Profile() {
    const activeUser = useSelector((state) => state.activeUser);

    return (
        <div className="page-container">
            <div className="profile-container-left">
                <h2>
                    {activeUser.first} {activeUser.last}
                </h2>
                <div className="bio-profile-pic">
                    <ProfilePic props={activeUser} />
                </div>
                <BioEditor />
                <Link to="/account">
                    <Button>Account Settings</Button>
                </Link>
            </div>
            <div className="profile-container-right">
                <Wall id={activeUser.id} />
            </div>
        </div>
    );
}
