import { Link } from "react-router-dom";
import useStatefulFields from "../hooks/useStatefulFields";
import useAuthSubmit from "../hooks/useAuthSubmit";
import WelcomeLogo from "../components/welcomeLogo";
import { Button, Input, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    inputSpacing: {
        marginBottom: "15px",
    },
    submit: {
        background: "black",
        color: "white",
        "&:hover": {
            background: "#424242",
        },
    },
}));

export default function Registration() {
    const [values, handleChange] = useStatefulFields();
    const [error, handleSubmit] = useAuthSubmit("/registration", values, "/");
    const { inputSpacing, submit } = useStyles();

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <div className="welcome-container">
            <WelcomeLogo />
            <div className="auth-container">
                {error && (
                    <p className="error-message">Please fill in all fields...</p>
                )}
                <Input
                    className={inputSpacing}
                    onChange={(e) => handleChange(e)}
                    name="first"
                    placeholder="First Name"
                    type="text"
                    required
                />
                <Input
                    className={inputSpacing}
                    onChange={(e) => handleChange(e)}
                    name="last"
                    placeholder="Last Name"
                    type="text"
                    required
                />
                <Input
                    className={inputSpacing}
                    onChange={(e) => handleChange(e)}
                    name="email"
                    placeholder="Email"
                    type="email"
                    required
                />
                <Input
                    className={inputSpacing}
                    onChange={(e) => handleChange(e)}
                    onKeyPress={(e) => handleKeyPress(e)}
                    name="password"
                    placeholder="Password"
                    type="password"
                    required
                />
                <Button
                    variant="contained"
                    className={`${inputSpacing} ${submit}`}
                    onClick={() => handleSubmit()}
                >
                    Create Account
                </Button>
                <Link to="/login">
                    <Button>Use Existing Account</Button>
                </Link>
            </div>
        </div>
    );
}
