import React, { Component } from 'react';

import WorkspaceInfo from '../../component/workspace_leftbar/WorkspaceInfo';

const dummyLeftbar = {
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
        console.log('created');
    }
};
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
                        <WorkspaceInfo props={dummyLeftbar} />
                    </div>
                </div>

                <div className="workspace-main">workspace page</div>
            </div>
        );
    }
}

export default Workspace;
