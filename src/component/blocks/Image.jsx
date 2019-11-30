import React, { Component } from 'react';

class Image extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: this.props.content
        };
    }

    handleChangeImage = () => {
        console.log('Need to implement changing image');
    };

    render() {
        return (
            <div
                className="full-size-block-container Image"
                onClick={this.props.handleClickBlock}>
                <div className="full-size-block-title">
                    <div className="full-size-block-title__text">Image</div>
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

export default Image;
