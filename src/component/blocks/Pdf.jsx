import React, {Component} from 'react'

class Pdf extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: this.props.content
        }
    }

    handleClickToDetail = () => {
        console.log("Need to implement changing to Detail mode from PDF view");
    }

    render() {
        return (
            <div className="full-size-block-container Pdf">
                <div className="full-size-block-title">
                    <div className="full-size-block-title__text">PDF</div>
                </div>
                <div className="full-size-block-content">
                    <div className="full-size-block-content__text">{this.state.content}</div>
                </div>
            </div>
        )
    }
}

export default Pdf
