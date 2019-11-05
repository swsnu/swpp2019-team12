import React, { Component } from 'react';
import { map } from 'lodash';
// import { ReactComponent as UserIcon } from '../../assets/icons/member_default_icon.svg';
import { Label } from './Label';


class ParticipantInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            participants: this.props.participants
        }
    }

    handleAddParticipant = () => {
        console.log("Need to implement add Participant who is a member of specific workspace")
    }
    
    render() {
        return (
                <div className="NoteLeftInfo-participants__container">
                    <div className="Participants-title__container">         
                        <Label title="Participants" />
                        <button
                                className="add_participant"
                                onClick={this.handleAddParticipant}    
                        >
                            +
                        </button>
                    </div>   
                    <div className="NoteLeftInfo__participantList">
                        {map(this.state.participants, (p, i) => (
                            <div 
                                key={i}
                                className="NoteLeftInfo__participantList--element"
                            >
                                {/* <UserIcon className="NoteLeftInfo__participantList--element-icon"/> */}
                                <div className="NoteLeftInfo__participantList--element-name">
                                    {p.nickname}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>  
        );
    }
}

export default ParticipantInfo;