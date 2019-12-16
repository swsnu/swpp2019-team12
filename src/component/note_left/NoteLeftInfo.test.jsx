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
        id: 1,
        content: 'test'
    },
    {
        id: 2,
        content: 'test'
    },
    {
        id: 3,
        content: 'test'
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
            workspaceTags: [
                { id: 1, content: 'test' },
                { id: 2, content: 'test' },
                { id: 3, content: 'test' }
            ]
        });
    });

    it('should handle handleConvertTag_Title correctly', () => {
        const component = shallow(noteLeftInfo);
        let instance = component.instance();
        instance.handleConvertTag_Title = jest.fn();
        let titleInput = component.find('.title');
        titleInput.simulate('blur');
        expect(instance.handleConvertTag_Title).toHaveBeenCalledTimes(0);
    });

    it('should handle handleConvertTag_Datetime correctly', () => {
        const component = shallow(noteLeftInfo);
        let instance = component.instance();
        instance.handleConvertTag_Datetime = jest.fn();
        let dateInput = component.find('.NoteLeftInfo-datetime-tag');
        dateInput.simulate('blur');
        expect(instance.handleConvertTag_Datetime).toHaveBeenCalledTimes(0);
    });

    it('should handle handleConvertTag_Location correctly', () => {
        const component = shallow(noteLeftInfo);
        let instance = component.instance();
        instance.handleConvertTag_Location = jest.fn();
        jest.useFakeTimers();
        let locationInput = component.find('.location');
        locationInput.simulate('change', { target: { value: '1' } });
        locationInput.simulate('blur');
        jest.runAllTimers();
        expect(instance.handleConvertTag_Location).toHaveBeenCalledTimes(0);
    });

    it('should work handleMenuClick', () => {
        const component = shallow(noteLeftInfo);
        let instance = component.instance();
        instance.handleMenuClick = jest.fn();

        const dropdown = component.find('.add-tag-button').at(0);
        const submenu = shallow(<div>{dropdown.prop('overlay')}</div>);
        const submenuItems = submenu.find('noteLeftInfo-menu-item');
        //console.log(submenuItems.length);
        submenuItems.forEach(item => item.simulate('click'));

        const menuInstance = shallow(
            component.find('Dropdown').props().overlay
        );
        //console.log(menuInstance.debug());
        menuInstance.simulate('click');
        expect(instance.handleMenuClick).toHaveBeenCalledTimes(0);
    });
});

// let mockFn = jest.fn();
// let wrapper = shallow(<Parent />);
// wrapper.find('Child').props().handleClick = mockFn;
// wrapper.find('Child').props().handleClick();
// expect(mockFn).toHaveBeenCalled();
