import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import config from "../../../config";
import Tools from "../../Forms/Builder/Tools";
import FormLayout from "../../../helpers/FormLayout";
import { Row } from "reactstrap";

const LoginComponent = ({ type, onSubmit, setLoggedIn }) => {
  const [state, setState] = useState({
    credential: "",
    loginWith: "phone",
    type: "",
    message: "",
    data: [],
    codeResults: [],
    error: false,
    step: ["Login"],
    year: "",
    month: "",
    date: "",
    buttonLoading: false,
    otp: "",
    gender: "",
    firstName: "",
    lastName: "",
    tempUser: [],
    login: 2,
  });

  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(30);
  var date = new Date();
  date.setTime(date.getTime() + 60 * 1000 * 120);

  const resendOTP = async (e) => {
    e.preventDefault();
    toast.info("Sending OTP Again", { toastId: "resend-otp" });

    await axios
      .get(`${config.api.API_URL}/login/resend-otp?type=${type}&credential=${state.credential}`)
      .then((res) => {
        toast.update("resend-otp", { render: "OTP sent again", type: "success" });
        setState({
          ...state,
          code: res.data.message,
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
    setMinutes(1);
    setSeconds(30);
  };
  const sendVerification = async (e) => {
    e.preventDefault();
    toast.info("Sending OTP", { toastId: "send-otp" });

    await axios
      .get(`${config.api.API_URL}/login?type=${type}&credential=${state.credential}`)
      .then((res) => {
        if (res.status === 500) {
          alert("We are Sorry", res.message);
        }
        if (res.login) {
          return toast.update("send-otp", { render: "Already Registered", type: "error" });
        }
        toast.update("send-otp", { render: "OTP SENT", type: "success" });
        setState({
          ...state,
          login: res.login === true ? 1 : 0,
          data: res.userData,
          button: res.login === true ? "Login" : "Sign Up",
          enterOTPModal: true,
          error: "",
          code: res.message,
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  const login = async (e) => {
    e.preventDefault();
    setLoggedIn && setLoggedIn(state.data);

    if (state.otp == state.code) {
      setState({
        ...state,
        buttonLoading: true,
      });
      onSubmit && onSubmit(false);
    }
  };
  const register = async (e) => {
    e.preventDefault();
    setState({
      ...state,
      buttonLoading: true,
    });
    toast.info("Registering", { toastId: "register" });

    if (state.otp !== state.code) {
      toast.update("register", { render: "Wrong OTP", type: "error" });
      return;
    }

    const userData = {
      type: state.type,
      createdAt: new Date(),
      isAdmin: null,
      gender: state.gender,
      phone: state.credential,
      dateOfBirth: state.dateOfBirth,
      deleted: false,
      firstName: state.firstName,
      lastName: state.lastName,
      userId: state.userId,
      password: state.password,
      category: [],
      email: state.email,
      displayName: state.firstName + " " + state.lastName,
    };
    axios
      .post(
        `${config.api.API_URL}/login/register?type=${type}`,
        {
          data: userData,
        },
        {
          "Content-Type": "application/json",
        },
      )
      .then(async (responseData) => {
        if (responseData.status === 200) {
          const response = responseData.data._doc;
          toast.update("register", {
            render: `${response.displayName} Is now registered with Psymate Healthcare`,
            type: "success",
          });

          onSubmit && onSubmit();
        }
      })
      .catch((error) => {
        toast.update("register", {
          render: "Invalid Inputs",
          type: "error",
        });
        toast.error();
      });
  };
  return (
    <div className="w-full relative">
      <div className="">
        <h2 className="color-brand-1 text-left text-capitalize mb-15">
          Register a {type === "patient" ? "User" : "Team Member"}
        </h2>
        {/* <p className="font-md text-capitalize text-left color-grey-500">
          Create a {type}
        </p> */}
      </div>
      <div>
        {state.login == 2 && (
          <form onSubmit={sendVerification}>
            <Tools
              backgroundColor="bg-white text-black"
              layout="flex-col"
              setState={setState}
              color={"text-black"}
              padding={"px-4 py-2"}
              state={state}
              inputs={[
                {
                  element: "text",
                  label: "Phone Number",
                  placeholder: "Enter Phone Number to continue",
                  name: "credential",
                  width: "w-full",
                },
              ]}
            />
            <button type="submit" loading={state.buttonLoading.toString()} className="btn btn-primary mt-3">
              Verify Phone
            </button>
          </form>
        )}
        {state.login === 1 && (
          <form onSubmit={login}>
            <Tools
              backgroundColor="bg-white bg-white"
              layout="flex-col"
              color={"text-black"}
              setState={setState}
              state={state}
              inputs={[
                {
                  element: "text",
                  label: "OTP",
                  name: "otp",
                  width: "w-full",
                },
              ]}
            />

            <button type="submit" loading={state.buttonLoading.toString()} className="btn btn-primary">
              Verify
            </button>
            <div className="countdown-text flex flex-row w-full justify-between">
              {seconds > 0 || minutes > 0 ? (
                <p className="my-3">
                  Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </p>
              ) : (
                <p className="my-3">Didn't recieve code?</p>
              )}

              <button
                disabled={seconds > 0 || minutes > 0}
                style={{
                  color: seconds > 0 || minutes > 0 ? "#DFE3E8" : "#FF5630",
                }}
                className="btn btn-primary"
                type="button"
                onClick={resendOTP}
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}
        {state.login == 0 && (
          <form onSubmit={register}>
            <Row>
              {type === "patient" ? (
                <Tools
                  backgroundColor="bg-white text-black"
                  setState={setState}
                  color={"text-black"}
                  state={state}
                  variant={"noLabel"}
                  inputs={[
                    {
                      element: "text",
                      label: "First Name",
                      name: "firstName",
                      required: true,
                      width: "col-6",
                    },
                    {
                      element: "text",
                      label: "Last Name",
                      name: "lastName",
                      required: true,
                      width: "col-6",
                    },
                    {
                      element: "date",
                      label: "Date Of Birth",
                      required: true,
                      name: "dateOfBirth",
                      width: "col-6",
                    },
                    {
                      element: "number",
                      label: "Age",
                      required: true,
                      name: "age",
                      width: "col-6",
                    },
                    {
                      element: "text",
                      label: "Phone Number",
                      disabled: true,
                      required: true,
                      name: "credential",
                      width: "col-6",
                    },
                    {
                      element: "text",
                      label: "OTP",
                      required: true,
                      name: "otp",
                      width: "col-6",
                    },
                  ]}
                />
              ) : (
                <Tools
                  backgroundColor="bg-white text-black"
                  layout="flex-col"
                  setState={setState}
                  color={"text-black"}
                  state={state}
                  variant={"noLabel"}
                  inputs={[
                    {
                      element: "text",
                      label: "First Name",
                      name: "firstName",
                      required: true,
                      width: "col-6",
                    },
                    {
                      element: "text",
                      label: "Last Name",
                      name: "lastName",
                      required: true,
                      width: "col-6",
                    },
                    {
                      element: "text",
                      label: "User Id",
                      required: true,
                      name: "userId",
                      width: "col-6",
                    },
                    {
                      element: "email",
                      label: "Email",
                      required: true,
                      name: "email",
                      width: "col-6",
                    },
                    {
                      element: "text",
                      label: "Phone Number",
                      disabled: true,
                      required: true,
                      name: "credential",
                      width: "col-6",
                    },
                    {
                      element: "text",
                      label: "OTP",
                      required: true,
                      name: "otp",
                      width: "col-6",
                    },
                    {
                      element: "text",
                      label: "Generate Password",
                      name: "password",
                      required: true,
                      width: "col-12",
                    },
                  ]}
                />
              )}
            </Row>

            <button type="submit" loading={state.buttonLoading.toString()} className="btn btn-primary mt-3">
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginComponent;
