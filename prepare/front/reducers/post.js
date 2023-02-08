export const initialState = {
    mainPosts: [{
        id: 1,
        User: {
            id: 1,
            nickname: '큰 동그라미',
        },
        content: '첫 번째 게시글 #해시태그 #익스프레스',
        Images: [{
            src: "https://books.google.co.kr/books/publisher/content?id=bU-kEAAAQBAJ&hl=ko&pg=PA1&img=1&zoom=3&sig=ACfU3U1LwicLa4geYtfPq8qPJI8ojzxVOA&w=1280",
        }, {
            src: "https://books.google.co.kr/books/publisher/content?id=7GlUDwAAQBAJ&hl=ko&pg=PA1&img=1&zoom=3&sig=ACfU3U113cBAVbTTveUsf2ZkNxQhviUhyA&w=1280",
        }, {
            src: "https://books.google.co.kr/books/publisher/content?id=7GlUDwAAQBAJ&hl=ko&pg=PA1&img=1&zoom=3&sig=ACfU3U113cBAVbTTveUsf2ZkNxQhviUhyA&w=1280",
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
const ADD_COMMENT = 'ADD_COMMENT';
export const addPost = data => {
    return {
        type: ADD_POST,
        data,
    }
};

export const addComment = data => {
    console.log('data: ', data)
    return{
        type: ADD_COMMENT,
        data,
    }
}
const reducer = (state=initialState, action) => {
    switch (action.type){
        case ADD_POST:
            return {
                ...state,
                mainPosts: [{
                    id: state.mainPosts.length+1,
                    User: {
                        id: action.data.id,
                        nickname: '임시 닉네임입니다.',
                    },
                    content: action.data.content,
                    Images: [],
                    Comments: [],
                }, ...state.mainPosts],
                postAdded: true,
            };
        case ADD_COMMENT:
            return {
                ...state,
                mainPosts: state.mainPosts.map(post => {
                    return post.id === action.data.id ? {...post, Comments: [{User: {nickname: '임시용~'}, content: action.data.content}, ...post.Comments]} : post
                }),
            };
        default:
            return state;
    }
}

export default reducer;
