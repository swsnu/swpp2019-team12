import React, {Component} from 'react'

class Text extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: this.props.content
        }
    }

    handleChangeText = () => {
        console.log("Need to implement changing text");
    }

    render() {
        return (
            <div className="full-size-block-container Text">
                <div className="full-size-block-title">
                    <div className="full-size-block-title__text">Text</div>
                </div>
                <div className="full-size-block-content">
                    <div className="full-size-block-content__text">{this.state.content}</div>
                </div>
            </div>
        )
    }
}

export default Text
