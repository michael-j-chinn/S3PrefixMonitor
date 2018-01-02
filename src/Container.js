import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './Navbar';
import ChartsContainer from './ChartsContainer';
import SettingsContainer from './SettingsContainer';

const Container = (props) => {
    return (
        <Router>
            <div>
                <Navbar />
                
                <Switch>
                    <Route path="/" exact component={ChartsContainer} />
                    <Route path="/charts" component={ChartsContainer} />
                    <Route path="/settings" component={SettingsContainer} />
                </Switch>
            </div>
        </Router>
    );
}

export default Container;
