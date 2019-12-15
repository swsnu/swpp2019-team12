import React, { Component } from 'react';
import { map } from 'lodash';
// import { ReactComponent as UserIcon } from '../../assets/icons/member_default_icon.svg';
import { Label } from './Label';

class ParticipantInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            participants_nicknames: []
        };
    }

    render() {
        return (
            <div className="NoteLeftInfo-participants__container">
                <div className="Participants-title__container">
                    <Label title="Participants" />
                </div>
                <div className="NoteLeftInfo__participantList">
                    {map(this.props.participants, (p, i) => {
                        return (
                            <div
                                key={i}
                                className="NoteLeftInfo__participantList--element">
                                {/* <UserIcon className="NoteLeftInfo__participantList--element-icon"/> */}
                                <div className="NoteLeftInfo__participantList--element-name">
                                    {p.nickname}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default ParticipantInfo;
