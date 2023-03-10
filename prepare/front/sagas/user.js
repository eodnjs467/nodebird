import axios from "axios";
import { all, fork, put, takeLatest, call } from 'redux-saga/effects';
import {
    FOLLOW_REQUEST,
    FOLLOW_SUCCESS,
    FOLLOW_FAILURE,
    LOG_IN_FAILURE,
    LOG_IN_REQUEST,
    LOG_IN_SUCCESS,
    LOG_OUT_FAILURE,
    LOG_OUT_REQUEST,
    LOG_OUT_SUCCESS,
    SIGN_UP_FAILURE,
    SIGN_UP_REQUEST,
    SIGN_UP_SUCCESS,
    UNFOLLOW_REQUEST,
    UNFOLLOW_SUCCESS,
    UNFOLLOW_FAILURE,
    LOAD_MY_INFO_REQUEST,
    LOAD_MY_INFO_SUCCESS,
    LOAD_MY_INFO_FAILURE,
    CHANGE_NICKNAME_REQUEST,
    CHANGE_NICKNAME_SUCCESS,
    CHANGE_NICKNAME_FAILURE,
    LOAD_FOLLOWINGS_REQUEST,
    LOAD_FOLLOWERS_REQUEST,
    LOAD_FOLLOWERS_SUCCESS,
    LOAD_FOLLOWERS_FAILURE, LOAD_FOLLOWINGS_SUCCESS, LOAD_FOLLOWINGS_FAILURE,
    FOLLOWER_REMOVE_SUCCESS, FOLLOWER_REMOVE_FAILURE, FOLLOWER_REMOVE_REQUEST,
    LOAD_USER_SUCCESS, LOAD_USER_FAILURE, LOAD_USER_REQUEST,
} from "../reducers/user";

function logInAPI(data) {
    return axios.post('/user/login', data);
}

function loadMyInfoAPI() {
    return axios.get('/user');
}

function loadUserAPI(data) {
    return axios.get(`/user/${data}`);
}

function logOutAPI() {
    return axios.post('/user/logout');
}

function signUpAPI(data) {
    return axios.post('/user', data);
}

function changeNicknameAPI(data) {
    return axios.patch('/user/nickname', data);
}

function followAPI(data) {
    return axios.patch(`/user/${data}/follow`);
}
function unfollowAPI(data) {
    return axios.delete(`/user/${data}/follow`);
}

function followerRemoveAPI(data) {
    return axios.delete(`/user/follower/${data}`);
}

function loadFollowingsAPI() {
    return axios.get('/user/following');
}

function loadFollowersAPI() {
    return axios.get('/user/follower');
}

function* logIn(action) {
    try {
        const result = yield call(logInAPI, action.data);
        console.log(result);
        yield put({
            type: LOG_IN_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        yield put({
            type: LOG_IN_FAILURE,
            error: err.response.data,
        });
    }
}

function* loadMyInfo() {
    try {
        const result = yield call(loadMyInfoAPI);
        yield put({
            type: LOAD_MY_INFO_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        yield put({
            type: LOAD_MY_INFO_FAILURE,
            error: err.response.data,
        });
    }
}

function* loadUser(action) {
    try {
        const result = yield call(loadUserAPI, action.data);
        yield put({
            type: LOAD_USER_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        console.log(err);
        yield put({
            type: LOAD_USER_FAILURE,
            error: err.response.data,
        });
    }
}

function* logOut() {
    try {
        yield call(logOutAPI);
        yield put({
            type: LOG_OUT_SUCCESS,
            // data: result.data,
        });
    } catch (err) {
        yield put({
            type: LOG_OUT_FAILURE,
            error: err.response.data,
        });
    }
}

function* signUp(action) {
    try {
        const result = yield call(signUpAPI, action.data);
        console.log('result: ', result);
        yield put({
            type: SIGN_UP_SUCCESS,
            // data: action.data,
        });
    } catch (err) {
        yield put({
            type: SIGN_UP_FAILURE,
            error: err.response.data,
        });
    }
}

function* changeNickname(action) {
    try {
        const result = yield call(changeNicknameAPI, action.data);
        yield put({
            type: CHANGE_NICKNAME_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        yield put({
            type: CHANGE_NICKNAME_FAILURE,
            err: err.response.data,
        });
    }
}

function* follow(action) {
    try {
        console.log('action saga : ', action.data);
        const result = yield call(followAPI, action.data);
        console.log(result);
        yield put({
            type: FOLLOW_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        console.log(err);
        yield put({
            type: FOLLOW_FAILURE,
            error: err.response.data,
        });
    }
}

function* unfollow(action) {
    try {
        const result = yield call(unfollowAPI, action.data);
        yield put({
            type: UNFOLLOW_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        console.log(err);
        yield put({
            type: UNFOLLOW_FAILURE,
            error: err.response.data,
        });
    }
}

function* followerRemove(action) {
    try {
        const result = yield call(followerRemoveAPI, action.data);
        yield put({
            type: FOLLOWER_REMOVE_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        console.log(err);
        yield put({
            type: FOLLOWER_REMOVE_FAILURE,
            error: err.response.data,
        });
    }
}

function* loadFollowings() {
    try {
        const result = yield call(loadFollowingsAPI);
        yield put({
            type: LOAD_FOLLOWINGS_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        console.log(err);
        yield put({
            type: LOAD_FOLLOWINGS_FAILURE,
            error: err.response.data,
        });
    }
}

function* loadFollowers() {
    try {
        const result = yield call(loadFollowersAPI);
        yield put({
            type: LOAD_FOLLOWERS_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        console.log(err);
        yield put({
            type: LOAD_FOLLOWERS_FAILURE,
            error: err.response.data,
        });
    }
}

function* watchLoadMyInfo() {
    yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
}

function* watchLoadUser() {
    yield takeLatest(LOAD_USER_REQUEST, loadUser);
}

function* watchLogIn() {
    yield takeLatest(LOG_IN_REQUEST, logIn); // type: 'LOG_IN_REQUEST' 과 이거에 필요한 data 가 action 이라는거에 있는데 그게 logIn()에 매개변수로 전달된다.
}

function* watchLogOut() {
    yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchSignUP() {
    yield takeLatest(SIGN_UP_REQUEST, signUp);
}

function* watchChangeNickname() {
    yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname);
}

function* watchFollow() {
    yield takeLatest(FOLLOW_REQUEST, follow);
}

function* watchUnfollow() {
    yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}

function* watchFollowerRemove() {
    yield takeLatest(FOLLOWER_REMOVE_REQUEST, followerRemove);
}

function* watchLoadFollowings() {
    yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

function* watchLoadFollowers() {
    yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

export default function* userSaga() {
    yield all([
        fork(watchLoadMyInfo),
        fork(watchLoadUser),
        fork(watchLogIn),
        fork(watchLogOut),
        fork(watchSignUP),
        fork(watchChangeNickname),
        fork(watchFollow),
        fork(watchUnfollow),
        fork(watchFollowerRemove),
        fork(watchLoadFollowings),
        fork(watchLoadFollowers),
    ]);
}
