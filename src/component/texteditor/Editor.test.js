import React from 'react';
import { shallow, mount } from 'enzyme';
import Editor from './Editor';
import axios from 'axios';

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

describe('<Editor />', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without errors', () => {
        const component = shallow(<Editor />);
        const wrapper = component.find('.Editor');
        expect(wrapper.length), toBe(1);
    });
});

// const mockHistory = createBrowserHistory();
// describe('<NewArticle />', () => {
//     let newArticle;

//     beforeEach(() => {
//         newArticle = (
//             <Provider store={mockStore}>
//                 <ConnectedRouter history={history}>
//                     <Switch>
//                         <Route path='/' exact
//                             render={() => { return <NewArticle  history={mockHistory}/>}}/>
//                     </Switch>
//                 </ConnectedRouter>
//             </Provider>
//         )
//     })
