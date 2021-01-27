import { Link } from "react-router-dom";
import { useState } from "react";
import useStatefulFields from "../hooks/useStatefulFields";
import axios from "../axios";
import WelcomeLogo from "../components/welcomeLogo";
import { Button, Input } from "@material-ui/core";

export default function Reset() {
    const [values, handleChange] = useStatefulFields();
    const [view, setView] = useState("request");
    const [error, setError] = useState(false);

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && view === "request") {
            handleRequest();
        }
        if (e.key === "Enter" && view === "verify") {
            handleVerification();
        }
    };

    const handleRequest = () => {
        const input = {
            email: values.email,
        };
        axios
            .post("/password/reset/start", input)
            .then(({ data }) => {
                if (data.error) {
                    setError(true);
                }
                if (data.success) {
                    setError(false);
                    setView("verify");
                }
            })
            .catch(() => setError(true));
    };

    const handleVerification = () => {
        const input = {
            code: values.code,
            email: values.email,
            password: values.password,
        };
        axios
            .post("/password/reset/verify", input)
            .then(({ data }) => {
                if (data.error) {
                    setError(true);
                }
                if (data.success) {
                    setError(false);
                    setView("confirm");
                }
            })
            .catch(() => setError(true));
    };

    const request = () => {
        return (
            <>
                {error && (
                    <p className="error-message">
                        No account associated with this email address...
                    </p>
                )}
                <Input
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    name="email"
                    placeholder="Recovery Email"
                    type="email"
                    required
                />
                <Button onClick={handleRequest}>Submit</Button>
            </>
        );
    };

    const verify = () => {
        return (
            <>
                {error && (
                    <p className="error-message">Something went wrong...</p>
                )}
                <Input
                    onChange={handleChange}
                    name="code"
                    placeholder="Verification Code"
                    type="text"
                />
                <Input
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    name="password"
                    placeholder="New Password"
                    type="password"
                />
                <Button onClick={() => this.handleVerification()}>
                    Submit
                </Button>
            </>
        );
    };

    const confirm = () => {
        return <p>Password reset completed</p>;
    };

    return (
        <div className="welcome-container">
            <WelcomeLogo />
            <div className="auth-container">
                {view === "request" && request()}
                {view === "verify" && verify()}
                {view === "confirm" && confirm()}
                <Link to="/login">
                    <Button>Remember Your Password?</Button>
                </Link>
            </div>
        </div>
    );
}
