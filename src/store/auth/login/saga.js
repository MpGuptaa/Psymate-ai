import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

// Login Redux States
import { LOGIN_USER, LOGOUT_USER, SOCIAL_LOGIN } from "./actionTypes";
import { apiError, loginSuccess, logoutUserSuccess } from "./actions";

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeLogin,
  postJwtLogin,
  postSocialLogin,
} from "../../../helpers/fakebackend_helper";
import { setAuthorization } from "../../../helpers/api_helper";
import axios from "axios";
import config from "../../../config";
import { toast } from "react-toastify";
const storedUser = JSON.parse(sessionStorage.getItem('authUser'));

function* loginUser({ payload: { user, history } }) {
  console.log('called login');
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      console.log('in firebase');
      const fireBaseBackend = getFirebaseBackend();
      const response = yield call(
        fireBaseBackend.loginUser,
        user.email,
        user.password
      );
      console.log('history-', history);
      if (response) {
        yield put(loginSuccess(response));
        console.log('', response);
        window.location.replace(`/layout/tabs/top?id=${storedUser._id}&formId=65bf466b28261e8891c8b813`)
        // window.location.replace("/apps-calendar");
      } else {
        console.log('error login-', response);
        yield put(apiError(response));
      }
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      console.log('in jwt');
      const response = yield call(postJwtLogin, {
        email: user.email,
        password: user.password,
      });
      sessionStorage.setItem("authUser", JSON.stringify(response));
      setAuthorization(response.jwt);
      if (response) {
        yield put(loginSuccess(response));
         window.location.replace(history);
      } else {
        yield put(apiError(response));
      }
    } else if (process.env.REACT_APP_API_URL) {
      console.log('in api url');
      const response = yield call(postFakeLogin, {
        userId: user.email,
        password: user.password,
      });
      console.log('response not set');
      console.log(response, "hit");
      if (response.status === 200) {
        axios
          .post(
            `${config.api.API_URL}/email/login`,
            {
              displayName: response?.data?.displayName?.split("-")[0],
              phone: response?.data?.phoneNumber,
              email: response?.data?.email,
              time: new Date().toUTCString(),
              browser: {
                platform: navigator.platform,
                vendor: navigator.vendor,
                appCodeName: navigator.appCodeName,
                appVersion: navigator.appVersion,
              },
              toEmail: "info@psymate.org",
              returnURL: window.location.href,
            },
            {
              headers: {
                Authorization: "Basic " + response.data.jwt,
              },
            }
          )
          .then((res) => {
            console.log("res", res);
          })
          .catch((err) => {
            console.log("err", err);
          });
        yield put(loginSuccess(response.data));
        window.location.replace(history);
        sessionStorage.setItem("authUser", JSON.stringify(response.data));
      } else {
        toast.error(response || "Error Occurred");
        yield put(apiError(response));
      }
    }
  } catch (error) {
    yield put(apiError(error));
  }
}

function* logoutUser() {
  try {
    sessionStorage.removeItem("authUser");
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend();
      const response = yield call(fireBaseBackend.logout);
      yield put(logoutUserSuccess(LOGOUT_USER, response));
    } else {
      yield put(logoutUserSuccess(LOGOUT_USER, true));
    }
  } catch (error) {
    yield put(apiError(LOGOUT_USER, error));
  }
}

function* socialLogin({ payload: { data, history, type } }) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend();
      const response = yield call(fireBaseBackend.socialLoginUser, type);
      if (response) {
        history("/apps-calendar");
      } else {
        history("/login");
      }
      sessionStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginSuccess(response));
    } else {
      const response = yield call(postSocialLogin, data);
      sessionStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginSuccess(response));
    }
    history("/apps-calendar");
  } catch (error) {
    yield put(apiError(error));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeLatest(SOCIAL_LOGIN, socialLogin);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
