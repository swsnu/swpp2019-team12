import React from 'react';
import { shallow, mount } from 'enzyme';
import MemberInfo from './MemberInfo';

const stubMembers = [
    {
        nickname: 'stub1'
    }
];

const stubWorkspace = [
    {
        id: 1
    }
];

describe('<MemberInfo />', () => {
    let memberInfo;
    beforeEach(() => {
        memberInfo = (
            <MemberInfo members={stubMembers} workspace={stubWorkspace} />
        );
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without erros', () => {
        const component = mount(memberInfo);
        const wrapper = component.find('.memberInfo-container');
        expect(wrapper.length).toBe(1);
    });
});
