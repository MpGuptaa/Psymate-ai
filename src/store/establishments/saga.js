import { call, put, takeEvery, all, fork } from "redux-saga/effects";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Ecoomerce Redux States
import { GET_ESTABLISHMENTS } from "./actionType";

import {
  establishmentApiResponseSuccess,
  establishmentApiResponseError,
} from "./action";

//Include Both Helper File with needed methods
import { getEstablishments as getEstablishmentsApi } from "../../helpers/fakebackend_helper";

function* getEstablishments() {
  try {
    const response = yield call(getEstablishmentsApi);
    yield put(
      establishmentApiResponseSuccess(GET_ESTABLISHMENTS, response.data)
    );
  } catch (error) {
    yield put(establishmentApiResponseError(GET_ESTABLISHMENTS, error));
  }
}

export function* watchGetEstablishments() {
  yield takeEvery(GET_ESTABLISHMENTS, getEstablishments);
}

function* establishmentSaga() {
  yield all([fork(watchGetEstablishments)]);
}

export default establishmentSaga;
