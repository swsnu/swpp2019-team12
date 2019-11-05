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
        const block_name = "Text";
        const block_id = 1;
        return (
            <div 
                className="full-size-block-container Text"
                onClick={() => this.props.handleClickBlock(block_name, block_id)}    
            >
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
