import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { AppBar, Toolbar, Button, makeStyles } from "@material-ui/core";
import ProfilePic from "./profilePic";
import Logo from "./logo";

const useStyles = makeStyles(() => ({
    header: {
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
}));

export default function Header() {
    const activeUser = useSelector((state) => state.activeUser);
    const { header, menuButton, toolbar } = useStyles;
    const menuData = [
        {
            label: "Profile",
            href: "/",
        },
        {
            label: "Friends",
            href: "/friends",
        },
        {
            label: "Connect",
            href: "/users",
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
                <div className="navbar-profile-pic">
                    <ProfilePic props={activeUser} />
                </div>
                <div>{getMenuButtons()}</div>
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
