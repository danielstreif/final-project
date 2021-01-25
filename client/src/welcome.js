import { HashRouter, Route } from "react-router-dom";
import Registration from "./welcome_components/registration";
import Login from "./welcome_components/login";
import Reset from "./welcome_components/reset";
import Footer from "./components/footer";

export default function Welcome() {
    return (
        <>
            <HashRouter>
                <>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset" component={Reset} />
                </>
            </HashRouter>
            <Footer />
        </>
    );
}