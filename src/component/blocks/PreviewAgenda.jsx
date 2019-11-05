import React, { Component } from 'react';

class PreviewAgenda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            agenda_title: this.props.agenda_title,
            agenda_discussion: this.props.agenda_discussion
        };
    }

    handleClickToDetail = () => {
        console.log(
            'Need to implement changing to Detail mode from preview mode'
        );
    };

    render() {
        return (
            <div
                className="full-size-block-container PreviewAgenda"
                onClick={() =>
                    this.props.handleClickBlock(this.props.type, this.props.id)
                }>
                <div className="full-size-block-title PreviewAgenda">
                    <div className="full-size-block-title__text PreviewAgenda">
                        Preview Agenda
                    </div>
                </div>
                <div className="full-size-block-content PreviewAgenda">
                    <div className="full-size-block-content__text PreviewAgenda">
                        {this.props.content}
                    </div>
                </div>
            </div>
        );
    }
}

export default PreviewAgenda;
