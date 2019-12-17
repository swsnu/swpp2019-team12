import React from 'react';
import { shallow } from 'enzyme';
import Workspace from '../../container/workspace/Workspace';
import CreateModal from './CreateModal';
import axios from 'axios';
import Datetime from 'react-datetime';
import moment from 'moment';

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
            ...instance.state,
            addedParticipant: [{ id: 1, username: 'test' }]
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

    it('render datetime', () => {
        let now = moment();
        let wrapper = component.find('.createModal-datetime');
        expect(wrapper.length).toBe(1);

        instance.handleChangeDatetime(now);
        expect(instance.state.datetime).toEqual(now.toISOString());
    });
    it('render location', () => {
        let wrapper = component.find('.createModal-location');
        expect(wrapper.length).toBe(1);

        wrapper = component.find('.createNoteModal-location__input');
        wrapper.simulate('change', { target: { value: 'test' } });

        expect(instance.state.location).toEqual('test');
    });

    it('render participant', async () => {
        let wrapper = component.find('.createModal-member');
        expect(wrapper.length).toBe(1);

        wrapper = component.find('.createModal-member__input');
        await wrapper.simulate('change', { target: { value: 'test' } });
        expect(instance.state.email).toEqual('test');
        expect(instance.state.searchedParticipant).toEqual({
            mockUser,
            mockProfile
        });

        // handleSearch

        await wrapper.simulate('change', { target: { value: '' } });
        expect(instance.state.email).toEqual('');
        expect(instance.state.searchedParticipant).toEqual([]);

        // handle Search

        component.setState({
            searchedParticipant: [{ profile: mockProfile, user: mockUser }]
        });
        component.update();

        expect(wrapper.length).toBe(1);
        wrapper = component.find('.createModal-member__member--searched-email');
        expect(wrapper.length).toBe(1);

        wrapper.simulate('click');
        const { addedParticipant } = instance.state;
        expect(instance.state).toEqual({
            ...instance.state,
            addedParticipant,
            email: '',
            searchedParticipant: []
        });
    });

    it('render delete member', () => {
        let wrapper = component.find('.createModal-member__member--added');
        expect(wrapper.length).toBe(1);

        component.setState({
            addedParticipant: [{ profile: mockProfile, user: mockUser }]
        });
        component.update();

        wrapper = component.find('.createModal-member__member--added-element');
        expect(wrapper.length).toBe(1);

        wrapper.simulate('click');
        expect(instance.state).toEqual({
            ...instance.state,
            addedParticipant: []
        });
    });

    it('create validation', async () => {
        const invalid = instance.handleCreateValidation();
        expect(invalid).toEqual(false);

        let wrapper = component.find('.createModal-button-container .disabled');
        expect(wrapper.length).toEqual(1);

        component.setState({
            title: 'test',
            addedParticipant: [mockUser]
        });
        component.update();
        const valid = instance.handleCreateValidation();
        expect(valid).toEqual(true);

        wrapper = component.find('.createModal-button-container .primary');
        expect(wrapper.length).toEqual(1);

        await wrapper.simulate('click');
        expect(mockHistory.push).toHaveBeenCalledTimes(1);

        component.setState({
            datetime: ''
        });
        component.update();

        await wrapper.simulate('click');
        expect(mockHistory.push).toHaveBeenCalledTimes(2);
    });

    it('cancel', async () => {
        let wrapper = component.find(
            '.createModal-button-container .modal-cancel'
        );
        expect(wrapper.length).toEqual(1);

        await wrapper.simulate('click');
        expect(workspaceInstance.state.showCreateNoteModal).toEqual(false);
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
});
