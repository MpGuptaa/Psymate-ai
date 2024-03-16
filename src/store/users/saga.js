import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import "react-toastify/dist/ReactToastify.css";

// Ecoomerce Redux States
import { GET_PATIENT, GET_USERS } from "./actionType";

import { userApiResponseSuccess, userApiResponseError } from "./action";

//Include Both Helper File with needed methods
import { getUsers as getUsersApi } from "../../helpers/fakebackend_helper";

function* getUsers(type, page, searchParamsString) {
  try {
    const response = yield call(
      getUsersApi,
      type.payload.type,
      type.payload.page,
      type.payload.searchParamsString || "",
    );
    yield put(userApiResponseSuccess(GET_USERS, response.data));
  } catch (error) {
    console.log(error);
    yield put(userApiResponseError(GET_USERS, error));
  }
}

export function* watchGetUsers() {
  yield takeEvery(GET_USERS, getUsers);
}

function* userSaga() {
  yield all([fork(watchGetUsers)]);
}

export default userSaga;
