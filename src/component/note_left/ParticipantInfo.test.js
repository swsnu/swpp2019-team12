import React from 'react';
import { shallow } from 'enzyme';
import ParticipantInfo from './ParticipantInfo';

describe('<ParticipantInfo />', () => {
    it('should render without error', () => {
        const component = shallow(<ParticipantInfo />);
        let wrapper = component.find('.NoteLeftInfo-participants__container');
        expect(wrapper.length).toBe(1);
    });

    it('should render single participant', () => {
        const stubParticipants = [
            {
                nickname: 'test'
            }
        ];
        const component = shallow(
            <ParticipantInfo participants={stubParticipants} />
        );
        let wrapper = component.find(
            '.NoteLeftInfo__participantList--element-name'
        );
        expect(wrapper.length).toBe(1);
    });
});
