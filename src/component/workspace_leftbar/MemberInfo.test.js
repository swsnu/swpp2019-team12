import React from 'react';
import { shallow } from 'enzyme';
import MemberInfo from './MemberInfo';

const memberStub1 = {
    id: 1,
    nickname: 'TEST1',
    user: 1
};
const memberStub2 = {
    id: 2,
    nickname: 'TEST2',
    user: 2
};

const membersStub = [memberStub1, memberStub2];

describe('<MemberInfo />', () => {
    it('should render without error', () => {
        const component = shallow(<MemberInfo members={membersStub} />);
        let wrapper = component.find('.memberInfo-container');
        expect(wrapper.length).toBe(1);
    });

    it('render current member list', () => {
        const component = shallow(<MemberInfo members={membersStub} />);
        let wrapper = component.find('.memberInfo__memberList--element');
        expect(wrapper.length).toBe(2);
    });
});
