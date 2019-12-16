import React from 'react';
import { shallow, mount } from 'enzyme';
import Note from './Note';
import { createBrowserHistory } from 'history';

function mockComponent(props, className) {
    return <div className={className}>{className}</div>;
}

jest.mock('../../component/blocks/Text', () =>
    jest.fn(props => mockComponent(props, 'spyText'))
);

jest.mock('../../component/blocks/Agenda', () =>
    jest.fn(props => mockComponent(props, 'spyAgenda'))
);

jest.mock('../stt/googleSTT', () => {
    jest.fn(props => mockComponent(props, 'spyGoogleSTT'));
});

const mockHistory = { push: jest.fn() };
const history = createBrowserHistory();

describe('<Note />', () => {
    let note;
    beforeEach(() => {
        note = (
            <Note
                history={history}
                required={true}
                match={{
                    params: { n_id: 1 },
                    isExact: true,
                    path: '',
                    url: ''
                }}
            />
        );
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without error', () => {
        const component = shallow(note);
        let wrapper = component.find('.Note');
        expect(wrapper.length).toBe(1);
    });

    it('should redirect if not logged in', () => {
        jest.clearAllMocks();
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            return false;
        });
        const mockHistory = { push: jest.fn() };
        shallow(
            <Note
                history={mockHistory}
                required={true}
                match={{ params: { id: 1 }, isExact: true, path: '', url: '' }}
            />
        );
        expect(mockHistory.push).toHaveBeenCalledTimes(0);
    });
});
