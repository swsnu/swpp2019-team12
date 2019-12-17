import React from 'react';
import { shallow, mount } from 'enzyme';
import Workspace from './Workspace';
import CreateModal from './CreateModal';
import axios from 'axios';

import WorkspaceInfo from '../../component/workspace_leftbar/WorkspaceInfo';
import CreateNote from '../../component/workspace_leftbar/CreateNote';

const mockAdmins = [{ id: 1, nickname: 'test', user: 1 }];
const mockAgendas = [
    {
        children_blocks: '[]',
        content: 'test',
        has_agenda_block: false,
        has_calendar_block: false,
        has_file_block: false,
        has_image_block: false,
        has_table_block: false,
        has_text_block: false,
        has_todo_block: false,
        id: 1,
        is_done: false,
        is_parent_note: true,
        layer_x: 0,
        layer_y: 0,
        note: 28,
        parent_agenda: null,
        tags: []
    }
];
const mockMembers = [{ id: 1, nickname: 'test', user: 1 }];
const mockNotes = [
    {
        children_blocks: '[]',
        created_at: '2019-11-11T04:30:42.493000Z',
        id: 1,
        last_modified_at: '2019-11-11T04:30:42.493000Z',
        location: 'test',
        ml_speech_text: null,
        participants: [1],
        tags: [1],
        title: 'test',
        workspace: 1
    }
];
const mockTodos = [
    {
        assignees: [1],
        content: 'test',
        due_date: '2019-12-16',
        id: 1,
        is_done: false,
        is_parent_note: false,
        layer_x: 0,
        layer_y: 0,
        note: 1,
        parent_agenda: null,
        workspace: null
    }
];
const mockWorkspace = {
    admins: [1],
    id: 1,
    members: [1],
    name: 'test'
};
const mockWorkspaces = [
    {
        admins: [1],
        id: 1,
        members: [1],
        name: 'test'
    }
];
const mockProfile = {
    id: 1,
    nickname: 'test',
    user: 1
};
const mockUser = {
    id: 1,
    email: 'test@test.com'
};

describe('<CreateModal />', () => {
    let component;
    let instance;

    let workspaceComponent;
    let workspaceInstance;

    let mockHistory = { push: jest.fn(), location: { pathname: 'test' } };
    let mockEvent = { stopPropagation: jest.fn() };

    beforeEach(() => {
        delete window.location;
        window.location = { reload: jest.fn() };
        axios.get = jest.fn(url => {
            if (url === '/api/profile/') {
                return new Promise((resolve, reject) => {
                    const result = {
                        status: 200,
                        data: {
                            user: { id: 1, username: 'test' }
                        }
                    };
                    resolve(result);
                });
            } else
                return new Promise((resolve, reject) => {
                    const result = {
                        status: 200,
                        data: {
                            workspaces: mockWorkspaces,
                            workspace: mockWorkspace,
                            admins: mockAdmins,
                            members: mockMembers,
                            agendas: mockAgendas,
                            notes: mockNotes,
                            todos: mockTodos
                        }
                    };
                    resolve(result);
                });
        });
        axios.post = jest.fn(url => {
            if (url === '/api/profile/') {
                return new Promise((resolve, reject) => {
                    const result = {
                        status: 200,
                        data: {
                            mockUser,
                            mockProfile
                        }
                    };
                    resolve(result);
                });
            } else {
                return new Promise((resolve, reject) => {
                    const result = {
                        status: 201,
                        data: {
                            id: mockWorkspace.id,
                            name: mockWorkspace.name
                        }
                    };
                    resolve(result);
                });
            }
        });

        workspaceComponent = shallow(<Workspace history={mockHistory} />);
        workspaceComponent.setState({
            workspaces: [],
            workspace: {},
            admins: [],
            members: [],
            agendas: [],
            notes: [],
            todos: [],

            showCreateNoteModal: false,
            showCreateWorkspaceModal: false
        });
        workspaceComponent.update();
        workspaceInstance = workspaceComponent.instance();

        component = shallow(
            <CreateModal
                history={mockHistory}
                workspaceId={mockWorkspace.id}
                handleCloseCreateNoteModal={
                    workspaceInstance.handleCloseCreateWorkspaceModal
                }
            />
        );
        instance = component.instance();
    });
    afterEach(() => {
        jest.clearAllMocks();
        window.location = location;
    });

    it('should render without error', () => {
        let wrapper = component.find('.createModal');
        expect(wrapper.length).toBe(1);
    });
    it('createModal click stopPropagation', () => {
        let wrapper = component.find('.createModal');

        wrapper.simulate('click', mockEvent);
        expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
    });

    it('after component did mount', async () => {
        await instance.componentDidMount();

        const expected = {
            addedMember: [{ id: 1, username: 'test' }],
            addedMemberId: [1],
            addedAdmin: [{ id: 1, username: 'test' }],
            addedAdminId: [1],

            title: '',
            emailMember: '',
            emailAdmin: '',
            searchedMember: [],
            searchedAdmin: []
        };
        expect(instance.state).toEqual(expected);
    });

    it('render label', () => {
        let wrapper = component.find('.createModal-label');
        expect(wrapper.length).toBe(1);
    });

    it('render title', () => {
        let wrapper = component.find('.createModal-title');
        expect(wrapper.length).toBe(1);

        wrapper = component.find('.createModal-title__input');
        wrapper.simulate('change', { target: { value: 'test' } });

        expect(instance.state.title).toEqual('test');
    });
    it('render modal member', async () => {
        let wrapper = component.find('.createModal-member');
        expect(wrapper.length).toBe(2);

        wrapper = component.find('.createModal-member__input').at(0);
        await wrapper.simulate('change', { target: { value: 'test' } });
        expect(instance.state.emailMember).toEqual('test');
        expect(instance.state.searchedMember).toEqual({
            mockUser,
            mockProfile
        });

        // handleSearch

        await wrapper.simulate('change', { target: { value: '' } });
        expect(instance.state.emailMember).toEqual('');
        expect(instance.state.searchedMember).toEqual([]);

        // handle Search

        component.setState({
            searchedMember: [{ profile: mockProfile, user: mockUser }]
        });
        component.update();

        expect(wrapper.length).toBe(1);
        wrapper = component.find('.createModal-member__member--searched-email');
        expect(wrapper.length).toBe(1);

        wrapper.simulate('click');
        const { addedMember, addedMemberId } = instance.state;
        expect(instance.state).toEqual({
            ...instance.state,
            addedMember,
            addedMemberId,
            emailMember: '',
            searchedMember: []
        });
    });
    it('render modal admin', async () => {
        let wrapper = component.find('.createModal-member');
        expect(wrapper.length).toBe(2);

        wrapper = component.find('.createModal-member__input').at(1);
        await wrapper.simulate('change', { target: { value: 'test' } });
        expect(instance.state.emailAdmin).toEqual('test');
        expect(instance.state.searchedAdmin).toEqual({ mockUser, mockProfile });

        // handle search
        await wrapper.simulate('change', { target: { value: '' } });
        expect(instance.state.emailAdmin).toEqual('');
        expect(instance.state.searchedAdmin).toEqual([]);

        component.setState({
            searchedAdmin: [{ profile: mockProfile, user: mockUser }]
        });
        component.update();

        expect(wrapper.length).toBe(1);
        wrapper = component.find('.createModal-member__member--searched-email');
        expect(wrapper.length).toBe(1);

        wrapper.simulate('click');
        const { addedAdmin, addedAdminId } = instance.state;
        expect(instance.state).toEqual({
            ...instance.state,
            addedAdmin,
            addedAdminId,
            emailAdmin: '',
            searchedAdmin: []
        });
    });

    it('render delete member', () => {
        let wrapper = component.find('.createModal-member__member--added');
        expect(wrapper.length).toBe(2);

        component.setState({
            addedMember: [{ profile: mockProfile, user: mockUser }]
        });
        component.update();

        wrapper = component.find('.createModal-member__member--added-element');
        expect(wrapper.length).toBe(1);

        wrapper.simulate('click');
        expect(instance.state).toEqual({
            ...instance.state,
            addedMember: []
        });
    });

    it('render delete Admin', () => {
        let wrapper = component.find('.createModal-member__member--added');
        expect(wrapper.length).toBe(2);

        component.setState({
            addedAdmin: [{ profile: mockProfile, user: mockUser }]
        });
        component.update();

        wrapper = component.find('.createModal-member__member--added-element');
        expect(wrapper.length).toBe(1);

        wrapper.simulate('click');
        expect(instance.state).toEqual({
            ...instance.state,
            addedAdmin: []
        });
    });

    it('create validation', async () => {
        const invalid = instance.handleCreateValidation();
        expect(invalid).toEqual(false);

        let wrapper = component.find('.createModal-button-container .disabled');
        expect(wrapper.length).toEqual(1);

        component.setState({
            title: 'test',
            addedMember: [mockUser]
        });
        component.update();
        const valid = instance.handleCreateValidation();
        expect(valid).toEqual(true);

        wrapper = component.find('.createModal-button-container .primary');
        expect(wrapper.length).toEqual(1);

        await wrapper.simulate('click');
        expect(mockHistory.push).toHaveBeenCalledTimes(1);
        expect(window.location.reload).toHaveBeenCalledTimes(1);
    });
    it('cancel', async () => {
        let wrapper = component.find(
            '.createModal-button-container .modal-cancel'
        );
        expect(wrapper.length).toEqual(1);

        await wrapper.simulate('click');
        expect(workspaceInstance.state.showCreateWorkspaceModal).toEqual(false);
    });
});
