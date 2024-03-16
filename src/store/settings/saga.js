import { call, put, takeEvery, all, fork } from "redux-saga/effects";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Ecoomerce Redux States
import { GET_TEMPLATE } from "./actionType";

import { settingApiResponseSuccess, settingApiResponseError } from "./action";

//Include Both Helper File with needed methods
import { getTemplates as getTemplatesApi } from "../../helpers/fakebackend_helper";

function* getTemplates() {
  try {
    const response = yield call(getTemplatesApi);
    yield put(settingApiResponseSuccess(GET_TEMPLATE, response.data));
  } catch (error) {
    yield put(settingApiResponseError(GET_TEMPLATE, error));
  }
}

export function* watchGetSettings() {
  yield takeEvery(GET_TEMPLATE, getTemplates);
}

function* settingSaga() {
  yield all([fork(watchGetSettings)]);
}

export default settingSaga;
