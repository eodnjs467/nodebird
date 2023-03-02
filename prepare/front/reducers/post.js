import produce from "immer";
// eslint-disable-next-line import/no-extraneous-dependencies

export const initialState = {
  mainPosts: [],
  imagePaths: [],
  hasMorePosts: true,
  loadPostLoading: false,
  loadPostDone: false,
  loadPostError: null,
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

export const POST_LOADING_REQUEST = 'POST_LOADING_REQUEST';
export const POST_LOADING_SUCCESS = 'POST_LOADING_SUCCESS';
export const POST_LOADING_FAILURE = 'POST_LOADING_FAILURE';

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

const reducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case POST_LOADING_REQUEST:
      draft.loadPostLoading = true;
      draft.loadPostDone = false;
      draft.loadPostError = null;
      break;
    case POST_LOADING_SUCCESS:
      draft.mainPosts = action.data.concat(draft.mainPosts);
      draft.loadPostLoading = false;
      draft.loadPostDone = true;
      draft.hasMorePosts = draft.mainPosts.length < 50;
      break;
    case POST_LOADING_FAILURE:
      draft.loadPostLoading = false;
      draft.loadPostError = action.error;
      break;
    case ADD_POST_REQUEST:
      draft.addPostLoading = true;
      draft.addPostDone = false;
      draft.addPostError = null;
      break;
    case ADD_POST_SUCCESS:
      draft.mainPosts.unshift(action.data);
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
      const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
      post.Comments.unshift(action.data);
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
