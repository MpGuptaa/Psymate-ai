import {
  GET_TEMPLATE,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
} from "./actionType";

// common success
export const settingApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const settingApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getTemplates = () => ({
  type: GET_TEMPLATE,
});
