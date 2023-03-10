import axios from 'axios';
import { call, all, fork, put, takeLatest } from 'redux-saga/effects';
import {
  ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE, ADD_COMMENT_REQUEST,
  ADD_POST_SUCCESS, ADD_POST_FAILURE, ADD_POST_REQUEST,
  DELETE_POST_REQUEST, DELETE_POST_SUCCESS, DELETE_POST_FAILURE,
  POST_LOADING_REQUEST, POST_LOADING_SUCCESS, POST_LOADING_FAILURE,
  LIKE_POST_REQUEST, LIKE_POST_SUCCESS, LIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST, UNLIKE_POST_SUCCESS, UNLIKE_POST_FAILURE,
  UPLOAD_IMAGES_REQUEST, UPLOAD_IMAGES_FAILURE, UPLOAD_IMAGES_SUCCESS,
  RETWEET_REQUEST, RETWEET_SUCCESS, RETWEET_FAILURE,
} from '../reducers/post';
import { ADD_POST_TO_ME, DELETE_POST_OF_ME } from "../reducers/user";

function loadPostsAPI(lastId) {
  return axios.get(`/posts?lastId=${lastId || 0}`);
}

function addPostAPI(data) {
  return axios.post('/post', data);
}

function uploadImagesAPI(data) {
  return axios.post('/post/images', data);
}

function deletePostAPI(data) {
  return axios.delete(`/post/${data}`);
}

function likePostAPI(data) {
  return axios.patch(`/post/${data}/like`);
}

function unlikePostAPI(data) {
  return axios.delete(`/post/${data}/like`);
}
function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, data);
}

function retweetAPI(data) {
  return axios.post(`/post/${data}/retweet`, data);
}

function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data);
    yield put({
      type: LIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: LIKE_POST_FAILURE,
      error: err.response.error,
    });
  }
}

function* unlikePost(action) {
  try {
    const result = yield call(unlikePostAPI, action.data);
    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: err.response.error,
    });
  }
}

function* loadPost(action) {
  try {
    const result = yield call(loadPostsAPI, action.lastId);
    yield put({
      type: POST_LOADING_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: POST_LOADING_FAILURE,
      error: err.response.error,
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
    console.log(err);
    yield put({
      type: ADD_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: err.response.error,
    });
  }
}

function* deletePost(action) {
  try {
    const result = yield call(deletePostAPI, action.data);
    yield put({
      type: DELETE_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: DELETE_POST_OF_ME,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: DELETE_POST_FAILURE,
      error: err.response.error,
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
      error: err.response.data,
    });
  }
}

function* retweet(action) {
  try {
    const result = yield call(retweetAPI, action.data);
    yield put({
      type: RETWEET_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: RETWEET_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}
function* watchUnlikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}
function* watchLoadPost() {
  yield takeLatest(POST_LOADING_REQUEST, loadPost);
}
function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}
function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}
function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}
function* watchDeletePost() {
  yield takeLatest(DELETE_POST_REQUEST, deletePost);
}
function* watchRetweet() {
  yield takeLatest(RETWEET_REQUEST, retweet);
}
export default function* postSaga() {
  yield all([
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchLoadPost),
    fork(watchAddPost),
    fork(watchUploadImages),
    fork(watchAddComment),
    fork(watchDeletePost),
    fork(watchRetweet),
  ]);
}
