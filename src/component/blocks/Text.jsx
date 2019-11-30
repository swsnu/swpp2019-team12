import React, { Component } from 'react';
import EditorWrapper from '../texteditor/EditorWrapper';

class Text extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blk_id: this.props.blk_id,
            content: this.props.content,
            documentId: this.props.documentId
        };
    }

    handleChangeText = changedText => {
        console.log(changedText);
        console.log('Need to implement changing text');
    };

    render() {
        // const block_name = 'Text';
        // const user = sessionStorage.getItem('LoggedInUser');
        // console.log('text에서 유저: ', user);
        // console.log('text block content: ', this.state.content);

        return (
            <div
                className="full-size-block-container Text"
                onClick={() =>
                    this.props.handleClickBlock(
                        this.props.type,
                        this.props.blk_id
                    )
                }>
                <div className="full-size-block-title">
                    <div className="full-size-block-title__label">Text</div>
                </div>
                <EditorWrapper
                    documentId={this.state.documentId}
                    handleChangeText={this.handleChangeText}></EditorWrapper>
                <div className="full-size-block-content">
                    {/* <div className="full-size-block-content__text">
                        {this.state.content}
                    </div> */}
                </div>
            </div>
        );
    }
}

export default Text;
