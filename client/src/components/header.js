import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Button,
    makeStyles,
    IconButton,
    Drawer,
    MenuItem,
    Link,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ProfilePic from "./profilePic";
import Logo from "./logo";

const useStyles = makeStyles(() => ({
    header: {
        display: "flex",
        backgroundColor: "black",
        paddingRight: "76px",
        paddingLeft: "76px",
        "@media (max-width: 900px)": {
            paddingLeft: 0,
        },
    },
    menuButton: {
        fontFamily: "Open Sans, sans-serif",
        fontWeight: 500,
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
    notification: {
        position: "absolute",
        top: "20px",
        borderRadius: "50%",
        height: "15px",
        width: "15px",
    },
    message: {
        left: "85px",
    },
    friend: {
        left: "70px",
    },
    responsiveContainer: {
        padding: "20px 30px",
    },
}));

export default function Header() {
    const activeUser = useSelector((state) => state.activeUser);
    const newFriendRequest = useSelector((state) => state.openRequests);
    const newMessage = useSelector((state) => state.messageNotification);
    const {
        header,
        menuButton,
        toolbar,
        navbar,
        notification,
        message,
        friend,
        responsiveContainer,
    } = useStyles();
    const [state, setState] = useState({
        mobileView: false,
        responsiveAction: false,
    });
    const { mobileView, responsiveAction } = state;

    useEffect(() => {
        const setResponsiveness = () => {
            return window.innerWidth < 1000
                ? setState((prevState) => ({ ...prevState, mobileView: true }))
                : setState((prevState) => ({
                      ...prevState,
                      mobileView: false,
                  }));
        };
        setResponsiveness();
        window.addEventListener("resize", () => setResponsiveness());
    }, []);

    let friendsLabel = newFriendRequest ? (
        <span>
            Friends
            <img
                src="/img/friend.svg"
                alt="notification"
                className={`${notification} ${friend}`}
            />
        </span>
    ) : (
        "Friends"
    );

    let messageLabel = newMessage ? (
        <span>
            Messages
            <img
                src="/img/message.svg"
                alt="notification"
                className={`${notification} ${message}`}
            />
        </span>
    ) : (
        "Messages"
    );

    const menuData = [
        {
            label: friendsLabel,
            href: "/friends",
        },
        {
            label: "Connect",
            href: "/users",
        },
        {
            label: messageLabel,
            href: "/messages",
        },
        {
            label: "Profile",
            href: "/profile",
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

    const displayMobile = () => {
        const handleResponsiveOpen = () => {
            setState((prevState) => ({ ...prevState, responsiveAction: true }));
        };
        const handleResponsiveClose = () => {
            setState((prevState) => ({
                ...prevState,
                responsiveAction: false,
            }));
        };

        const getResponsiveChoices = () => {
            return menuData.map(({ label, href }) => {
                return (
                    <Link
                        key={label}
                        {...{
                            component: RouterLink,
                            to: href,
                            color: "inherit",
                            style: { textDecoration: "none" },
                            key: label,
                        }}
                    >
                        <MenuItem>{label}</MenuItem>
                    </Link>
                );
            });
        };

        return (
            <Toolbar>
                <IconButton
                    {...{
                        edge: "start",
                        color: "inherit",
                        "aria-label": "menu",
                        "aria-haspopup": "true",
                        onClick: handleResponsiveOpen,
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <Drawer
                    {...{
                        anchor: "left",
                        open: responsiveAction,
                        onClose: handleResponsiveClose,
                    }}
                >
                    <div className={responsiveContainer}>
                        {getResponsiveChoices()}
                    </div>
                </Drawer>
                <div>
                    <Logo />
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

    return (
        <AppBar className={header}>
            {mobileView ? displayMobile() : displayDesktop()}
        </AppBar>
    );
}
