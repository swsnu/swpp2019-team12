import React from 'react';
import { shallow } from 'enzyme';
import WorkspaceSelection from './WorkspaceSelection';
import axios from 'axios';

import {
    WorkspaceSelectionCard,
    WorkspaceCreationCard
} from '../../component/workspace-selection/SelectionCard';
import CreateModal from './CreateModal';

const mockAdmin = [
    { id: 1, nickname: 'test', user: 1 },
    { id: 2, nickname: 'test', user: 2 }
];
const mockWorkspaces = [
    { id: 1, name: 'test', admins: [1, 2], members: [1, 2] },
    { id: 2, name: 'test', admins: [1, 2], members: [1, 2] }
];
describe('<WorkspaceSelection />', () => {
    let component;
    let instance;
    let mockHistory = { push: jest.fn() };

    beforeEach(() => {
        component = shallow(<WorkspaceSelection history={mockHistory} />);
        axios.get = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200,
                    data: { workspaces: mockWorkspaces, admins: mockAdmin }
                };
                resolve(result);
            });
        });

        component.setState({ creation: false, workspaces: [] });
        component.update();

        instance = component.instance();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without error', () => {
        let wrapper = component.find('.workspaceSelection');
        expect(wrapper.length).toBe(1);
    });

    it('session test - logged out', () => {
        instance.componentDidMount();
        expect(mockHistory.push).toHaveBeenCalledTimes(1);
    });
    it('session test - logged in', () => {
        sessionStorage.setItem('LoggedInUserNickname', 'test');
        instance.componentDidMount();
        expect(mockHistory.push).toHaveBeenCalledTimes(0);
        sessionStorage.clear();
    });

    it('should render without error workspaces', () => {
        instance.componentDidMount();

        axios.get(res => {
            const { data } = res;
            component.setState({
                workspaces: data.workspaces,
                admins: data.admin
            });
            component.update();

            let wrapper = component.find(
                '.workspaceSelection__workspace-container'
            );
            expect(wrapper.children().length).toBe(3);
        });
        // done();
    });

    it('handleNavigateWorkspace', async () => {
        instance.componentDidMount();

        await axios.get('');

        const { workspaces } = instance.state;
        const card = shallow(
            <WorkspaceSelectionCard
                key={0}
                admin={workspaces[0].admins}
                workspace={workspaces[0]}
                handleNavigateWorkspace={instance.handleNavigateWorkspace}
            />
        );
        card.simulate('click');

        expect(mockHistory.push).toHaveBeenCalledTimes(2);
    });
    it('handleNavigateWorkspaceCreateModal', async () => {
        instance.componentDidMount();

        await axios.get('');

        const card = shallow(
            <WorkspaceCreationCard
                handleNavigateToWorkspaceCreateModal={
                    instance.handleNavigateToWorkspaceCreateModal
                }
                handleCancel={instance.handleCancel}
            />
        );
        card.simulate('click');

        expect(instance.state.creation).toEqual(true);
    });

    it('handleCancel', async () => {
        instance.componentDidMount();

        await axios.get('');

        const card = shallow(
            <CreateModal
                history={mockHistory}
                handleCancel={instance.handleCancel}
            />
        );
        card.find('.modal-cancel').simulate('click');

        expect(instance.state.creation).toEqual(false);
    });

    it('handleCancel', () => {
        instance.componentDidMount();
        instance.setState({ creation: true });

        component.find('.overlay').simulate('click');
        expect(instance.state.creation).toEqual(false);
    });

    it('should render without error create modal', () => {
        instance.componentDidMount();

        component.setState({ creation: true });
        component.update();
        let wrapper = component.find('.overlay');
        expect(wrapper.length).toBe(1);
    });
});
