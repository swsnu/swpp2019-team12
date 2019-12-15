import React, { Component } from 'react';
import EditorWrapper from '../texteditor/EditorWrapper';
import { css } from '@emotion/core';
import PacmanLoader from 'react-spinners/PacmanLoader';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    position: relative;
    z-index: 100;
`;

class Text extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blk_id: this.props.blk_id,
            content: this.props.content,
            document_id: this.props.document_id,
            isParentAgenda: this.props.isParentAgenda,

            loading: true
        };
    }

    handleLoading = () => {
        this.setState({
            loading: false
            // loading: true
        });
    };

    handleChangeText = changedText => {
        console.log('Need to implement changing text');
    };

    handleClickDelete = e => {
        e.preventDefault();
        const axios_path = `/api/textblock/${this.props.blk_id}/`;
        this.props.handleDeleteBlock(axios_path, 'Text', this.state.blk_id);
    };

    render() {
        return (
            <div className="full-size-block-container Text">
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
                    handleLoading={this.handleLoading}
                    loading={this.state.loading}
                />
                {this.state.loading && (
                    <div className="EditorWrapper-loader">
                        <PacmanLoader
                            css={override}
                            size={15}
                            color={'#98c6fa'}
                            loading={this.state.loading}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default Text;
