import axios from 'axios';
import { all, fork, put, takeLatest, delay } from 'redux-saga/effects';
// eslint-disable-next-line import/no-extraneous-dependencies
import shortId from 'shortid';
import {
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_POST_SUCCESS,
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  DELETE_POST_REQUEST,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAILURE,
  POST_LOADING_REQUEST,
  POST_LOADING_SUCCESS,
  POST_LOADING_FAILURE,
} from '../reducers/post';
import { ADD_POST_TO_ME, DELETE_POST_OF_ME } from "../reducers/user";

function postAPI(action) {
  switch (action.type) {
    case ADD_POST_REQUEST:
      return axios.post('/api/posts/addPost', action.data);
    case DELETE_POST_REQUEST:
      return axios.delete(`/api/posts/${action.data.postId}`);
    default:
      return null;
  }
}

function* loadPost(action) {
  try {
    console.log('loadPost Saga: ', action);
    // const result = yield call(postAPI, action);
    delay(1000);
    yield put({
      type: POST_LOADING_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: POST_LOADING_FAILURE,
      data: err.response.error,
    });
  }
}

function* addPost(action) {
  try {
    const postId = shortId.generate();
    // const result = yield all(addPostAPI, action.data)
    yield delay(1000);
    console.log('action: ', action);
    yield put({
      type: ADD_POST_SUCCESS,
      // data: result.data,
      data: { postId, ...action.data },
    });
    yield put({
      type: ADD_POST_TO_ME,
      data: { postId },
    });
  } catch (err) {
    yield put({
      type: ADD_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function* deletePost(action) {
  try {
    console.log('deletdPost: ', action);
    // const result = yield call(postAPI, action);
    delay(1000);
    yield put({
      type: DELETE_POST_SUCCESS,
      data: action.data,
    });
    yield put({
      type: DELETE_POST_OF_ME,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: DELETE_POST_FAILURE,
      data: err.response.error,
    });
  }
}

function* addComment(action) {
  try {
    // const result = yield call(addCommentAPI, action.data);
    delay(1000);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      err: err.response.data,
    });
  }
}

function* watchLoadPost() {
  yield takeLatest(POST_LOADING_REQUEST, loadPost);
}
function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}
function* watchDeletePost() {
  yield takeLatest(DELETE_POST_REQUEST, deletePost);
}
export default function* postSaga() {
  yield all([
    fork(watchLoadPost),
    fork(watchAddPost),
    fork(watchAddComment),
    fork(watchDeletePost),
  ]);
}
