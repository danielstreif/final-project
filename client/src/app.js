import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getActiveUser } from "./redux/actions";
import NotFound from "./notFound";
import Header from "./components/header";
import Footer from "./components/footer";
import Profile from "./app_components/profile";
import OtherProfile from "./app_components/otherProfile";
import FindPeople from "./app_components/findPeople";
import Friends from "./app_components/friends";
import Account from "./app_components/account";

export default function App() {
    const dispatch = useDispatch();
    const activeUser = useSelector((state) => state.activeUser);

    useEffect(() => {
        dispatch(getActiveUser());
    }, []);

    if (!activeUser) {
        return null;
    }

    return (
        <BrowserRouter>
            <>
                <Header />
                <div className="app-container">
                    <Switch>
                        <Route exact path="/" render={() => <Profile />} />
                        <Route
                            path="/users/:id"
                            render={(props) => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route path="/users" render={() => <FindPeople />} />

                        <Route path="/friends" render={() => <Friends />} />
                        <Route path="/account" render={() => <Account />} />

                        <Route component={NotFound} />
                    </Switch>
                </div>
                <Footer />
            </>
        </BrowserRouter>
    );
}
