import React, { Component } from 'react';
import EditorWrapper from '../texteditor/EditorWrapper';
import axios from 'axios';

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

    handleClickDelete = e => {
        e.preventDefault();
        axios
            .delete(`/api/textblock/${this.state.blk_id}`)
            .then(res => {
                console.log('res.data:' + res.data);
            })
            .catch(err => {
                console.log('err: ' + err);
            });
        window.location.reload();
    };

    render() {
        const block_name = 'Text';
        const user = sessionStorage.getItem('LoggedInUser');
        console.log('text에서 유저: ', user);
        console.log('text block content: ', this.state.content);
        // console.log('text에서 현재 유저', this.state.currentUserProfile);
        // console.log('text에서 현재 유저', this.props.currentUserProfile);

        return (
            <div
                className="full-size-block-container Text"
                onClick={() =>
                    this.props.handleClickBlock(this.props.type, this.props.id)
                }>
                <div className="full-size-block-title">
                    <div className="full-size-block-title__label">Text</div>
                    <button
                        className="delete-button"
                        onClick={this.handleClickDelete}>
                        X
                    </button>
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
