import React from 'react';
import { map } from 'lodash';

import { Label, SubLabel } from './Label';

const WorkspaceInfo = props => {
    const { workspace, workspaces, history } = props;

    return (
        <div className="leftbar-component workspaceInfo-container">
            <Label title="Workspace" />

            <div className="workspaceInfo__currentWorkspace">
                {workspace.name ? workspace.name.toUpperCase() : ''}
            </div>

            <SubLabel title="Select Workspace" />

            <div className="workspaceInfo__workspaceList">
                {map(workspaces, (w, i) => (
                    <div
                        key={i}
                        onClick={() => {
                            history.push(`/${w.name}/${w.id}/`);
                            window.location.reload();
                        }}
                        className="workspaceInfo__workspaceList--element"
                    >
                        {w.name.toUpperCase()}
                    </div>
                ))}
            </div>

            <SubLabel title="Create Workspace" />

            <div className="workspaceInfo__workspaceCreateButton">
                <button className="secondary">Create Workspace</button>
            </div>
        </div>
    );
};

export default WorkspaceInfo;
