import React, { Component } from 'react';
import moment from 'moment';
import DateTime from 'react-datetime';
import { Label } from './Label';
import ParticipantInfo from './ParticipantInfo';

class NoteLeftInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isTitleClicked: false,
            isDateClicked: false,
            isLocationClicked: false
        };
    }

    handleConvertTag_Title = () => {
        this.setState({ isTitleClicked: !this.state.isTitleClicked });
    };

    handleConvertTag_Datetime = () => {
        this.setState({ isDateClicked: !this.state.isDateClicked });
    };
    handleConvertTag_Location = () => {
        this.setState({ isLocationClicked: !this.state.isLocationClicked });
    };

    render() {
        return (
            <div className="NoteLeftInfo">
                <div className="NoteLeftInfo-title__container">
                    <div className="NoteLeftInfo__currentNote">
                        <Label title="Meeting Note Title" isTitle />
                        <input
                            className="form-control title"
                            type="text"
                            value={this.props.note_title}
                            // onBlur가 되면 Update API call
                            onBlur={this.handleConvertTag_Title}
                            onChange={this.props.handleChangeTitle}
                        />
                    </div>
                </div>
                <div className="NoteLeftInfo-data-participant__container">
                    <div className="NoteLeftInfo-date__container">
                        <Label title="Meeting Date & Time" />
                        <DateTime
                            value={this.props.moment}
                            onBlur={this.handleConvertTag_Datetime}
                            onChange={this.props.handleChangeDatetime}
                        />
                        <Label title="Location" />
                        <input
                            className="form-control location"
                            type="text"
                            value={this.props.location}
                            // onBlur가 되면 Update API call
                            onBlur={this.handleConvertTag_Location}
                            onChange={this.props.handleChangeLocation}
                        />
                    </div>
                    <ParticipantInfo
                        isRightUnfocused={this.props.isRightUnfocused}
                        participants={this.props.participants}
                    />
                </div>
            </div>
        );
    }
}

export default NoteLeftInfo;
