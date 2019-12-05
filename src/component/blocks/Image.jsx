import React, { Component } from 'react';
import axios from 'axios';

class Image extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blk_id: this.props.blk_id,
            // image: null,
            image: this.props.image,
            content: this.props.content,
            is_submitted: false
        };
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
        let form_data = new FormData();
        // form_data.append('image', this.state.image, this.state.image.name);
        form_data.append('image', this.state.image, this.state.image.name);
        form_data.append('content', this.state.content);

        axios
            .patch(`/api/image/${this.state.blk_id}/`, form_data, {
                headers: { 'content-type': 'multipart/form-data' }
            })
            .then(res => {
                console.log('i am here');
                console.log(res.data);
                this.setState({
                    is_submitted: true
                });
            })
            .catch(err => console.log(err));
    };

    render() {
        console.log('submitted: ' + this.state.is_submitted);
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
                            {/* Image File Name: {this.state.image} */}
                            {/* <br />I am : {this.state.file} */}
                            {/* <img src={this.state.file} /> */}
                        </div>
                    )}
                    <div className="full-size-block-content__text"></div>
                </div>
            </div>
        );
    }
}

export default Image;
