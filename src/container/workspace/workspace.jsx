import React, { Component } from 'react';

import WorkspaceInfo from '../../component/workspace_leftbar/WorkspaceInfo';
import MemberInfo from '../../component/workspace_leftbar/MemberInfo';
import SettingInfo from '../../component/workspace_leftbar/SettingInfo';
import CreateNote from '../../component/workspace_leftbar/CreateNote';

/**
 * @description Dummy Data
 */
const dummyWI = {
    currentWorkspace: 'SWPP',
    workspaceList: [
        'CHAEMIN',
        'workspace',
        'HOME',
        'CHAEMIN',
        'workspace',
        'HOME',
        'CHAEMIN',
        'workspace',
        'HOME'
    ],
    handleCreateWorkspace: () => {
        console.log('Need to Implement create workspace function');
    }
};

const memberList = [
    {
        nickname: 'CHAEMIN',
        handleShowMember: () => {
            console.log('Need to Implement show member detail function');
        }
    },
    {
        nickname: 'PAUL',
        handleShowMember: () => {
            console.log('Need to Implement show member detail function');
        }
    },
    {
        nickname: 'andra',
        handleShowMember: () => {
            console.log('Need to Implement show member detail function');
        }
    },
    {
        nickname: 'YEIN',
        handleShowMember: () => {
            console.log('Need to Implement show member detail function');
        }
    }
];
const handleInviteMember = () => {
    console.log('Need to Implement invite member function');
};
const handleNavigateToSetting = () => {
    console.log('Need to Implement navigate setting page function');
};
const handleCreateMeetingNote = () => {
    console.log('Need to Implement create meeting note function');
};

/**************   Dummy Data End   **************/

class Workspace extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
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

                <div className="workspace-main">workspace page</div>
            </div>
        );
    }
}

export default Workspace;
