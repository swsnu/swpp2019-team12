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

    componentDidMount() {
        console.log('did mount');
        this.setState({
            is_submitted: this.props.is_submitted,
            content: this.props.content,
            image: this.props.image
        });
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
        const axios_path = `/api/image/${this.state.blk_id}/`;
        this.props.handleDeleteBlock(axios_path, 'Image', this.state.blk_id);
    };

    handleSubmitValidation = () => {
        const { image } = this.state;
        return image !== null;
    };

    handleSubmit = e => {
        e.preventDefault();
        let form_data = new FormData();
        form_data.append('image', this.state.image, this.state.image.name);
        form_data.append('content', this.state.content);

        axios
            .patch(`/api/image/${this.state.blk_id}/`, form_data, {
                headers: { 'content-type': 'multipart/form-data' }
            })
            .then(res => {
                console.log('res.data: ', res.data);
                this.setState({
                    is_submitted: true
                });
            })
            .catch(err => console.log(err));
    };

    render() {
        console.log('render: ' + this.state.image);
        console.log('is submitted ', this.state.is_submitted);
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
                    {/* <div className="full-size-block-content__text"></div> */}
                </div>
            </div>
        );
    }
}

export default Image;
