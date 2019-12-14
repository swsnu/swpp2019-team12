import React, { Component } from 'react';
import axios from 'axios';

class Image extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blk_id: this.props.blk_id,
            image: null,
            content: this.props.content,
            is_submitted: false,
            file: null
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.is_submitted !== prevState.is_submitted) {
            return {
                is_submitted: nextProps.is_submitted,
                image: nextProps.image,
                content: nextProps.content
            };
        }
        return prevState;
    }

    componentDidMount() {
        this.setState({
            is_submitted: this.props.is_submitted,
            content: this.props.content,
            image: this.props.image
        });
    }

    handleChange = e => {
        this.setState({
            content: e.target.value
        });
    };

    handleChangeImage = e => {
        this.setState({
            image: e.target.files[0],
            file: URL.createObjectURL(e.target.files[0])
        });
    };

    handleClickDelete = e => {
        e.preventDefault();
        const axios_path = `/api/image/${this.state.blk_id}/`;
        this.props.handleDeleteBlock(axios_path, 'Image', this.state.blk_id);
    };

    handleSubmitValidation = () => {
        const { image } = this.state;
        return image !== null;
    };

    handleSubmit = e => {
        e.preventDefault();
        const noteId = this.props.noteId;
        let form_data = new FormData();
        form_data.append('image', this.state.image, this.state.image.name);
        form_data.append('content', this.state.content);

        axios
            .patch(`/api/image/${this.state.blk_id}/`, form_data, {
                headers: { 'content-type': 'multipart/form-data' }
            })
            .then(res_1 => {
                if (this.props.is_parent_note) {
                    axios
                        .get(`/api/note/${noteId}/childrenblocks/`)
                        .then(res_2 => {
                            this.patchImage(res_2, res_1['data']);
                        });
                } else {
                    axios
                        .get(
                            `/api/agenda/${this.props.parent_agenda}/childrenblocks/`
                        )
                        .then(res_2 => {
                            this.patchImage(res_2, res_1['data']);
                        });
                }
                // const JSON_data = {
                //     operation_type: 'patch_image',
                //     updated_image: res['data']
                // };
                // console.log(JSON_data);
                // console.log('res.data: ', res.data);

                // this.patchImage()
            })
            .catch(err => console.log(err));
    };

    patchImage = (res, data) => {
        const agendaId = this.props.parent_agenda;
        const noteId = this.props.noteId;
        const socketRef = this.props.socketRef;
        let childrenBlocks = JSON.parse(res['data']['children_blocks']);

        let imageIdx = -1;
        for (let i = 0; i < childrenBlocks.length; i++) {
            let block = childrenBlocks[i];
            if (block['block_type'] == 'Image' && block['id'] == data['id']) {
                imageIdx = i;
                break;
            }
        }

        let imageBlock = childrenBlocks[imageIdx];
        imageBlock.content = data['content'];
        imageBlock.image = data['image'];
        imageBlock.is_submitted = data['is_submitted'];

        childrenBlocks.splice(imageIdx, 1, imageBlock);

        const newBlocks = JSON.stringify(childrenBlocks);
        const JSON_data = {
            operation_type: 'patch_image',
            children_blocks: childrenBlocks
        };

        const stringifiedBlocks = {
            children_blocks: newBlocks
        };
        if (this.props.is_parent_note) {
            axios
                .patch(`/api/note/${noteId}/childrenblocks/`, stringifiedBlocks)
                .then(res => {
                    socketRef.current.state.ws.send(JSON.stringify(JSON_data));
                })
                .catch(err => console.log(err));
        } else {
            axios
                .patch(
                    `/api/agenda/${agendaId}/childrenblocks/`,
                    stringifiedBlocks
                )
                .then(res => {
                    socketRef.current.state.ws.send(JSON.stringify(JSON_data));
                })
                .catch(err => console.log(err));
        }
    };

    render() {
        return (
            <div
                className="full-size-block-container Image"
                onClick={() =>
                    this.props.handleClickBlock(
                        this.props.type,
                        this.props.blk_id
                    )
                }>
                <div className="full-size-block-title">
                    <div className="full-size-block-title__label">Image</div>
                    <button
                        className="delete-button"
                        onClick={this.handleClickDelete}>
                        X
                    </button>
                </div>

                <div className="full-size-block-content Image">
                    {this.state.is_submitted == false ? (
                        <form onSubmit={this.handleSubmit}>
                            <p>
                                <input
                                    type="text"
                                    placeholder="Image Caption"
                                    id="content"
                                    value={this.state.content}
                                    onChange={this.handleChange}
                                />
                            </p>
                            <p>
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/png, image/jpeg"
                                    onChange={this.handleChangeImage}
                                    required
                                />
                            </p>
                            {this.handleSubmitValidation() ? (
                                <input type="submit" value="submit" />
                            ) : (
                                <input
                                    className="disabled"
                                    type="submit"
                                    value="submit"
                                />
                            )}
                        </form>
                    ) : (
                        <div>
                            Image Caption: {this.state.content} <br />
                            Image File Name:{' '}
                            {typeof this.state.image === 'string'
                                ? decodeURI(this.state.image)
                                : decodeURI(this.state.image.name)}
                            {typeof this.state.image === 'string' ? (
                                <img src={this.state.image} />
                            ) : (
                                // <img src="blob:{{MEDIA_URL}}{{this.state.file}}" />
                                /* 개발단계에서 DEBUG=TRUE일 때, 이미지 업로드 되자마자 보여지게 하는 코드 */
                                <img src={this.state.file} />
                            )}
                        </div>
                    )}
                    <div className="full-size-block-content__text"></div>
                </div>
            </div>
        );
    }
}

export default Image;
