import React from 'react';
import { map } from 'lodash';

import { Label, SubLabel } from './Label';

const WorkspaceInfo = ({ props }) => {
    const {
        currentWorkspace: workspace,
        workspaceList,
        handleCreateWorkspace
    } = props;

    return (
        <div className="leftbar-component workspaceInfo-container">
            <Label title="Workspace" />

            <div className="workspaceInfo__currentWorkspace">{workspace}</div>

            <SubLabel title="Select Workspace" />

            <div className="workspaceInfo__workspaceList">
                {map(workspaceList, w => (
                    <div className="workspaceInfo__workspaceList--element">
                        {w.toUpperCase()}
                    </div>
                ))}
            </div>

            <SubLabel title="Create Workspace" />

            <div className="workspaceInfo__workspaceCreateButton">
                <button className="secondary" onClick={handleCreateWorkspace}>
                    Create Workspace
                </button>
            </div>
        </div>
    );
};

export default WorkspaceInfo;
