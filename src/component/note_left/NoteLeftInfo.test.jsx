import React from 'react';
import { shallow, mount } from 'enzyme';
import NoteLeftInfo from './NoteLeftInfo';

const stubNoteTags = [
    {
        id: 1
    },
    {
        id: 2
    },
    {
        id: 3
    }
];
const stubWorkspaceTags = [
    {
        id: 1
    },
    {
        id: 2
    },
    {
        id: 3
    }
];

describe('<NoteLeftInfo />', () => {
    let noteLeftInfo;

    beforeEach(() => {
        noteLeftInfo = (
            <NoteLeftInfo
                noteTags={stubNoteTags}
                workspaceTags={stubWorkspaceTags}
            />
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should render without error', () => {
        const component = shallow(noteLeftInfo);
        let wrapper = component.find('.NoteLeftInfo');
        expect(wrapper.length).toBe(1);
    });

    // it('should work handleMenuClick', () => {
    //     const component = mount(noteLeftInfo);
    //     let instance = component.instance();
    //     instance.setState({
    //         workspaceTags: stubWorkspaceTags,
    //         noteTags: stubNoteTags
    //     });
    //     instance.handleMenuClick = jest.fn();
    //     let dropDownWrapper = component.find('.add-tag-button').at(0);
    //     dropDownWrapper.simulate('click');
    //     expect(instance.handleMenuClick).toHaveBeenCalledTimes(0);
    // });

    it('should set state properly with getDerivedFromProps', () => {
        const component = shallow(noteLeftInfo);
        let instance = component.instance();
        const nextProps = {
            noteTags: stubNoteTags,
            workspaceTags: stubWorkspaceTags
        };
        const prevState = {
            isTitleClicked: false,
            isDateClicked: false,
            isLocationClicked: false,
            noteTags: [],
            workspaceTags: []
        };
        let result = instance.constructor.getDerivedStateFromProps(
            nextProps,
            prevState
        );
        expect(result).toStrictEqual({
            noteTags: [{ id: 1 }, { id: 2 }, { id: 3 }],
            workspaceTags: [{ id: 1 }, { id: 2 }, { id: 3 }]
        });
    });
});
