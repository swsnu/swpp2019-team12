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

    it('should render getderivedstate properly', () => {
        const component = shallow(agendaInside);
        let instance = component.instance();
        instance.setState({
            blocks: stubBlocks
        });
        const stubPrev = {
            noteId: 1,
            agendaId: 1,
            blocks: [
                { block_type: 'Text', id: 1 },
                { block_type: 'Image', id: 2 },
                { block_type: 'TodoContainer', id: 3 },
                { block_type: 'nothing', id: 4 }
            ]
        };
        const stubNext = {
            noteId: 1,
            agendaId: 1,
            blocks: [
                { block_type: 'Text', id: 1 },
                { block_type: 'Image', id: 3 },
                { block_type: 'TodoContainer', id: 5 },
                { block_type: 'nothing', id: 4 }
            ]
        };
        let result = instance.constructor.getDerivedStateFromProps(
            stubPrev,
            stubNext
        );
        expect(result.length).toEqual(undefined);
        result = instance.constructor.getDerivedStateFromProps([], []);
        expect(result).toEqual(null);
    });
});
