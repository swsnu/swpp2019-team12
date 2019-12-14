import React, { Component } from 'react';
import EditorWrapper from '../texteditor/EditorWrapper';
import axios from 'axios';

class Text extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blk_id: this.props.blk_id,
            content: this.props.content,
            documentId: this.props.documentId,
            isParentAgenda: this.props.isParentAgenda
        };
    }

    handleChangeText = changedText => {
        console.log(changedText);
        console.log('Need to implement changing text');
    };

    handleClickBlock = e => {
        // e.stopPropagation();
    };

    handleClickDelete = e => {
        e.preventDefault();
        console.log('delete textblock');
        const axios_path = `/api/textblock/${this.props.blk_id}/`;
        this.props.handleDeleteBlock(axios_path, 'Text', this.state.blk_id);
    };

    render() {
        return (
            <div
                className="full-size-block-container Text"
                onClick={
                    () => this.handleClickBlock()
                    // this.props.handleClickBlock(
                    //     this.props.type,
                    //     this.props.blk_id
                    // )
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
                    handleAddTextSocketSend={this.props.handleAddTextSocketSend}
                    blk_id={this.props.blk_id}
                    document_id={this.props.document_id}
                    handleChangeText={this.handleChangeText}
                />
                <div className="full-size-block-content">
                    <div className="full-size-block-content__text">
                        {/* {this.state.content} */}
                    </div>
                </div>
            </div>
        );
    }
}

export default Text;
