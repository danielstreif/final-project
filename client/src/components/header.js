import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { AppBar, Toolbar, Button, makeStyles } from "@material-ui/core";
import ProfilePic from "./profilePic";
import Logo from "./logo";

const useStyles = makeStyles(() => ({
    header: {
        display: "flex",
        backgroundColor: "#400CCC",
        paddingRight: "100px",
        paddingLeft: "100px",
    },
    menuButton: {
        fontFamily: "Open Sans, sans-serif",
        fontWeight: 700,
        size: "18px",
        marginLeft: "38px",
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
    },
    navbar: {
        display: "flex",
    },
}));

export default function Header() {
    const activeUser = useSelector((state) => state.activeUser);
    const newFriendRequest = useSelector((state) => state.openRequests);
    const { header, menuButton, toolbar, navbar } = useStyles();

    let friendsLabel = newFriendRequest ? (
        <span style={{ textDecoration: "underline" }}>Friends</span>
    ) : (
        "Friends"
    );

    const menuData = [
        {
            label: "Profile",
            href: "/",
        },
        {
            label: friendsLabel,
            href: "/friends",
        },
        {
            label: "Connect",
            href: "/users",
        },
        {
            label: "Messages",
            href: "/messages",
        },
        {
            label: "Logout",
            href: "/logout",
        },
    ];

    const displayDesktop = () => {
        return (
            <Toolbar className={toolbar}>
                <Logo />
                <div className={navbar}>
                    {getMenuButtons()}
                    <div className="navbar-profile-pic">
                        <ProfilePic props={activeUser} />
                    </div>
                </div>
            </Toolbar>
        );
    };

    const getMenuButtons = () => {
        return menuData.map(({ label, href }) => {
            return (
                <Button
                    key={label}
                    {...{
                        key: label,
                        color: "inherit",
                        to: href,
                        component: RouterLink,
                        className: menuButton,
                    }}
                >
                    {label}
                </Button>
            );
        });
    };

    return <AppBar className={header}>{displayDesktop()}</AppBar>;
}
