import React, { Component } from 'react';

class Image extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            content: this.props.content,
            is_submitted: false
        };
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    };

    handleChangeImage = () => {
        this.setState({
            image: e.target.files[0]
        });
    };

    // Not Yet Perfectly Understood
    handleSubmit = e => {
        const noteId = this.props.match.params.n_id;
        e.preventDefault();
        let form_data = new FormData();
        form_data.append('image', this.state.image, this.state.image.name);
        form_data.append('content', this.state.content);
        // let url = 'http://localhost:8000/api/note/${noteId}/images'; //NEED TO CHANGE
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
        this.setState({ is_submitted: true });
    };

    render() {
        return (
            <div
                className="full-size-block-container Image"
                onClick={this.props.handleClickBlock}>
                <div className="full-size-block-title">
                    <div className="full-size-block-title__text">Image</div>
                </div>

                <div className="full-size-block-content">
                    {this.state.is_submitted === false ? (
                        <form onSubmit={this.handleSubmit}>
                            <p>
                                <input
                                    type="text"
                                    placeholder="Image Caption"
                                    id="content"
                                    value={this.state.content}
                                    onChange={this.handleChange}
                                    required
                                />
                            </p>
                            <p>
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/png, image/jpeg"
                                    onChange={this.handleImageChange}
                                    required
                                />
                            </p>
                            <input type="submit" />
                        </form>
                    ) : (
                        <div> hello </div>
                    )}
                    <div className="full-size-block-content__text">
                        {this.state.image}
                    </div>
                </div>
            </div>
        );
    }
}

export default Image;
