import React from 'react';
import { shallow } from 'enzyme';
import WorkspaceInfo from './WorkspaceInfo';

const emptyStub = {
    admins: [],
    id: -1,
    members: [],
    name: ''
};
const workspaceStub1 = {
    admins: [1],
    id: 1,
    members: [1, 2, 3, 4, 5],
    name: 'test1'
};
const workspaceStub2 = {
    admins: [2],
    id: 2,
    members: [1, 2, 3, 4, 5],
    name: 'test2'
};

const workspacesStub = [workspaceStub1, workspaceStub2];

describe('<WorkspaceInfo />', () => {
    it('should render without error', () => {
        const component = shallow(<WorkspaceInfo workspace={emptyStub} />);
        let wrapper = component.find('.workspaceInfo-container');
        expect(wrapper.length).toBe(1);
    });

    it('render current workspace - 1', () => {
        const component = shallow(
            <WorkspaceInfo
                workspace={workspaceStub1}
                workspaces={workspacesStub}
            />
        );
        let wrapper = component.find('.workspaceInfo__currentWorkspace');
        expect(wrapper.text()).toEqual(workspaceStub1.name.toUpperCase());
    });
    it('render current workspace - 2', () => {
        const component = shallow(
            <WorkspaceInfo workspace={emptyStub} workspaces={workspacesStub} />
        );
        let wrapper = component.find('.workspaceInfo__currentWorkspace');
        expect(wrapper.text()).toEqual('');
    });

    it('render workspace list', () => {
        const mockHistory = { push: jest.fn() };
        const { location } = window;
        delete window.location;
        window.location = { reload: jest.fn() };

        const component = shallow(
            <WorkspaceInfo
                workspace={emptyStub}
                workspaces={workspacesStub}
                history={mockHistory}
            />
        );
        let wrapperListElement = component.find(
            '.workspaceInfo__workspaceList--element'
        );
        expect(wrapperListElement.length).toBe(2);
        let wrapperListFirstElement = component.find(
            '.workspaceInfo__workspaceList--element:first-child'
        );
        wrapperListFirstElement.simulate('click');

        expect(window.location.reload).toHaveBeenCalled();
        expect(mockHistory.push).toHaveBeenCalled();
        window.location = location;
    });
});
