export const initialState = {
  mainPosts: [{
    id: 1,
    User: {
      // id: 'dummyUser',
      id: 'admin',
      nickname: '큰 동그라미',
    },
    content: '첫 번째 게시글 #해시태그 #익스프레스',
    Images: [{
      src: 'https://books.google.co.kr/books/publisher/content?id=bU-kEAAAQBAJ&hl=ko&pg=PA1&img=1&zoom=3&sig=ACfU3U1LwicLa4geYtfPq8qPJI8ojzxVOA&w=1280',
    }, {
      src: 'https://books.google.co.kr/books/publisher/content?id=7GlUDwAAQBAJ&hl=ko&pg=PA1&img=1&zoom=3&sig=ACfU3U113cBAVbTTveUsf2ZkNxQhviUhyA&w=1280',
    }, {
      src: 'https://books.google.co.kr/books/publisher/content?id=7GlUDwAAQBAJ&hl=ko&pg=PA1&img=1&zoom=3&sig=ACfU3U113cBAVbTTveUsf2ZkNxQhviUhyA&w=1280',
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
    }],
  }],
  imagePaths: [],
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
};

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';
export const addPostRequest = (data) => ({
  type: ADD_POST_REQUEST,
  data,
});

export const addCommentRequest = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST_REQUEST:
      return {
        ...state,
        addPostLoading: true,
        addPostDone: false,
        addPostError: null,
      };
    case ADD_POST_SUCCESS:
      return {
        ...state,
        mainPosts: [{
          id: state.mainPosts.length + 1,
          User: {
            id: action.data.userId,
            nickname: action.data.nickname,
          },
          content: action.data.content,
          Images: [],
          Comments: [],
        }, ...state.mainPosts],
        addPostLoading: false,
        addPostDone: true,
      };
    case ADD_POST_FAILURE:
      return {
        ...state,
        addPostLoading: false,
        addPostError: action.error,
      };
    case ADD_COMMENT_REQUEST:
      return {
        ...state,
        addCommentLoading: true,
        addCommentDone: false,
        addCommentError: null,
      };
    case ADD_COMMENT_SUCCESS:
      return {
        ...state,
        mainPosts: state.mainPosts.map((post) => (
          post.id === action.data.postId
            ? {
              ...post,
              Comments: [{
                User: { id: action.data.user.userId, nickname: action.data.user.nickname },
                content: action.data.content },
              ...post.Comments] }
            : post
        )),
        addCommentLoading: false,
        addCommentDone: true,
      };
    case ADD_COMMENT_FAILURE:
      return {
        ...state,
        addCommentLoading: false,
        addCommentError: action.error,
      };

    default:
      return state;
  }
};

export default reducer;
