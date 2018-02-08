import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';

const Navbar = (props) => {
    return (
        <nav>
            <div className="nav-wrapper">
                <a href="#!" className="brand-logo">S3 Prefix Monitor</a>
                <a href="#" data-activates="mobile-menu" className="button-collapse"><i className="material-icons">menu</i></a>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><Link to="/charts">Charts</Link></li>
                    <li><Link to="/rawdata">Raw Data</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                </ul>
                <ul className="side-nav" id="mobile-menu">
                    <li><Link to="/charts">Charts</Link></li>
                    <li><Link to="/rawdata">Raw Data</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;