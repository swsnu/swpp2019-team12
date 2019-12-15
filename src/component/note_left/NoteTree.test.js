import React from 'react';
import { shallow } from 'enzyme';
import NoteTree from './NoteTree';

describe('<NoteTree />', () => {
    let noteTree;
    const stubBlocks = [
        {
            block_type: 'Agenda',
            content: 'content',
            id: 1
        },
        {
            block_type: 'Text',
            id: 2
        }
    ];
    beforeEach(() => {
        noteTree = <NoteTree blocks={stubBlocks} />;
    });
    it('should render without error', () => {
        const component = shallow(noteTree);
        let wrapper = component.find('.tree-menu');
        expect(wrapper.length).toBe(1);
    });

    it('should set state properly after getDerivedStateProps called', () => {
        const component = shallow(noteTree);
        let instance = component.instance();
        let result = instance.constructor.getDerivedStateFromProps([], []);
        expect(result).toBe(null);
    });
});
