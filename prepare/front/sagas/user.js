import axios from "axios";
import { all, fork, put, delay, takeLatest } from 'redux-saga/effects';
import {
    LOG_IN_FAILURE, LOG_IN_REQUEST, LOG_IN_SUCCESS,
    LOG_OUT_FAILURE, LOG_OUT_REQUEST, LOG_OUT_SUCCESS,
    SIGN_UP_FAILURE, SIGN_UP_REQUEST, SIGN_UP_SUCCESS,
} from "../reducers/user";

function logInAPI(data) {
    return axios.post('/api/login', data);
}

function logOutAPI() {
    return axios.post('/api/logout');
}

function signUpAPI(data) {
    return axios.post('/api/signup/', data);
}

function* logIn(action) {
    try {
        // const result = yield call(logInAPI, action.data);
        yield delay(1000);
        yield put({
            type: LOG_IN_SUCCESS,
            data: action.data,
            // data: result.data,
        });
    } catch (err) {
        yield put({
            type: LOG_IN_FAILURE,
            error: err.response.data,
        });
    }
}

function* logOut() {
    try {
        // const result = yield call(logOutAPI);
        yield delay(1000);
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
        // const result = yield call(signUpAPI, action.data);
        yield delay(1000);
        yield put({
            type: SIGN_UP_SUCCESS,
            data: action.data,
        });
    } catch (err) {
        yield put({
            type: SIGN_UP_FAILURE,
            err: err.response.data,
        });
    }
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

export default function* userSaga() {
    yield all([
        fork(watchLogIn),
        fork(watchLogOut),
        fork(watchSignUP),
    ]);
}
