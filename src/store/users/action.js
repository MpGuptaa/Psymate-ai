import {
  GET_USERS,
  GET_PATIENT,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
} from "./actionType";

// common success
export const userApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const userApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getUsers = (type, page, searchParamsString) => ({
  type: GET_USERS,
  payload: { type, page, searchParamsString },
});

export const getPatient = (id) => ({
  type: GET_PATIENT,
  payload: id,
});
