import { Link } from "react-router-dom";
import useStatefulFields from "../hooks/useStatefulFields";
import useAuthSubmit from "../hooks/useAuthSubmit";
import WelcomeLogo from "../components/welcomeLogo";
import { Button, Input } from "@material-ui/core";

export default function Registration() {
    const [values, handleChange] = useStatefulFields();
    const [error, handleSubmit] = useAuthSubmit("/registration", values);

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
                    <p className="error-message">Something went wrong...</p>
                )}
                <Input
                    className="input-field"
                    onChange={(e) => handleChange(e)}
                    name="first"
                    placeholder="First Name"
                    type="text"
                />
                <Input
                    className="input-field"
                    onChange={(e) => handleChange(e)}
                    name="last"
                    placeholder="Last Name"
                    type="text"
                />
                <Input
                    className="input-field"
                    onChange={(e) => handleChange(e)}
                    name="email"
                    placeholder="Email"
                    type="email"
                />
                <Input
                    className="input-field"
                    onChange={(e) => handleChange(e)}
                    onKeyPress={(e) => handleKeyPress(e)}
                    name="password"
                    placeholder="Password"
                    type="password"
                />
                <Button onClick={() => handleSubmit()}>Create Account</Button>
                <Link to="/login">
                    <Button>Use Existing Account</Button>
                </Link>
            </div>
        </div>
    );
}
