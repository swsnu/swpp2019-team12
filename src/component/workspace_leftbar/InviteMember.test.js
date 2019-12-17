import React from 'react';
import { mount } from 'enzyme';
import InviteMember from './InviteMember';
import axios from 'axios';

const memberStub1 = {
    profile: {
        id: 1,
        nickname: 'TEST1',
        user: 1
    },
    user: {
        id: 1,
        username: 'test1@test.com'
    }
};
const memberStub2 = {
    profile: {
        id: 2,
        nickname: 'TEST2',
        user: 2
    },
    user: {
        id: 2,
        username: 'test2@test.com'
    }
};

const membersStub = {
    id: 1,
    nickname: 'TEST1',
    user: 1
};

const searchedMemberStub = [memberStub1, memberStub2];
const addedMemberStub = [{ id: 2, username: 'test2@test.com' }];
const workspaceStub = {
    admins: [],
    id: 100000,
    members: [],
    name: 'TEST'
};

describe('<InviteMember />', () => {
    beforeEach(() => {
        axios.post = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    data: {
                        searchedMember: searchedMemberStub
                    }
                };
                resolve(result);
            });
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without error', () => {
        const component = mount(<InviteMember members={membersStub} />);
        let wrapper = component.find('.memberInfo__inviteMemberButton');
        expect(wrapper.length).toBe(1);
    });

    it('should render without error - 2', () => {
        const component = mount(<InviteMember members={[]} />);
        component.setState({ searchedMember: [] });
        component.update();

        let wrapper;

        wrapper = component.find('.invite-member__member--searched');
        expect(wrapper.length).toBe(0);
        wrapper = component.find('.invite-member__member--searched-email');
        expect(wrapper.length).toBe(0);
    });

    it('should render without error - 3', () => {
        const component = mount(<InviteMember members={searchedMemberStub} />);
        component.setState({ searchedMember: searchedMemberStub });
        component.update();

        let wrapper;

        wrapper = component.find('.invite-member__member--searched');
        expect(wrapper.length).toBe(1);
        wrapper = component.find('.invite-member__member--searched-email');
        expect(wrapper.length).toBe(2);
    });

    it('should render without error modla', () => {
        const component = mount(<InviteMember members={membersStub} />);
        let wrapper = component.find('.invite-member');
        expect(wrapper.length).toBe(1);
    });

    it('should render without error searched member', () => {
        const component = mount(<InviteMember members={membersStub} />);
        component.setState({ searchedMember: searchedMemberStub });
        component.update();

        let wrapper;

        wrapper = component.find('.invite-member__member--searched');
        expect(wrapper.length).toBe(1);
        wrapper = component.find('.invite-member__member--searched-email');
        expect(wrapper.length).toBe(2);
    });

    it('should render without error added member', () => {
        const component = mount(<InviteMember members={membersStub} />);
        component.setState({ addedMember: addedMemberStub });
        component.update();

        let wrapper;

        wrapper = component.find('.invite-member__member--added');
        expect(wrapper.length).toBe(1);
        wrapper = component.find('.invite-member__member--added-element');
        expect(wrapper.length).toBe(1);
    });
    it('handle invite mamber', async done => {
        const component = mount(
            <InviteMember workspace={workspaceStub} members={membersStub} />
        );
        component.setState({ searchedMember: searchedMemberStub });
        component.update();

        let wrapper;

        axios.patch = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {};
                resolve(result);
            });
        });
        delete window.location;
        window.location = { reload: jest.fn() };

        wrapper = component.find('.invite-confirm-button');
        await wrapper.simulate('click');

        done();
    });
    it('handle change input', async done => {
        const component = mount(
            <InviteMember workspace={workspaceStub} members={membersStub} />
        );

        // axios.post = jest.fn(url => {
        //     return new Promise((resolve, reject) => {
        //         const result = {
        //             data: {
        //                 searchedMember: searchedMemberStub
        //             }
        //         };
        //         resolve(result);
        //     });
        // });

        let wrapper;

        wrapper = component.find('.invite-member__input');
        wrapper.simulate('change', { target: { value: '' } });
        expect(component.state().searchedMember).toEqual([]);

        wrapper.simulate('change', { target: { value: 'test1@test.com' } });
        expect(component.state().emailMember).toEqual('test1@test.com');

        axios.post('url', {}).then(res => {
            expect(component.state().searchedMember).toEqual({
                searchedMember: searchedMemberStub
            });
        });
        done();
    });

    it('handle select member', async done => {
        const component = mount(
            <InviteMember workspace={workspaceStub} members={membersStub} />
        );
        const dummy = {
            emailMember: '',
            searchedMember: [],
            addedMember: [{ id: 2, username: 'test2@test.com' }],
            addedMemberId: [2]
        };

        // axios.post = jest.fn(url => {
        //     return new Promise((resolve, reject) => {
        //         const result = {
        //             data: {
        //                 searchedMember: searchedMemberStub
        //             }
        //         };
        //         resolve(result);
        //     });
        // });
        component.setState({ searchedMember: searchedMemberStub });
        component.update();

        let wrapper;

        wrapper = component
            .find('.invite-member__member--searched-email')
            .at(1);
        wrapper.simulate('click');

        expect(component.state()).toEqual(dummy);
        done();
    });
    it('handle delete member', async done => {
        const component = mount(
            <InviteMember workspace={workspaceStub} members={membersStub} />
        );

        component.setState({ addedMember: addedMemberStub });
        component.update();

        let wrapper;

        wrapper = component.find('.invite-member__member--added-element');
        wrapper.simulate('click');

        expect(component.state()).toEqual({
            emailMember: '',
            searchedMember: [],
            addedMember: []
        });
        done();
    });
});
