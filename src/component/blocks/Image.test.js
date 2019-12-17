import React from 'react';
import { shallow, mount } from 'enzyme';
import Image from './Image';

function mockComponent(props, className) {
    return <div className={className}>{props}</div>;
}

const mockNoteId = 1;
const mockBlkId = 1;
const mockType = 'Image';
const mockContent = 'JUST';
const mockImage = { name: 'image1' };
const mock_is_submitted = false;
const mock_is_parent_note = true;
const mockHandleClickBlock = jest.fn();
const mockHandleDeleteBlock = jest.fn();
const mockSocketRef = { current: { state: { ws: { send: jest.fn() } } } };

describe('<Image />', () => {
    let component;
    let image;
    beforeEach(() => {
        component = shallow(
            <Image
                noteId={mockNoteId}
                blk_id={mockBlkId}
                type={mockType}
                content={mockContent}
                image={mockImage}
                is_submitted={mock_is_submitted}
                is_parent_note={mock_is_parent_note}
                handleClickBlock={mockHandleClickBlock}
                handleDeleteBlock={mockHandleDeleteBlock}
                socketRef={mockSocketRef}
                parent_agenda={10}
            />
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without errors', () => {
        const wrapper = component.find('#ImageBlock');
        expect(wrapper.length).toBe(1);
    });

    it('ComponentDidMount when is_parent_note is true', async () => {
        const instance = component.instance();
        instance.componentDidMount();
        expect(instance.state.is_submitted).toBe(false);
        expect(instance.state.content).toEqual('JUST');
        expect(instance.state.image).toEqual({ name: 'image1' });
        expect(instance.state.APIPath).toEqual('/api/note/1/childrenblocks/');
    });

    it('ComponentDidMount when is_parent_note is false', async () => {
        component = shallow(
            <Image
                noteId={mockNoteId}
                blk_id={mockBlkId}
                type={mockType}
                content={mockContent}
                image={mockImage}
                is_submitted={mock_is_submitted}
                is_parent_note={false}
                handleClickBlock={mockHandleClickBlock}
                handleDeleteBlock={mockHandleDeleteBlock}
                socketRef={mockSocketRef}
                parent_agenda={10}
            />
        );
        const instance = component.instance();
        instance.componentDidMount();
        expect(instance.state.is_submitted).toBe(false);
        expect(instance.state.content).toEqual('JUST');
        expect(instance.state.image).toEqual({ name: 'image1' });
        expect(instance.state.APIPath).toEqual(
            '/api/agenda/10/childrenblocks/'
        );
    });

    it('should handle change', async () => {
        const title = 'TEST_TITLE';
        const wrapper = component.find('#content');
        await wrapper.simulate('change', { target: { value: title } });
        const instance = component.instance();
        expect(instance.state.content).toEqual('TEST_TITLE');
    });
});
