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

export default function Login() {
    const [values, handleChange] = useStatefulFields();
    const [error, handleSubmit] = useAuthSubmit("/login", values, "/");
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
                    <p className="error-message">Please provide a valid email address and password...</p>
                )}
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
                    className={`${inputSpacing} ${submit}`}
                    onClick={handleSubmit}
                    variant="contained"
                >
                    Log In
                </Button>
                <Link className={inputSpacing} to="/reset">
                    <Button>Forgot password?</Button>
                </Link>
                <Link to="/">
                    <Button>Create New Account</Button>
                </Link>
            </div>
        </div>
    );
}
