import React from 'react';

const SettingsChart = (props) => {
    return (
        <div className="card blue-grey darken-1">
            <div className="card-content white-text">
                <span className="card-title">Chart</span>
                <div className="row">
                    <div className="input-field col s12">
                        <input id="email" type="text" className="validate" />
                        <label htmlFor="email">Chart Title</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12">
                        <input id="email" type="text" className="validate" />
                        <label htmlFor="email">Prefix to Monitor</label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsChart;