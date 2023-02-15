import axios from 'axios';
import { all, fork, put, takeLatest, delay } from 'redux-saga/effects';
import { ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE, ADD_POST_SUCCESS, ADD_POST_FAILURE } from '../reducers/post';

function addPostAPI(data) {
  return axios.post('/api/addPost', data);
}

function* addPost(action) {
  try {
    // const result = yield all(addPostAPI, action.data)
    yield delay(1000);
    yield put({
      type: ADD_POST_SUCCESS,
      // data: result.data,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: ADD_POST_FAILURE,
      error: err.response.data,
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
    })
  } catch (err) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      err: err.response.data,
    });
  }
}

function* watchAddPost() {
  yield takeLatest('ADD_POST_REQUEST', addPost);
}

function* watchAddComment() {
  yield takeLatest('ADD_COMMENT_REQUEST', addComment);
}
export default function* postSaga() {
  yield all([
    fork(watchAddPost),
    fork(watchAddComment),
  ]);
}
