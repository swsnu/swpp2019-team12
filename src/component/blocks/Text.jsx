import React, { Component } from 'react';
import EditorWrapper from '../texteditor/EditorWrapper';

class Text extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blk_id: this.props.block_id,
            content: this.props.content
        };
    }

    handleChangeText = () => {
        console.log('Need to implement changing text');
    };

    render() {
        const block_name = 'Text';
        return (
            <div
                className="full-size-block-container Text"
                onClick={() =>
                    this.props.handleClickBlock(block_name, this.state.blk_id)
                }>
                <div className="full-size-block-title">
                    <div className="full-size-block-title__text">Text</div>
                </div>
                <EditorWrapper
                    handleChangeText={this.handleChangeText}></EditorWrapper>
                <div className="full-size-block-content">
                    <div className="full-size-block-content__text">
                        {this.state.content}
                    </div>
                </div>
            </div>
        );
    }
}

export default Text;
