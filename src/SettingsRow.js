import React from 'react';

const SettingsContainer = (props) => {
    return (
        <div className="container">
            <div className="row">
                <div className="col s12">
                    <h1>Settings</h1>
                    <p className="flow-text">You can setup your charts here. Add rows with titles, then add one or more Charts to each row. All you need to specify for a Chart is the S3 prefix and buckets to track.</p>
                </div>
            </div>
        </div>
    );
}

export default SettingsContainer;