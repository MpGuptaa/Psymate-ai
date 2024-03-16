import axios from "axios";
import config, { api } from "../config";
import { toast } from "react-toastify";

// default
axios.defaults.baseURL = api.API_URL;
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

// content type
const token = JSON.parse(sessionStorage.getItem("authUser"))
  ? JSON.parse(sessionStorage.getItem("authUser")).jwt
  : null;
if (token) axios.defaults.headers.common["Authorization"] = "JWT " + token;

// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;
    switch (error.status) {
      case 500:
        message = "Internal Server Error";
        break;
      case 401:
        message = "Invalid credentials";
        break;
      case 404:
        message = "Sorry! the data you are looking for could not be found";
        break;
      default:
        message = error.message || error;
    }
    return Promise.reject(message);
  }
);
/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = "JWT " + token;
};

class APIClient {
  /**
   * Fetches data from given url
   */

  get = (url, params) => {
    let response;
    // console.log("hit the get api");
    if (token) {
      setAuthorization(token);
    }
    let paramKeys = [];
    // console.log(token);
    axios
      .get(`${url}`, params)
      .then((err) => {
        // console.log("response", err);
      })
      .catch((err) => {
        console.log(err);
        if (
          err === "Request failed with status code 401" ||
          err === "Token is invalid"
        ) {
          sessionStorage.removeItem("authUser");
          window.location.replace("/");
        }
      });
    if (params) {
      Object.keys(params).map((key) => {
        paramKeys.push(key + "=" + params[key]);
        return paramKeys;
      });

      const queryString =
        paramKeys && paramKeys.length ? paramKeys.join("&") : "";
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }
    return response;
  };
  /**
   * post given data to url
   */
  create = (url, data) => {
    if (token) {
      setAuthorization(token);
    }
    return axios.post(url, data);
  };
  /**
   * Updates data
   */
  update = (url, data) => {
    if (token) {
      setAuthorization(token);
    }
    return axios.patch(url, data);
  };

  put = (url, data) => {
    if (token) {
      setAuthorization(token);
    }
    return axios.put(url, data);
  };
  /**
   * Delete
   */
  delete = (url, config) => {
    if (token) {
      setAuthorization(token);
    }
    return axios.delete(url, { ...config });
  };
}
const getLoggedinUser = () => {
  const user = sessionStorage.getItem("authUser");
  if (token) {
    setAuthorization(token);
  }
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};
const findServices = async (name, query, logOut) => {
  let data = [];
  if (token) {
    setAuthorization(token);
  }
  await axios
    .get(config.api.API_URL + `/${name}${query ? query : ""}`)
    .then((res) => {
      data = res.data;
    })
    .catch((err) => {
      console.log(err);
      if (err.message === "Request failed with status code 401") {
        data = 401;
      }
    });
  return data;
};

export { APIClient, setAuthorization, getLoggedinUser, findServices };
