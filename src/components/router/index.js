import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from '../navigation/Navbar';
import ChartsContainer from '../../pages/charts/ChartsContainer';
import RawDataContainer from '../../pages/rawdata/RawDataContainer';
import SettingsContainer from '../../pages/settings/SettingsContainer';

const Container = (props) => {
    return (
        <Router>
            <div>
                <Navbar />
                
                <Switch>
                    <Route path="/" exact component={ChartsContainer} />
                    <Route path="/charts" component={ChartsContainer} />
                    <Route path="/rawdata" component={RawDataContainer} />
                    <Route path="/settings" component={SettingsContainer} />
                </Switch>
            </div>
        </Router>
    );
}

export default Container;
