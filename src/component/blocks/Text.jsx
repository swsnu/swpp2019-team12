import React, { Component } from 'react';
import EditorWrapper from '../texteditor/EditorWrapper';

class Text extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUserProfile: this.props.currentUserProfile,
            blk_id: this.props.block_id,
            content: this.props.content
        };
    }

    handleChangeText = changedText => {
        console.log(changedText);
        console.log('Need to implement changing text');
    };

    render() {
        const block_name = 'Text';
        const user = sessionStorage.getItem('LoggedInUser');
        console.log('text에서 유저: ', user);
        // console.log('text에서 현재 유저', this.state.currentUserProfile);
        // console.log('text에서 현재 유저', this.props.currentUserProfile);

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
                    currentUserProfile={this.props.currentUserProfile}
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
