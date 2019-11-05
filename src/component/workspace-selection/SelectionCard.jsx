import React from 'react';
import { ReactComponent as PlusIcon } from '../../assets/icons/plus_icon.svg';

export const WorkspaceSelectionCard = props => {
    const { admin, workspace, handleNavigateWorkspace } = props;
    const { name, members } = workspace;
    const [first_admin] = admin;
    return (
        <div
            className="workspaceSelection-card"
            onClick={() => handleNavigateWorkspace(workspace)}
        >
            <div className="workspaceSelection-card__label">TITLE</div>
            <div className="workspaceSelection-card__name">
                <span>{name}</span>
            </div>

            <div className="workspaceSelection-card__member-admin-container">
                <div className="workspaceSelection-card__admin-container">
                    <div className="workspaceSelection-card__label">ADMIN</div>
                    <div className="workspaceSelection-card__admin">{`${first_admin.nickname}`}</div>
                </div>
                <div className="workspaceSelection-card__member-container">
                    <div className="workspaceSelection-card__label">MEMBER</div>
                    <div className="workspaceSelection-card__member">{`${members.length} 명`}</div>
                </div>
            </div>
        </div>
    );
};

export const WorkspaceCreationCard = props => {
    const { handleNavigateToWorkspaceCreateModal } = props;
    return (
        <div
            className="workspaceCreation-card"
            onClick={handleNavigateToWorkspaceCreateModal}
        >
            <PlusIcon className="workspaceCreation-card__icon" />
        </div>
    );
};
