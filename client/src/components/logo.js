import { Link } from "react-router-dom";
import { Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    logo: {
        fontFamily: "Work Sans, sans-serif",
        fontWeight: 600,
        color: "#FFFEFE",
        textAlign: "left",
    },
}));

export default function Logo() {
    const { logo } = useStyles();
    const title = (
        <Typography variant="h6" component="h1" className={logo}>
            tracks and trails
        </Typography>
    );

    return <Link to={"/map"}>{title}</Link>;
}
