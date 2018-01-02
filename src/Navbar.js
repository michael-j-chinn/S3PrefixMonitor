import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';

const Navbar = (props) => {
    return (
        <nav>
            <div className="nav-wrapper">
                <a href="#" className="brand-logo">Logo</a>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><Link to="/charts">Charts</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;