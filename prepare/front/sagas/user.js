import axios from "axios";
import {all, fork, put, delay, takeLatest} from 'redux-saga/effects';

function logInAPI(data) {
    return axios.post('/api/login', data);
}

function logOutAPI() {
    return axios.post('/api/logout');
}

function* logIn(action){
    try{
        // const result = yield call(logInAPI, action.data);
        yield delay(1000);
        yield put({
            type: 'LOG_IN_SUCCESS',
            data: action.data
            // data: result.data,
        });
    }catch (err){
        yield put({
            type:'LOG_IN_FAILURE',
            data: err.response.data,
        })
    }
}

function* logOut() {
    try {
        // const result = yield call(logOutAPI);
        yield delay(1000);
        yield put({
            type: 'LOG_OUT_SUCCESS',
            // data: result.data,
        })
    } catch (err) {
        yield put({
            type: 'LOG_OUT_FAILURE',
            data: err.response.data,
        });
    }
}

function* watchLogIn(){
    yield takeLatest('LOG_IN_REQUEST', logIn);      // type: 'LOG_IN_REQUEST' 과 이거에 필요한 data 가 action 이라는거에 있는데 그게 logIn()에 매개변수로 전달된다.
}

function* watchLogOut(){
    yield takeLatest('LOG_OUT_REQUEST', logOut);
}

export default function* userSaga(){
    yield all([
        fork(watchLogIn),
        fork(watchLogOut),
    ]);
}
