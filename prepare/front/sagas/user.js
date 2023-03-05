import axios from "axios";
import { all, fork, put, delay, takeLatest, call } from 'redux-saga/effects';
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
} from "../reducers/user";

function logInAPI(data) {
    return axios.post('/user/login', data);
}

function loadUserAPI(data) {
    return axios.get('/user', data);
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
    return axios.post('/api/follow', data);
}
function unfollowAPI(data) {
    return axios.post('/api/unfollow', data);
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

function* loadUser(action) {
    try {
        const result = yield call(loadUserAPI, action.data);
        yield put({
            type: LOAD_MY_INFO_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        yield put({
            type: LOAD_MY_INFO_FAILURE,
            data: err.response.data,
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
            err: err.response.data,
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
        // const result = yield call(followAPI, action);
        delay(1000);
        yield put({
            type: FOLLOW_SUCCESS,
            data: action.data,
        });
    } catch (err) {
        yield put({
            type: FOLLOW_FAILURE,
            err: err.response.data,
        });
    }
}

function* unfollow(action) {
    try {
        console.log('action saga unfollow : ', action.data);
        // const result = yield call(followAPI, action);
        delay(1000);
        yield put({
            type: UNFOLLOW_SUCCESS,
            data: action.data,
        });
    } catch (err) {
        yield put({
            type: UNFOLLOW_FAILURE,
            err: err.response.data,
        });
    }
}

function* watchLoadUser() {
    yield takeLatest(LOAD_MY_INFO_REQUEST, loadUser);
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
export default function* userSaga() {
    yield all([
        fork(watchLoadUser),
        fork(watchLogIn),
        fork(watchLogOut),
        fork(watchSignUP),
        fork(watchChangeNickname),
        fork(watchFollow),
        fork(watchUnfollow),
    ]);
}
