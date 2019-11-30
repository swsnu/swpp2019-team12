import React, { Component } from 'react';

class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: this.props.content
        };
    }

    handleChangeCalendar = () => {
        console.log('Need to implement changing info in calendar');
    };

    render() {
        return (
            <div
                className="full-size-block-container Calendar"
                onClick={this.props.handleClickBlock}>
                <div className="full-size-block-title">
                    <div className="full-size-block-title__text">Calendar</div>
                </div>
                <div className="full-size-block-content">
                    <div className="full-size-block-content__text">
                        {this.state.content}
                    </div>
                </div>
            </div>
        );
    }
}

export default Calendar;
