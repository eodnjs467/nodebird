import shortId from "shortid";
// eslint-disable-next-line import/no-extraneous-dependencies
import produce from "immer";
import { faker } from '@faker-js/faker/locale/ko';

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
  deletePostLoading: false,
  deletePostDone: false,
  deletePostError: null,
};

faker.seed(123);

initialState.mainPosts = initialState.mainPosts.concat(
    Array(20).fill().map(() => ({
      id: shortId.generate(),
      User: {
        id: shortId.generate(),
        nickname: faker.name.middleName(),
      },
      content: faker.commerce.productDescription(),
      Images: [
        { src: faker.image.image() },
        { src: faker.image.image() },
      ],
      Comments: [{
        User: {
          id: shortId.generate(),
          nickname: faker.name.middleName(),
        },
        content: faker.music.songName(),
      }],
    })),
);

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const DELETE_POST_REQUEST = 'DELETE_POST_REQUEST';
export const DELETE_POST_SUCCESS = 'DELETE_POST_SUCCESS';
export const DELETE_POST_FAILURE = 'DELETE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';
export const addPostRequest = (data) => ({
  type: ADD_POST_REQUEST,
  data,
});

export const deletePostRequest = (data) => ({
  type: DELETE_POST_REQUEST,
  data,
});

export const addCommentRequest = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});

const postFormData = (data) => ({
  id: data.postId,
  User: {
    id: data.userId,
    nickname: data.nickname,
  },
  content: data.content,
  Images: [],
  Comments: [],
});

const CommentFormData = (data) => ({
  id: shortId.generate(),
  User: { id: data.user.userId, nickname: data.user.nickname },
  content: data.content,
});
const reducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case ADD_POST_REQUEST:
      draft.addPostLoading = true;
      draft.addPostDone = false;
      draft.addPostErro = null;
      break;
    case ADD_POST_SUCCESS:
      draft.mainPosts.unshift(postFormData(action.data));
      draft.addPostLoading = false;
      draft.addPostDone = true;
      break;
    case ADD_POST_FAILURE:
      draft.addPostLoading = false;
      draft.addPostError = action.error;
      break;
    case ADD_COMMENT_REQUEST:
      draft.addCommentLoading = true;
      draft.addCommentDone = false;
      draft.addCommentError = null;
      break;
    case ADD_COMMENT_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const post = draft.mainPosts.find((v) => v.id === action.data.postId);
      post.Comments.unshift(CommentFormData(action.data));
      draft.addCommentLoading = false;
      draft.addCommentDone = true;
      break;
    case ADD_COMMENT_FAILURE:
      draft.CommentLoading = false;
      draft.addCommentError = action.error;
      break;
    case DELETE_POST_REQUEST:
      draft.deletePostLoading = true;
      draft.deletePostDone = false;
      draft.deletePostError = null;
      break;
    case DELETE_POST_SUCCESS:
      draft.mainPosts = draft.mainPosts.filter((v) => action.data.postId !== v.id);
      draft.deletePostLoading = false;
      draft.deletePostDone = true;
      break;
    case DELETE_POST_FAILURE:
      draft.deletePostLoading = false;
      draft.deletePostError = action.error;
      break;

    default:
      break;
  }
});

export default reducer;
