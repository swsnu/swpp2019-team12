import React, { Component } from 'react';
import axios from 'axios';

import WorkspaceInfo from '../../component/workspace_leftbar/WorkspaceInfo';
import MemberInfo from '../../component/workspace_leftbar/MemberInfo';
// import SettingInfo from '../../component/workspace_leftbar/SettingInfo';
import CreateNote from '../../component/workspace_leftbar/CreateNote';

import AgendaOverview from '../../component/workspace_main/AgendaOverview';
import MeetingNoteOverview from '../../component/workspace_main/MeetingNoteOverview';

import CreateNoteModal from '../note/CreateModal';
import CreateWorkspaceModal from './CreateModal';
import UserInfo from '../../component/workspace_leftbar/Userinfo';

class Workspace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            workspaces: [],
            workspace: {},
            admins: [],
            members: [],
            agendas: [],
            notes: [],
            todos: [],

            showCreateNoteModal: false,
            showCreateWorkspaceModal: false
        };
    }

    componentDidMount() {
        const loggedInUserNickname = sessionStorage.getItem(
            'LoggedInUserNickname'
        );
        if (!loggedInUserNickname) {
            this.props.history.push('/signin');
        }

        const {
            history: {
                location: { pathname }
            }
        } = this.props;
        const id = pathname.split('/')[2];

        axios.get(`/api/workspace/${id}/`).then(res => {
            const { data } = res;
            console.log(data);
            const {
                workspaces,
                workspace,
                admins,
                members,
                agendas,
                notes,
                todos
            } = data;
            this.setState({
                workspaces,
                workspace,
                admins,
                members,
                agendas,
                notes,
                todos
            });
        });
    }

    handleShowCreateNoteModal = () => {
        this.setState({ showCreateNoteModal: true });
    };
    handleCloseCreateNoteModal = () => {
        this.setState({ showCreateNoteModal: false });
    };

    handleShowCreateWorkspaceModal = () => {
        this.setState({ showCreateWorkspaceModal: true });
    };
    handleCloseCreateWorkspaceModal = () => {
        this.setState({ showCreateWorkspaceModal: false });
    };

    render() {
        const {
            workspaces,
            workspace,
            members,
            agendas,
            notes,
            todos,

            showCreateNoteModal,
            showCreateWorkspaceModal
        } = this.state;
        const { history } = this.props;

        const currAgendas = agendas.filter(a => !a.is_done);
        const doneAgendas = agendas.filter(a => a.is_done);

        const doneTodos = todos.filter(t => t.is_done);

        return (
            <div className="workspace">
                <div className="workspace-leftbar">
                    <div className="leftbar-container">
                        <UserInfo history={history} />
                        <WorkspaceInfo
                            history={history}
                            workspace={workspace}
                            workspaces={workspaces}
                            handleShowCreateWorkspaceModal={
                                this.handleShowCreateWorkspaceModal
                            }
                        />
                        <MemberInfo members={members} workspace={workspace} />
                        {/* <SettingInfo /> */}
                        <CreateNote
                            handleShowCreateNoteModal={
                                this.handleShowCreateNoteModal
                            }
                        />
                    </div>
                </div>

                <div className="workspace-main">
                    <AgendaOverview
                        currAgendas={currAgendas}
                        doneAgendas={doneAgendas}
                        todos={todos}
                        doneTodos={doneTodos}
                    />
                    <MeetingNoteOverview notes={notes} history={history} />
                </div>

                {showCreateNoteModal && (
                    <div
                        className="overlay"
                        onClick={this.handleCloseCreateNoteModal}>
                        <CreateNoteModal
                            history={history}
                            workspaceId={workspace.id}
                            handleCloseCreateNoteModal={
                                this.handleCloseCreateNoteModal
                            }
                        />
                    </div>
                )}

                {showCreateWorkspaceModal && (
                    <div
                        className="overlay"
                        onClick={this.handleCloseCreateWorkspaceModal}>
                        <CreateWorkspaceModal
                            history={history}
                            workspaceId={workspace.id}
                            handleCloseCreateNoteModal={
                                this.handleCloseCreateWorkspaceModal
                            }
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default Workspace;
