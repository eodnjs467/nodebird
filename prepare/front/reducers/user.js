export const initialState = {
  logInLoading: false, // 로그인 시도
  logInDone: false,
  logInError: null,
  logOutLoading: false, // 로그아웃 시도
  logOutDone: false,
  logOutError: null,
  signUpLoading: false, // 회원가입 시도
  signUpDone: false,
  signUpError: null,
  me: null,
  signUpData: {},
  loginData: {},
};

const dummyUser = (data) => ({
  // action.data.id & pw
  ...data,
  nickname: 'BigOne',
  id: 1,
  Posts: [], // 시퀄라이저에서 합쳐주기때문에 대문자
  Followings: [],
  Followers: [],
});

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE';

export const loginRequestAction = (data) => ({
  type: LOG_IN_REQUEST,
  data,
});
export const logoutRequestAction = () => ({
  type: LOG_OUT_REQUEST,
});

export const signUpRequestAction = (data) => {
  console.log(data);
  return {
    type: SIGN_UP_REQUEST,
    data,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_REQUEST:
      return {
        ...state,
        logInLoading: true,
        loginDone: false,
        loginError: null,
      };
    case LOG_IN_SUCCESS:
      return {
        ...state,
        logInLoading: false,
        loginDone: true,
        me: dummyUser(action.data),
      };
    case LOG_IN_FAILURE:
      return {
        ...state,
        logInLoading: false,
        logInError: action.error,
      };
    case LOG_OUT_REQUEST:
      return {
        ...state,
        logOutLoading: true,
        logOutDone: false,
        logOutError: null,
      };
    case LOG_OUT_SUCCESS:
      return {
        ...state,
        logOutLoading: false,
        logOutDone: true,
        me: null,
      };
    case LOG_OUT_FAILURE:
      return {
        ...state,
        logOutLoading: false,
        logOutError: action.error,
      };
    case SIGN_UP_REQUEST:
      return {
        ...state,
        signUpLoading: true,
        signUpError: null,
        signUpDone: false,
      };
    case SIGN_UP_SUCCESS:
      return {
        ...state,
        signUpLoading: false,
        signUpDone: true,
        signUpData: {
          ...state.signUpData,
          id: dummyUser.id + 1, // TODO: 수정요망
          email: action.data.email,
          nickname: action.data.nickname,
          password: action.data.password, // TODO: DB 연결시 지우기
          Posts: [],
          Followings: [],
          Followers: [],
        },
      };
    case SIGN_UP_FAILURE:
      return {
        ...state,
        signUpLoading: false,
        signUpError: action.error,
      };

    default:
      return state;
  }
};

export default reducer;
