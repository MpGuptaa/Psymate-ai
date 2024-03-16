import {
  GET_DATAS,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  DELETE_DATA,
  DELETE_DATA_SUCCESS,
  DELETE_DATA_FAIL,
  ADD_NEW_DATA,
  ADD_DATA_SUCCESS,
  ADD_DATA_FAIL,
  UPDATE_DATA,
  UPDATE_DATA_SUCCESS,
  UPDATE_DATA_FAIL,
} from "./actionType";

const INIT_STATE = {
  datas: [],
  error: {},
};

const Admin = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_DATAS:
          return {
            ...state,
            datas: action.payload.data,
          };

        case DELETE_DATA:
          return {
            ...state,
            datas: state,
          };

        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_DATAS:
          return {
            ...state,
            error: action.payload.error,
          };

        case DELETE_DATA:
          return {
            ...state,
            error: action.payload.error,
          };

        default:
          return { ...state };
      }

    case GET_DATAS:
      return {
        ...state,
      };

    case DELETE_DATA:
      return {
        ...state,
      };

    case ADD_DATA_SUCCESS:
      return {
        ...state,
        datas: [...state, action.payload.data],
      };

    case ADD_DATA_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_DATA_SUCCESS:
      return {
        ...state,
        datas: state.map((data) =>
          data._id.toString() === action.payload.data._id.toString()
            ? { ...data, ...action.payload.data }
            : data
        ),
      };

    case UPDATE_DATA_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_DATA_SUCCESS:
      return {
        ...state,
        datas: state,
      };

    case DELETE_DATA_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export default Admin;
