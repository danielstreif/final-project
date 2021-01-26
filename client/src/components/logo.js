import { Link } from "react-router-dom";
import { Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    logo: {
        display: "flex",
        alignItems: "center",
        fontFamily: "Work Sans, sans-serif",
        fontWeight: 600,
        color: "#FFFEFE",
        textAlign: "left",
    },
    logoImg: {
        height: "45px",
        width: "45px",
        paddingRight: "10px",
        paddingBottom: "5px",
    },
}));

export default function Logo() {
    const { logo, logoImg } = useStyles();
    const title = (
        <Typography variant="h6" component="h1" className={logo}>
            <img className={logoImg} src="/img/logo.png" alt="logo" />
            Climber&apos;s Paradise
        </Typography>
    );

    return <Link to={"/map"}>{title}</Link>;
}
