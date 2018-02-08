import React, { Component } from 'react';

class RawDataContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {data:[]};

        this.forceRefresh = this.forceRefresh.bind(this);
        this.getUniqueFileNamePortion = this.getUniqueFileNamePortion.bind(this);
    }

    componentDidMount() {
        axios.get('/api/v1/rawdata')
            .then(response => {
                this.setState({data: response.data});
            })
            .catch(reason => {
                console.log(reason);
                Materialize.toast(`Issue while loading inital data: ${reason}`, 3000);
            });
    }

    getUniqueFileNamePortion(rawData, file) {
        let bucketPrefix = `https://s3.console.aws.amazon.com/s3/object/${rawData.bucket}/${rawData.prefix}`;
        return file.substring(bucketPrefix.length);
    }

    forceRefresh(e) {
        e.preventDefault();

        axios.get('/api/v1/rawdata')
            .then(response => {
                this.setState({data: response.data});
                Materialize.toast('Refreshed!', 3000);
            })
            .catch(reason => {
                console.log(reason);
                Materialize.toast(`Issue while refreshing: ${reason}`, 3000);
            });
    }

    render() {
        return (
            <div className='container'>
                <div className='row'>
                    <div className='col s12'>
                        <h1>Raw Data</h1>
                        <a className="waves-effect waves-light btn" onClick={this.forceRefresh}><i className="material-icons left">refresh</i>Refresh</a>
                        {this.state.data.map((rawData, index) => 
                            <ul key={index} className='collection with-header'>
                                <li className='collection-header orange lighten-5'>{`${rawData.bucket}/${rawData.prefix}`}</li>
                                {rawData.files.length > 0 ?
                                    rawData.files.map((file, fileIndex) =>
                                    <li key={fileIndex} className='collection-item'><a href={file} target='_blank'>{this.getUniqueFileNamePortion(rawData, file)}</a></li>
                                    ) :
                                    <li className='collection-item'>No data found</li>
                                }
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        );
    }
};

export default RawDataContainer;