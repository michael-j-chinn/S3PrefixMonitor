import React from 'react';

const SettingsRow = (props) => {
    return (
        <div className="row">
            <div className="col s12">
                <div className="input-field col s12">
                    <input id="email" type="text" className="validate" />
                    <label htmlFor="email">Row Title</label>
                </div>
            </div>
        </div>
    );
}

export default SettingsRow;