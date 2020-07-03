import React from "react";
import {BrowserRouter as Router, Switch, Route } from "react-router-dom";
import App from "./app";
import CountryDatailWindow from "./components/countryDetailWindow";

const AppRouter: React.FunctionComponent = (props) => {
    return (
        <Router>
            <Switch>
                <Route path="/" component = {App} exact />
                <Route path="/detail" component = {CountryDatailWindow} exact />
            </Switch>
        </Router>
    )
}

export default AppRouter;
