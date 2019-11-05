import React, { Component } from 'react';
// import SearchInput, { createFilter } from 'react-search-input';
import { map, uniqBy, differenceBy } from 'lodash';
import axios from 'axios';

// const KEYS_TO_FILTERS = ['user.email'];

const CreateModalParticipant = props => {
    const {
        email,
        searchedParticipant,
        addedParticipant,
        handleChangeEmail,
        handleSelectParticipant,
        handleDeleteParticipant
    } = props;
    return (
        <div className="createModal-member">
            <div className="createModal-member__sublabel">Participants</div>
            <div className="createModal-member__input-container">
                <input
                    type="email"
                    placeholder="user_email @ email.com"
                    className="createModal-member__input"
                    value={email}
                    onChange={e => handleChangeEmail(e)}
                />
                {searchedParticipant.length > 0 && (
                    <div className="createModal-member__member--searched">
                        {map(searchedParticipant, (participant, i) => (
                            <div
                                key={i}
                                className="createModal-member__member--searched-email"
                                onClick={() =>
                                    handleSelectParticipant(participant)
                                }>
                                {participant.username}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="createModal-member__member--added createNoteModal-member__member--added">
                {map(addedParticipant, (participant, i) => (
                    <div
                        key={i}
                        className="createModal-member__member--added-element"
                        onClick={() => handleDeleteParticipant(participant)}>
                        {participant.username}
                    </div>
                ))}
            </div>
        </div>
    );
};

class InviteMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            date: new Date(),
            datetime: '',
            location: '',
            agendaNumber: 1,
            email: '',
            searchedParticipant: [],
            addedParticipant: []
        };
    }
    //     constructor(props) {
    //         super(props);
    //         this.state = {
    //             searchKeyword: ''
    //         };
    //         this.searchUpdated = this.searchUpdated.bind(this);
    //     }

    //     searchUpdated(term) {
    //         this.setState({ searchKeyword: term });
    //     }
    handleSearchParticipant = () => {
        const { email } = this.state;
        const { workspaceId } = this.props;
        if (email) {
            axios.get(`/api/user/${email}/${workspaceId}`).then(res => {
                const { data } = res;
                this.setState({ searchedParticipant: data });
            });
        } else {
            this.setState({ searchedParticipant: [] });
        }
    };

    render() {
        const {
            title,
            location,
            email,
            addedParticipant,
            searchedParticipant
        } = this.state;

        //         const filteredEmails = emails.filter(
        //             createFilter(this.state.searchKeyword, KEYS_TO_FILTERS)
        //         );
        return (
            //                 <SearchInput
            //                     className="search-input"
            //                     onChange={this.searchUpdated}
            //                 />
            //                 {filteredEmails.map(email => {
            //                     return (
            //                         <div className="mail" key={email.id}>
            //                             {email.user.name}
            //                         </div>
            //                     );
            //                 })}
            //             </div>
            <div className="memberInfo__inviteMemberButton">
                {/* <CreateModalParticipant
                    email={email}
                    searchedParticipant={searchedParticipant}
                    addedParticipant={addedParticipant}
                    handleChangeEmail={this.handleChangeEmail}
                    handleSelectParticipant={this.handleSelectParticipant}
                    handleDeleteParticipant={this.handleDeleteParticipant}
                /> */}
                <button className="secondary">Invite Member</button>
            </div>
        );
    }
}

export default InviteMember;
