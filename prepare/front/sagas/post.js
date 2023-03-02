import axios from 'axios';
import { call, all, fork, put, takeLatest, delay } from 'redux-saga/effects';
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

function loadPostsAPI() {
  return axios.get('/posts');
}

function addPostAPI(data) {
  return axios.post('/post', data);
}

function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, data);
}

function* loadPost() {
  try {
    const result = yield call(loadPostsAPI);
    console.log('loadPost log', result);
    yield put({
      type: POST_LOADING_SUCCESS,
      data: result.data,
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
    const result = yield call(addPostAPI, action.data);
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });

    yield put({
      type: ADD_POST_TO_ME,
      data: { postId: result.data.id },
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
    const result = yield call(addCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
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
