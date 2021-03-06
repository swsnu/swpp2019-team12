import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

function mockComponent(props, className) {
    return <div className={className}>{props.title}</div>;
}

jest.mock('./container/user/SignIn', () =>
    jest.fn(props => mockComponent(props, 'spySignIn'))
);

jest.mock('./container/user/SignUp', () =>
    jest.fn(props => mockComponent(props, 'spySignUp'))
);

jest.mock('./container/note/Note', () =>
    jest.fn(props => mockComponent(props, 'spyNote'))
);

jest.mock('./container/workspace/WorkspaceSelection', () =>
    jest.fn(props => mockComponent(props, 'spyWorkspaceSelection'))
);

jest.mock('./container/workspace/Workspace', () =>
    jest.fn(props => mockComponent(props, 'spyWorkspace'))
);

describe('<App />', () => {
    //    let app;

    it('should render without error', () => {
        // const component = mount(app);
        //console.log(mount(<App />).debug());
        const component = shallow(<App />);
        let wrapper = component.find('.App');
        expect(wrapper.length).toBe(1);
    });
});
