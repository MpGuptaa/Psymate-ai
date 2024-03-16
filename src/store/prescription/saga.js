import { call, put, takeEvery, all, fork } from "redux-saga/effects";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Prescription Redux States
import {
  GET_PRESCRIPTIONS,
  ADD_NEW_PRESCRIPTION,
  DELETE_PRESCRIPTION,
  UPDATE_PRESCRIPTION,
} from "./actionType";

import {
  prescriptionApiResponseSuccess,
  prescriptionApiResponseError,
  addPrescriptionSuccess,
  addPrescriptionFail,
  updatePrescriptionSuccess,
  updatePrescriptionFail,
  deletePrescriptionSuccess,
  deletePrescriptionFail,
} from "./action";

//Include Both Helper File with needed methods
import {
  getPrescriptions as getPrescriptionsApi,
  addNewPrescription,
  updatePrescription,
  deletePrescription,
} from "../../helpers/fakebackend_helper";

function* getPrescriptions() {
  try {
    const response = yield call(getPrescriptionsApi);
    yield put(prescriptionApiResponseSuccess(GET_PRESCRIPTIONS, response.data));
  } catch (error) {
    yield put(prescriptionApiResponseError(GET_PRESCRIPTIONS, error));
  }
}

function* onAddNewPrescription({ payload: prescription }) {
  try {
    const response = yield call(addNewPrescription, prescription);
    window.location.href = `/apps-prescriptions-details?id=${response.data.Prescriptions.number}`;
    yield put(addPrescriptionSuccess(response));
    toast.success("Prescription Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(addPrescriptionFail(error));
    toast.error("Prescription Added Failed", { autoClose: 3000 });
  }
}

function* onUpdatePrescription({ payload: prescription }) {
  try {
    const response = yield call(updatePrescription, prescription);
    yield put(updatePrescriptionSuccess(response));
    toast.success("Prescription Updated Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updatePrescriptionFail(error));
    toast.error("Prescription Updated Failed", { autoClose: 3000 });
  }
}

function* onDeletePrescription({ payload: prescription }) {
  try {
    const response = yield call(deletePrescription, prescription);
    yield put(deletePrescriptionSuccess({ prescription, ...response }));
    toast.success("Prescription Delete Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deletePrescriptionFail(error));
    toast.error("Prescription Delete Failed", { autoClose: 3000 });
  }
}

export function* watchGetPrescriptions() {
  yield takeEvery(GET_PRESCRIPTIONS, getPrescriptions);
}

export function* watchUpdatePrescription() {
  yield takeEvery(UPDATE_PRESCRIPTION, onUpdatePrescription);
}

export function* watchDeletePrescription() {
  yield takeEvery(DELETE_PRESCRIPTION, onDeletePrescription);
}

export function* watchAddNewPrescription() {
  yield takeEvery(ADD_NEW_PRESCRIPTION, onAddNewPrescription);
}

function* prescriptionSaga() {
  yield all([
    fork(watchGetPrescriptions),
    fork(watchAddNewPrescription),
    fork(watchDeletePrescription),
    fork(watchUpdatePrescription),
  ]);
}

export default prescriptionSaga;
