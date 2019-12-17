import React, { Component } from 'react';
import Datetime from 'react-datetime';
import axios from 'axios';
import { map, uniqBy, differenceBy } from 'lodash';

class CreateModal extends Component {
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

    componentDidMount() {
        axios.get('/api/profile/').then(res => {
            const {
                data: { user }
            } = res;
            this.setState({ addedParticipant: [user] });
        });
        const loggedInUserNickname = sessionStorage.getItem(
            'LoggedInUserNickname'
        );
        if (!loggedInUserNickname) {
            this.props.history.push('/signin');
        }
    }

    CreateModalLabel = () => {
        return (
            <div className="createModal-label">
                <div className="createModal-label__sublabel">
                    Basic Information
                </div>
                <div className="createModal-label__label">Create Note</div>
            </div>
        );
    };

    CreateModalTitle = props => {
        const { title, handleChangeTitle } = props;
        return (
            <div className="createModal-title createNoteModal-title">
                <div className="createModal__sublabel">Meeting Note Name</div>
                <input
                    type="text"
                    placeholder="Meeting Note 이름을 입력하세요"
                    className="createModal-title__input  createNoteModal-title__input"
                    value={title}
                    onChange={e => handleChangeTitle(e)}
                />
            </div>
        );
    };

    CreateModalDatetime = props => {
        const date = new Date();
        const { handleChangeDatetime } = props;

        return (
            <div className="createModal-datetime createNoteModal-datetime">
                <div className="createModal__sublabel">Datetime</div>
                <Datetime defaultValue={date} onChange={handleChangeDatetime} />
            </div>
        );
    };

    CreateModalLocation = props => {
        const { location, handleChangeLocation } = props;
        return (
            <div className="createModal-location createNoteModal-location">
                <div className="createModal__sublabel">Meeting Location</div>
                <input
                    type="text"
                    placeholder="회의 장소를 입력하세요"
                    className="createNoteModal-location__input"
                    value={location}
                    onChange={e => handleChangeLocation(e)}
                />
            </div>
        );
    };

    CreateModalParticipant = props => {
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
                                        handleSelectParticipant(
                                            participant.user
                                        )
                                    }>
                                    {participant.user.username}
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
                            onClick={() =>
                                handleDeleteParticipant(participant)
                            }>
                            {participant.username}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    handleChangeTitle = e => {
        this.setState({ title: e.target.value });
    };

    handleChangeDatetime = datetime => {
        this.setState({ datetime: datetime.toISOString() });
    };

    handleChangeLocation = e => {
        this.setState({ location: e.target.value });
    };

    handleChangeAgendaNumber = e => {
        this.setState({ agendaNumber: e.target.value });
    };

    handleChangeEmail = e => {
        this.setState({ email: e.target.value }, this.handleSearchParticipant);
    };

    handleSearchParticipant = () => {
        const { email } = this.state;
        const { workspaceId } = this.props;
        if (email) {
            axios
                .post('/api/profile/', {
                    username: email,
                    workspace_id: workspaceId
                })
                .then(res => {
                    const { data } = res;
                    this.setState({ searchedParticipant: data });
                });
        } else {
            this.setState({ searchedParticipant: [] });
        }
    };

    handleSelectParticipant = participant => {
        const addedParticipant = uniqBy(
            [...this.state.addedParticipant, participant],
            'id'
        );
        this.setState({ addedParticipant, email: '', searchedParticipant: [] });
    };
    handleDeleteParticipant = participant => {
        const removedParticipant = differenceBy(
            this.state.addedParticipant,
            [participant],
            'id'
        );
        this.setState({ addedParticipant: removedParticipant });
    };

    handleCreateValidation = () => {
        const { title, agendaNumber, addedParticipant } = this.state;
        return !!(title && addedParticipant.length && agendaNumber >= 1);
    };

    handleCreateNote = () => {
        const {
            title,
            location,
            addedParticipant,
            date,
            datetime
        } = this.state;
        const { workspaceId, history } = this.props;

        axios
            .post(`/api/workspace/${workspaceId}/notes/`, {
                title,
                participants: addedParticipant.map(p => p.username),
                createdAt: datetime ? datetime : date.toISOString(),
                lastModifiedAt: datetime ? datetime : date.toISOString(),
                location,
                workspace: workspaceId
            })
            .then(res => {
                const {
                    status,
                    data: { id }
                } = res;

                if (status === 201) {
                    history.push(`/note/${id}`);
                    // window.location.reload();
                }
            });
    };

    render() {
        const {
            title,
            location,
            email,
            addedParticipant,
            searchedParticipant
        } = this.state;
        const { handleCloseCreateNoteModal } = this.props;
        return (
            <div
                className="createModal overlayChild"
                onClick={e => e.stopPropagation()}>
                {this.CreateModalLabel()}
                {this.CreateModalTitle({
                    title,
                    handleChangeTitle: this.handleChangeTitle
                })}
                <div className="createModal__element-container">
                    {this.CreateModalDatetime({
                        handleChangeDatetime: this.handleChangeDatetime
                    })}
                    {this.CreateModalLocation({
                        location,
                        handleChangeLocation: this.handleChangeLocation
                    })}
                </div>
                {this.CreateModalParticipant({
                    history,
                    email: email,
                    searchedParticipant: searchedParticipant,
                    addedParticipant: addedParticipant,
                    handleChangeEmail: this.handleChangeEmail,
                    handleSelectParticipant: this.handleSelectParticipant,
                    handleDeleteParticipant: this.handleDeleteParticipant
                })}

                <div className="createModal-button-container">
                    <button onClick={handleCloseCreateNoteModal}>CANCEL</button>
                    {this.handleCreateValidation() ? (
                        <button
                            className="primary"
                            onClick={this.handleCreateNote}>
                            CONFIRM
                        </button>
                    ) : (
                        <button className="disabled">CONFIRM</button>
                    )}
                </div>
            </div>
        );
    }
}

export default CreateModal;
