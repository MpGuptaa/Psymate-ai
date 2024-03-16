import React, { useEffect, useState } from "react";
import { Row, Col, CardBody, Card, Alert, Container, Input, Label, Form, FormFeedback, Button } from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../config";

// action
import { registerUser, apiError, resetRegisterFlag, loginUser } from "../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";

//import images
import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import axios from "axios";

const Register = (props) => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [code, setCode] = useState("");
  const [rensendField, setResendField] = useState(false);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      phone: "",
      displayName: "",
    },
    validationSchema: Yup.object().shape({
      phone: Yup.string().required("Please enter your phone number"),
      displayName: Yup.string().required("Please enter your name"),
    }),
    onSubmit: (values) => {
      const handleSignIn = async (e) => {
        e?.preventDefault();
        if (otpValue) {
          const isOTPVerified = await verifyOTP();
          console.log('isotp verified-> ', isOTPVerified);
          if (isOTPVerified) {
            console.log('verifyotp-', verifyOTP());
            const userData = {
              createdAt: new Date(),
              isAdmin: null,
              phone: values.phone,
              displayName: values.displayName,
            };
            axios
              .post(
                // `${config.api.API_URL}/login/register?type=patient`,
                `http://localhost:200/login/register?type=patient`,
                {
                  data: userData,
                },
                {
                  "Content-Type": "application/json",
                },
              )
              .then(async (responseData) => {
                if (responseData.status === 200) {
                  const response = responseData.data.user;
                  dispatch(
                    loginUser(
                      response,
                      `/layout/tabs/top?id=${responseData.data.user._id}&formId=65bf466b28261e8891c8b813`,
                    ),
                  );
                  toast.success(`${response.displayName} Is now registered with Psymate Healthcare`);
                  // history("/personal-details");
                }
              })
              .catch((error) => {
                console.log(error);
                toast.error("Invalid Inputs");
              });
          }
          else{
            // setTimeout(()=>{
            //   window.location.reload();
            // }, 3000);
            toast.error(`Invalid OTP`);
          }
        }
      };
      handleSignIn();
    },
  });
  const getOTP = async (phone) => {
    await axios
      .get(`${config.api.API_URL}/login/${phone}`)
      .then((res) => {
        console.log("res-", res);
        if (res.status === 500) {
          alert("We are Sorry", res.message);
        }
        if (res.login) {
          return toast.error("Already Registered");
        }
        setCode(res.message);
        setShowOtpField(true);
      })
      .catch((error) => {
        console.log("error", error);
      });
    setResendField(true);
  };

  const resendOTP = async () => {
    await axios
      .get(`${config.api.API_URL}/login/resend/otp${validation.values.phone}`)
      .then((res) => {
        toast.success("OTP sent again");
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  const verifyOTP = async () => {
    console.log("verification");
    try {
      const res = await axios.get(`${config.api.API_URL}/login/verify/${validation.values.phone}/${otpValue}`);
      console.log("verified-> ", res.message);
      toast.success(res.message);
      return true;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  };

  const { error, registrationError, success } = useSelector((state) => ({
    registrationError: state.Account.registrationError,
    success: state.Account.success,
    error: state.Account.error,
  }));

  useEffect(() => {
    dispatch(apiError(""));
  }, [dispatch]);

  // useEffect(() => {
  //   if (success) {
  //     setTimeout(() => history("/login"), 3000);
  //   }

  //   setTimeout(() => {
  //     dispatch(resetRegisterFlag());
  //   }, 3000);
  // }, [dispatch, success, error, history]);

  document.title = "Basic SignUp | Psymate - Management Portal";

  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className="auth-page-content">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-white-50">
                  <div>
                    <Link to="/" className="d-inline-block auth-logo">
                      <img src={logoLight} alt="" width="40" />
                    </Link>
                  </div>
                  <p className="fs-25 text-capitalize text-white fw-medium">Premium Admin & Dashboard Template</p>
                </div>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">Create New Account</h5>
                      <p className="text-muted">Get your free Psymate account now</p>
                    </div>
                    <div className="p-2 mt-4">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                        className="needs-validation"
                        action="#"
                      >
                        {success && success ? (
                          <>
                            {toast("Your Redirect To Login Page...", {
                              position: "top-right",
                              hideProgressBar: false,
                              className: "bg-success text-white",
                              progress: undefined,
                              toastId: "",
                            })}
                            <ToastContainer autoClose={2000} limit={1} />
                            <Alert color="success">Register User Successfully and Your Redirect To Login Page...</Alert>
                          </>
                        ) : null}

                        {error && error ? (
                          <Alert color="danger">
                            <div>
                              {/* {registrationError} */}
                              Phoone number has been Register Before, Please Use Another Phoone number...{" "}
                            </div>
                          </Alert>
                        ) : null}

                        <div className="mb-3">
                          <Label htmlFor="phone" className="form-label">
                            Phone number <span className="text-danger">*</span>
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            className="form-control"
                            placeholder="Enter phone number"
                            type="number"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.phone || ""}
                            invalid={validation.touched.phone && validation.errors.phone ? true : false}
                          />
                          {validation.touched.phone && validation.errors.phone ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.phone}</div>
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="displayName" className="form-label">
                            Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="displayName"
                            type="text"
                            placeholder="Enter name"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.displayName || ""}
                            invalid={validation.touched.displayName && validation.errors.displayName ? true : false}
                          />
                          {validation.touched.displayName && validation.errors.displayName ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.displayName}</div>
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-4">
                          <p className="mb-0 fs-12 text-muted fst-italic">
                            By registering you agree to the Psymate
                            <Link to="#" className="text-primary text-decoration-underline fst-normal fw-medium">
                              Terms of Use
                            </Link>
                          </p>
                        </div>

                        {showOtpField && (
                          <Row>
                            <Col sm={12}>
                              <div className="mb-3">
                                <Label htmlFor="otpbar" className="form-label">
                                  OTP
                                </Label>
                                <Input
                                  id="otpbar"
                                  type="number"
                                  value={otpValue}
                                  onChange={(e) => setOtpValue(e.target.value)}
                                  className="form-control"
                                />
                              </div>
                            </Col>
                          </Row>
                        )}

                        <div className="mt-4">
                          {showOtpField ? (
                            <button className="btn btn-success w-100" type="submit">
                              Sign Up
                            </button>
                          ) : (
                            <button
                              className="btn btn-success w-100"
                              onClick={() => getOTP(validation.values.phone)}
                              type="button"
                            >
                              Get OTP
                            </button>
                          )}
                        </div>

                        <div className="mt-4 text-center">
                          <div className="signin-other-title">
                            <h5 className="fs-13 mb-4 title text-muted">Create account with</h5>
                          </div>

                          <div>
                            <button type="button" className="btn btn-primary btn-icon waves-effect waves-light">
                              <i className="ri-facebook-fill fs-16"></i>
                            </button>{" "}
                            <button type="button" className="btn btn-danger btn-icon waves-effect waves-light">
                              <i className="ri-google-fill fs-16"></i>
                            </button>{" "}
                            <button type="button" className="btn btn-dark btn-icon waves-effect waves-light">
                              <i className="ri-github-fill fs-16"></i>
                            </button>{" "}
                            <button type="button" className="btn btn-info btn-icon waves-effect waves-light">
                              <i className="ri-twitter-fill fs-16"></i>
                            </button>
                          </div>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
                <div className="mt-4 text-center">
                  <p className="mb-0">
                    Already have an account ?{" "}
                    <Link to="/login" className="fw-semibold text-primary text-decoration-underline">
                      {" "}
                      Signin{" "}
                    </Link>{" "}
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default Register;
