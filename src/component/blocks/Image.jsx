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

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
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
        console.log('delete image');
        const axios_path = `/api/image/${this.state.blk_id}/`;
        this.props.handleDeleteBlock(axios_path, 'Image', this.state.blk_id);
    };

    handleSubmit = e => {
        e.preventDefault();
        const noteId = this.props.noteId;

        let form_data = new FormData();
        form_data.append('image', this.state.image, this.state.image.name);
        form_data.append('content', this.state.content);
        this.setState({ is_submitted: true });
        axios
            .post(`/api/note/${noteId}/images/`, form_data, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
            .then(res => {
                console.log(res.data);
            })
            .catch(err => console.log(err));
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

                <div className="full-size-block-content">
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
                            <input type="submit" value="submit" />
                        </form>
                    ) : (
                        <div>
                            Image Caption: {this.state.content} <br />
                            Image File Name: {this.state.image.name}
                            <img src={this.state.file} />
                        </div>
                    )}
                    <div className="full-size-block-content__text"></div>
                </div>
            </div>
        );
    }
}

export default Image;
