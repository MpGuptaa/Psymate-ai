import {
  GET_ESTABLISHMENTS,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
} from "./actionType";

const INIT_STATE = {
  establishments: [],
};

const Establishment = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_ESTABLISHMENTS:
          return {
            ...state,
            establishments: action.payload.data,
          };

        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_ESTABLISHMENTS:
          return {
            ...state,
            error: action.payload.error,
          };
        default:
          return { ...state };
      }

    case GET_ESTABLISHMENTS:
      return {
        ...state,
      };

    default:
      return { ...state };
  }
};

export default Establishment;
