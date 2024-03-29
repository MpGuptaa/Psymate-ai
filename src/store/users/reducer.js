import {
  GET_USERS,
  GET_PATIENT,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
} from "./actionType";

const INIT_STATE = {
  users: [],
  selectedPatient: {},
};

const User = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_USERS:
          return {
            ...state,
            users: action.payload.data,
          };
        case GET_PATIENT:
          return {
            ...state,
            selectedPatient: action.payload.data,
          };

        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_USERS:
          return {
            ...state,
            error: action.payload.error,
          };
        case GET_PATIENT:
          return {
            ...state,
            error: action.payload.error,
          };
        default:
          return { ...state };
      }

    case GET_USERS:
      return {
        ...state,
      };
    case GET_PATIENT:
      return {
        ...state,
      };

    default:
      return { ...state };
  }
};

export default User;
