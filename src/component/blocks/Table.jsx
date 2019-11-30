import React, { Component } from 'react';

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: this.props.content
        };
    }

    handleChangeTable = () => {
        console.log('Need to implement changing table');
    };

    render() {
        return (
            <div
                className="full-size-block-container Table"
                onClick={this.props.handleClickBlock}>
                <div className="full-size-block-title">
                    <div className="full-size-block-title__text">Table</div>
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

export default Table;
