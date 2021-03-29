import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";

function App() {
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/">
                        <LandingPage />
                    </Route>
                    <Route exact path="/login">
                        <LoginPage />
                    </Route>
                    <Route exact path="/register" component={RegisterPage} /> {/* 간단하게 */}
                </Switch>
            </div>
        </Router>
    );
}

export default App;
