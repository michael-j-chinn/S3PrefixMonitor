import React, { Component } from 'react';

class ChartTimerange extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id={'chart-pagination-' + this.props.uuid}>
                <ul className='pagination'>
                    {this.props.timerangeOptions.map((option, index) =>
                        <li key={index} className={this.props.active == option.value ? 'active' : ''}>
                            <a href='#' onClick={(e) => this.props.handleClick(e, option.value)} data-value={option.value}>{option.text}</a>
                        </li>)}
                </ul>
            </div>
        );
    }
}

export default ChartTimerange;