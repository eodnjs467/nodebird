export const initialState = {
    mainPosts: [{
        id: 1,
        User: {
            id: 1,
            nickname: '큰 동그라미',
        },
        content: '첫 번쨰 게시글 #해시태그 #익스프레스',
        Images: [{
            src: 'https://'
        }],
        Comments: [{
            User: {
                nickname: 'Dho',
            },
            content: '우와 바나나가 있군요~',
        }, {
            User: {
                nickname: 'SilverCenter',
            },
            content: '우와 오늘도 개드립을 치는군요~',
        }]
    }],
    imagePaths: [],
    postAdded: false,
};

const ADD_POST = 'ADD_POST';
export const addPost = {
    type: ADD_POST,
}
const dummyPost = {
    id: 2,
    content: '은중 데이터입니다.',
    Image:[],
    Comment: [],
}

const reducer = (state=initialState, action) => {
    switch (action.type){
        case ADD_POST:
            return {
                ...state,
                mainPosts: [dummyPost, ...state.mainPosts],
                postAdded: true,
            };
        default:
            return state;
    }
}

export default reducer;
