import React, {Component} from 'react'

class PreviewAgenda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            agenda_title: this.props.agenda_title,
            agenda_disccusion: this.props.agenda_disccusion,

        }
    }

    handleClickToDetail = () => {
        console.log("Need to implement changing to Detail mode from preview mode");
    }

    render() {
        return (
            <div 
                className="full-size-block-container PreviewAgenda"
            >
                <div 
                    className="full-size-block-title PreviewAgenda"
                    onClick={this.props.handleClickAgenda}
                >
                    <div className="full-size-block-title__text PreviewAgenda">Preview Agenda</div>
                </div>
                <div className="full-size-block-content PreviewAgenda">
                    <div className="full-size-block-content__text PreviewAgenda">{this.state.agenda_disccusion}</div>
                </div>
            </div>
        )
    }
}

export default PreviewAgenda
