import React from 'react';
import { mount } from 'enzyme';
import Editor from './Editor';

function mockComponent(props, className) {
    return <div className={className}>{props.title}</div>;
}
// jest.mock('./container/user/Signin', () =>
//     jest.fn(props => mockComponent(props, 'spySignIn'))
// );
jest.mock('@ckeditor/ckeditor5-react', () =>
    jest.fn(props => mockComponent(props, 'spyCkeditor'))
);

jest.mock('@ckeditor/ckeditor5-editor-balloon/src/ballooneditor', () =>
    jest.fn(props => mockComponent(props, 'balloonEditor'))
);

jest.mock('@ckeditor/ckeditor5-alignment/src/alignment', () => jest.fn());
jest.mock('@ckeditor/ckeditor5-autoformat/src/autoformat', () => jest.fn());
jest.mock('@ckeditor/ckeditor5-block-quote/src/blockquote', () => jest.fn());
jest.mock('@ckeditor/ckeditor5-basic-styles/src/bold', () => jest.fn());
jest.mock('@ckeditor/ckeditor5-ckfinder/src/ckfinder', () => jest.fn());
jest.mock('@ckeditor/ckeditor5-easy-image/src/easyimage', () => jest.fn());
jest.mock('@ckeditor/ckeditor5-essentials/src/essentials', () => jest.fn());
jest.mock('@ckeditor/ckeditor5-font/src/fontfamily', () => jest.fn());
jest.mock('@ckeditor/ckeditor5-font/src/fontsize', () => jest.fn());
jest.mock('@ckeditor/ckeditor5-heading/src/heading', () => jest.fn());
jest.mock('@ckeditor/ckeditor5-highlight/src/highlight', () => jest.fn());
jest.mock('@ckeditor/ckeditor5-basic-styles/src/italic', () => jest.fn());
jest.mock('@ckeditor/ckeditor5-link/src/link', () => jest.fn());
jest.mock('@ckeditor/ckeditor5-list/src/list', () => jest.fn());
jest.mock('@ckeditor/ckeditor5-media-embed/src/mediaembed', () => jest.fn());
jest.mock('@ckeditor/ckeditor5-paragraph/src/paragraph', () => jest.fn());
jest.mock('@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice', () =>
    jest.fn()
);
jest.mock('@ckeditor/ckeditor5-real-time-collaboration/src/presencelist', () =>
    jest.fn()
);
jest.mock(
    '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativecomments',
    () => jest.fn()
);
jest.mock(
    '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativetrackchanges',
    () => jest.fn()
);
jest.mock('@ckeditor/ckeditor5-remove-format/src/removeformat', () =>
    jest.fn()
);
jest.mock('@ckeditor/ckeditor5-basic-styles/src/strikethrough', () =>
    jest.fn()
);
jest.mock('@ckeditor/ckeditor5-table/src/table', () => jest.fn());
jest.mock('@ckeditor/ckeditor5-table/src/tabletoolbar', () => jest.fn());
jest.mock('@ckeditor/ckeditor5-basic-styles/src/underline', () => jest.fn());
jest.mock('@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter', () =>
    jest.fn()
);
const STUB_DOCUMENT_ID = 'StubDocumentId';
const STUB_CONFIGURATION = {
    tokenUrl: 'StubTokenUrl',
    uploadUrl: 'StubUploadUrl',
    webSocketUrl: 'StubWebSocketUrl',
    document_id: 'StubDocumentId'
};
const STUB_SELECTED_USER = {
    id: 1,
    name: 'StubUser'
};
function stub_handleLoading() {}

describe('<Editor />', () => {
    let editor;

    beforeEach(() => {
        editor = (
            <Editor
                document_id={STUB_DOCUMENT_ID}
                selectedUser={STUB_SELECTED_USER}
                handleLoading={stub_handleLoading}
                configuration={STUB_CONFIGURATION}
            />
        );
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without errors', () => {
        const component = mount(editor);
        const wrapper = component.find('.Editor');
        expect(wrapper.length).toBe(1);
    });

    // it('should set state properly after didmount', () => {
    //     const component = mount(editor);

    // })
});
