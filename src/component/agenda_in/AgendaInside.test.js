import React from 'react';
import { shallow } from 'enzyme';
import Agendainside from './AgendaInside';

function mockComponent(props, className) {
    return <div className={className}>{className}</div>;
}

jest.mock('../blocks/Text', () =>
    jest.fn(props => mockComponent(props, 'spyText'))
);

const stubBlocks = [
    {
        id: 1
    },
    {
        id: 2
    }
];
describe('<AgendaInside />', () => {
    let agendaInside;
    beforeEach(() => {
        agendaInside = (
            <Agendainside noteId={1} agendaId={1} blocks={stubBlocks} />
        );
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without error', () => {
        const component = shallow(agendaInside);
        let wrapper = component.find('.agenda-inside');
        expect(wrapper.length).toBe(1);
    });

    // it('should render getderivedstate properly', () => {
    //     const component = shallow(agendaInside);
    //     let instance = component.instance();
    // });
});
