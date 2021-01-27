import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfilePic from "../components/profilePic";
import BioEditor from "../components/bioEditor";
import Wall from "../components/wall";
import { Button, makeStyles } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";

const useStyles = makeStyles(() => ({
    buttonSpacing: {
        marginTop: "10px",
    },
}));

import "./profile.css";

export default function Profile() {
    const activeUser = useSelector((state) => state.activeUser);
    const { buttonSpacing } = useStyles();

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
                    <Button className={buttonSpacing} startIcon={<SettingsIcon />}>
                        Account Settings
                    </Button>
                </Link>
            </div>
            <div className="profile-container-right">
                <Wall id={activeUser.id} />
            </div>
        </div>
    );
}
