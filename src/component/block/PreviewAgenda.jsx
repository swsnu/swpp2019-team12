import React, { Component } from 'react';

class PreviewAgenda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: this.props.content
        };
    }

    render() {
        return (
            <div className="full-size-block-container PreviewAgenda">
                <div className="full-size-block-title">
                    <div className="full-size-block-title__text">
                        Preview Agenda
                    </div>
                </div>
                <div className="full-size-block-content">
                    <div className="full-size-blokc-content__text">
                        {this.state.content}
                    </div>
                </div>
            </div>
        );
    }
}

export default PreviewAgenda;
