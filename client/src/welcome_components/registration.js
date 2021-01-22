import { Link } from "react-router-dom";
import useStatefulFields from "../hooks/useStatefulFields";
import useAuthSubmit from "../hooks/useAuthSubmit";
import WelcomeLogo from "../components/welcomeLogo";

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
                <input
                    className="input-field"
                    onChange={(e) => handleChange(e)}
                    name="first"
                    placeholder="First Name"
                    type="text"
                />
                <input
                    className="input-field"
                    onChange={(e) => handleChange(e)}
                    name="last"
                    placeholder="Last Name"
                    type="text"
                />
                <input
                    className="input-field"
                    onChange={(e) => handleChange(e)}
                    name="email"
                    placeholder="Email"
                    type="email"
                />
                <input
                    className="input-field"
                    onChange={(e) => handleChange(e)}
                    onKeyPress={(e) => handleKeyPress(e)}
                    name="password"
                    placeholder="Password"
                    type="password"
                />
                <button onClick={() => handleSubmit()}>Create Account</button>
                <Link to="/login">
                    <button>Use Existing Account</button>
                </Link>
            </div>
        </div>
    );
}
