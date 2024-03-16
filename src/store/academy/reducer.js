import {
  GET_COURSES,
  GET_ORDERS,
  GET_MANUFACTURERS,
  GET_CUSTOMERS,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  DELETE_COURSE,
  DELETE_COURSE_SUCCESS,
  DELETE_COURSE_FAIL,
  ADD_NEW_COURSE,
  ADD_COURSE_SUCCESS,
  ADD_COURSE_FAIL,
  UPDATE_COURSE,
  UPDATE_COURSE_SUCCESS,
  UPDATE_COURSE_FAIL,
} from "./actionType";

const INIT_STATE = {
  courses: [],
  orders: [],
  manufacturers: [],
  customers: [],
  error: {},
};

const Academy = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_COURSES:
          return {
            ...state,
            courses: action.payload.data,
          };

        case DELETE_COURSE:
          return {
            ...state,
            courses: state.courses.filter(
              (course) => course.id + "" !== action.payload.data + ""
            ),
          };

        case GET_ORDERS:
          return {
            ...state,
            orders: action.payload.data,
            isOrderCreated: false,
            isOrderSuccess: true,
          };
        case GET_MANUFACTURERS:
          return {
            ...state,
            manufacturers: action.payload.data,
          };
        case GET_CUSTOMERS:
          return {
            ...state,
            customers: action.payload.data,
            isCustomerCreated: false,
            isCustomerSuccess: true,
          };

        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_COURSES:
          return {
            ...state,
            error: action.payload.error,
          };

        case DELETE_COURSE:
          return {
            ...state,
            error: action.payload.error,
          };
        case GET_ORDERS:
          return {
            ...state,
            error: action.payload.error,
            isOrderCreated: false,
            isOrderSuccess: false,
          };
        case GET_MANUFACTURERS:
          return {
            ...state,
            error: action.payload.error,
          };
        case GET_CUSTOMERS:
          return {
            ...state,
            error: action.payload.error,
            isCustomerCreated: false,
            isCustomerSuccess: false,
          };
        default:
          return { ...state };
      }

    case GET_COURSES:
      return {
        ...state,
      };

    case GET_ORDERS: {
      return {
        ...state,
        isOrderCreated: false,
      };
    }
    case GET_MANUFACTURERS: {
      return {
        ...state,
      };
    }
    case GET_CUSTOMERS:
      return {
        ...state,
        isCustomerCreated: false,
      };

    case DELETE_COURSE:
      return {
        ...state,
      };

    case ADD_COURSE_SUCCESS:
      return {
        ...state,
        courses: [...state.courses, action.payload.data],
      };

    case ADD_COURSE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_COURSE_SUCCESS:
      return {
        ...state,
        courses: state.courses.map((course) =>
          course._id.toString() === action.payload.data._id.toString()
            ? { ...course, ...action.payload.data }
            : course
        ),
      };

    case UPDATE_COURSE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_COURSE_SUCCESS:
      return {
        ...state,
        courses: state.courses.filter(
          (course) =>
            course._id.toString() !== action.payload.course.toString()
        ),
      };

    case DELETE_COURSE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export default Academy;
