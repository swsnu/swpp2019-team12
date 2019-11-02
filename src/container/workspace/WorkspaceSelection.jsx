import React, { Component } from 'react';
import { map } from 'lodash';
import { workspaces } from './DummyData';
import {
    WorkspaceSelectionCard,
    WorkspaceCreationCard
} from '../../component/workspace-selection/SelectionCard';
import CreateModal from './CreateModal';

class WorkspaceSelection extends Component {
    constructor(props) {
        super(props);
        this.state = { creation: false };
    }

    componentDidMount() {}

    handleNavigateWorkspace = (id, name) => {
        const { history } = this.props;
        history.push({
            pathname: `${name}/${id}`,
            state: { id }
        });
    };
    handleNavigateToWorkspaceCreateModal = () => {
        this.setState({ creation: true });
    };
    handleCancel = () => {
        this.setState({ creation: false });
    };

    render() {
        const { creation } = this.state;
        return (
            <div className="workspaceSelection">
                <div className="workspaceSelection__label">
                    Select Workspace
                </div>
                <div className="workspaceSelection__workspace-container">
                    {map(workspaces, (workspace, i) => (
                        <WorkspaceSelectionCard
                            key={i}
                            id={workspace.id}
                            name={workspace.name}
                            members={workspace.members.length}
                            admin={workspace.admin.nickname}
                            handleNavigateWorkspace={
                                this.handleNavigateWorkspace
                            }
                        />
                    ))}
                    <WorkspaceCreationCard
                        handleNavigateToWorkspaceCreateModal={
                            this.handleNavigateToWorkspaceCreateModal
                        }
                        handleCancel={this.handleCancel}
                    />
                </div>

                {creation && (
                    <div className="overlay" onClick={this.handleCancel}>
                        <CreateModal handleCancel={this.handleCancel} />
                    </div>
                )}
            </div>
        );
    }
}

export default WorkspaceSelection;
