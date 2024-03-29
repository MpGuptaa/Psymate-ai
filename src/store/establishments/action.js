import {
  GET_ESTABLISHMENTS,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
} from "./actionType";

// common success
export const establishmentApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const establishmentApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getEstablishments = () => ({
  type: GET_ESTABLISHMENTS,
});
