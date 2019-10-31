/**
 * @description Dummy Data
 */
export const dummyWI = {
    currentWorkspace: 'SWPP',
    workspaceList: [
        'CHAEMIN',
        'workspace',
        'HOME',
        'CHAEMIN',
        'workspace',
        'HOME',
        'CHAEMIN',
        'workspace',
        'HOME'
    ],
    handleCreateWorkspace: () => {
        console.log('Need to Implement create workspace function');
    }
};

export const memberList = [
    {
        nickname: 'CHAEMIN',
        handleShowMember: () => {
            console.log('Need to Implement show member detail function');
        }
    },
    {
        nickname: 'PAUL',
        handleShowMember: () => {
            console.log('Need to Implement show member detail function');
        }
    },
    {
        nickname: 'andra',
        handleShowMember: () => {
            console.log('Need to Implement show member detail function');
        }
    },
    {
        nickname: 'YEIN',
        handleShowMember: () => {
            console.log('Need to Implement show member detail function');
        }
    }
];
export const handleInviteMember = () => {
    console.log('Need to Implement invite member function');
};
export const handleNavigateToSetting = () => {
    console.log('Need to Implement navigate setting page function');
};
export const handleCreateMeetingNote = () => {
    console.log('Need to Implement create meeting note function');
};

export const handleNavigateToAgenda = id => {
    console.log(`Need to Implement navigate specific note has agenda NO.${id}`);
};
export const handleNavigateToTodo = id => {
    console.log(`Need to Implement navigate specific note has todo NO.${id}`);
};
export const handleToggleTodo = id => {
    console.log(`Need to Implement toggle todo status NO.${id}`);
};
export const agendas = [
    { id: 0, agenda: '서비스 이름 정하기', todos: [3, 4, 6], isDone: false },
    { id: 1, agenda: '유저스토리 작성', todos: [1], isDone: false },
    { id: 2, agenda: '소나클라우드 가입하기', todos: [], isDone: true },
    { id: 3, agenda: '바보멍충이!', todos: [23], isDone: false },
    {
        id: 4,
        agenda: '미팅오버플로우 만쉐',
        todos: [100, 101, 102, 103, 203, 105],
        isDone: false
    }
];

export const todos = [
    { id: 8, todo: 'todo 1', due: '2019-11-12', isDone: false },
    { id: 9, todo: '배고파 밥먹자', due: '2019-10-11', isDone: false },
    {
        id: 12,
        todo: '로렘 입숨 글씨 글자 블라',
        due: '2019-12-12',
        isDone: true
    }
];

/** ************   Dummy Data End   ************* */
