import React, { Component } from 'react';

import WorkspaceInfo from '../../component/workspace_leftbar/WorkspaceInfo';
import MemberInfo from '../../component/workspace_leftbar/MemberInfo';
import SettingInfo from '../../component/workspace_leftbar/SettingInfo';
import CreateNote from '../../component/workspace_leftbar/CreateNote';

import AgendaOverview from '../../component/workspace_main/AgendaOverview';

/* Dummy Data */
import {
    dummyWI,
    memberList,
    handleInviteMember,
    handleNavigateToSetting,
    handleCreateMeetingNote,
    agendas,
    todos,
    handleToggleTodo,
    handleNavigateToAgenda,
    handleNavigateToTodo
} from './DummyData';

class Workspace extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        const currAgendas = agendas.filter(a => !a.isDone);
        const doneAgendas = agendas.filter(a => a.isDone);

        const doneTodos = todos.filter(t => t.isDone);

        return (
            <div className="workspace">
                <div className="workspace-leftbar">
                    <div className="leftbar-container">
                        <WorkspaceInfo
                            currentWorkspace={dummyWI.currentWorkspace}
                            workspaceList={dummyWI.workspaceList}
                            handleCreateWorkspace={
                                dummyWI.handleCreateWorkspace
                            }
                        />
                        <MemberInfo
                            memberList={memberList}
                            handleInviteMember={handleInviteMember}
                        />
                        <SettingInfo
                            handleNavigateToSetting={handleNavigateToSetting}
                        />
                        <CreateNote
                            handleCreateMeetingNote={handleCreateMeetingNote}
                        />
                    </div>
                </div>

                <div className="workspace-main">
                    <AgendaOverview
                        currAgendas={currAgendas}
                        doneAgendas={doneAgendas}
                        todos={todos}
                        doneTodos={doneTodos}
                        handleToggleTodo={handleToggleTodo}
                        handleNavigateToAgenda={handleNavigateToAgenda}
                        handleNavigateToTodo={handleNavigateToTodo}
                    />
                </div>
            </div>
        );
    }
}

export default Workspace;
