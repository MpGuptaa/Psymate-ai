import {
  GET_PRESCRIPTIONS,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  UPDATE_PRESCRIPTION,
  UPDATE_PRESCRIPTION_SUCCESS,
  UPDATE_PRESCRIPTION_FAIL,
  ADD_NEW_PRESCRIPTION,
  ADD_PRESCRIPTION_SUCCESS,
  ADD_PRESCRIPTION_FAIL,
  DELETE_PRESCRIPTION,
  DELETE_PRESCRIPTION_SUCCESS,
  DELETE_PRESCRIPTION_FAIL,
} from "./actionType";

// common success
export const prescriptionApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const prescriptionApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getPrescriptions = () => ({
  type: GET_PRESCRIPTIONS,
});

export const updatePrescription = prescription => ({
  type: UPDATE_PRESCRIPTION,
  payload: prescription,
});

export const updatePrescriptionSuccess = prescription => ({
  type: UPDATE_PRESCRIPTION_SUCCESS,
  payload: prescription,
});

export const updatePrescriptionFail = error => ({
  type: UPDATE_PRESCRIPTION_FAIL,
  payload: error,
});

export const addNewPrescription = prescription => ({
  type: ADD_NEW_PRESCRIPTION,
  payload: prescription,
});

export const addPrescriptionSuccess = prescription => ({
  type: ADD_PRESCRIPTION_SUCCESS,
  payload: prescription,
});

export const addPrescriptionFail = error => ({
  type: ADD_PRESCRIPTION_FAIL,
  payload: error,
});

export const deletePrescription = prescription => ({
  type: DELETE_PRESCRIPTION,
  payload: prescription,
});

export const deletePrescriptionSuccess = prescription => ({
  type: DELETE_PRESCRIPTION_SUCCESS,
  payload: prescription,
});

export const deletePrescriptionFail = error => ({
  type: DELETE_PRESCRIPTION_FAIL,
  payload: error,
});