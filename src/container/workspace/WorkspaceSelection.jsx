import React, { Component } from 'react';
import { map } from 'lodash';
import {
    WorkspaceSelectionCard,
    WorkspaceCreationCard
} from '../../component/workspace-selection/SelectionCard';
import CreateModal from './CreateModal';
import axios from 'axios';
import Signout from '../../component/signout/Signout';

class WorkspaceSelection extends Component {
    constructor(props) {
        super(props);
        this.state = { creation: false, workspaces: [] };
    }

    componentDidMount() {
        const loggedInUserNickname = sessionStorage.getItem(
            'LoggedInUserNickname'
        );
        if (!loggedInUserNickname) {
            this.props.history.push('/signin');
        }

        axios.get('/api/workspace/').then(res => {
            const { data } = res;
            const { workspaces, admins } = data;
            this.setState({ workspaces, admins });
        });
    }

    handleNavigateWorkspace = workspace => {
        const { history } = this.props;
        const { name, id } = workspace;
        history.push({
            pathname: `${name}/${id}`,
            state: { workspace }
        });
    };
    handleNavigateToWorkspaceCreateModal = () => {
        this.setState({ creation: true });
    };
    handleCancel = () => {
        this.setState({ creation: false });
    };

    render() {
        const { creation, workspaces, admins } = this.state;
        const { history } = this.props;
        return (
            <div className="workspaceSelection">
                <Signout history={history} />
                <div className="workspaceSelection__label">
                    Select Workspace
                </div>
                <div className="workspaceSelection__workspace-container">
                    {map(workspaces, (workspace, i) => {
                        const admin = admins[i];
                        return (
                            <WorkspaceSelectionCard
                                key={i}
                                admin={admin}
                                workspace={workspace}
                                handleNavigateWorkspace={
                                    this.handleNavigateWorkspace
                                }
                            />
                        );
                    })}
                    <WorkspaceCreationCard
                        handleNavigateToWorkspaceCreateModal={
                            this.handleNavigateToWorkspaceCreateModal
                        }
                        handleCancel={this.handleCancel}
                    />
                </div>

                {creation && (
                    <div className="overlay" onClick={this.handleCancel}>
                        <CreateModal
                            history={history}
                            handleCancel={this.handleCancel}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default WorkspaceSelection;
