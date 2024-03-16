import React, { useEffect, useState } from "react";
import AssessmentLayout from "../../../../../helpers/AssessmentLayout";
import axios from "axios";
import config from "../../../../../config";
import { useProfile } from "../../../../../Components/Hooks/UserHooks";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Col, Row } from "reactstrap";
import { validateForm } from "../../../../../helpers/Helper";
import { toast } from "react-toastify";
import comingsoon from "../../../../../assets/images/comingsoon.png";

const TakeAssessment = () => {
  const [inputs, setInputs] = useState([]);
  const [form, setForm] = useState();
  const [data, setData] = useState([]);
  const [state, setState] = useState({});
  const initialState = {};

  const searchParams = new URLSearchParams(window.location.search);
  const formId = searchParams.get("assessment");
  const userId = searchParams.get("patient");
  const doctor = searchParams.get("doctor");
  const token = searchParams.get("token");
  const layout = searchParams.get("layout");

  const getData = async () => {
    if (formId && userId)
      await axios
        .get(
          config.api.API_URL +
            `/clinical_data?patientId=${userId}&formId=${formId}`,
          {
            headers: { Authorization: token },
          }
        )
        .then((res) => {
          setData(res.data);
        });
  };

  const getForms = async () => {
    await axios
      .get(`/api/tools?id=${formId}`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        const data = res.data?.[0];
        setForm(data);
        setInputs(data?.items);
        if (!data) {
          toast.success("Assessment Link Invalid")
          window.location.href = "/apps-lab-assessments";
        }
      });
  };

  useEffect(() => {
    if (formId && userId) {
      getData();
      getForms();
    }
    if (form) {
      form.items.forEach((input) => {
        initialState[input.name] = "";
      });
      setState(initialState);
      setInputs(form.items);
    }
  }, [formId, userId]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [surveyComplete, setSurveyComplete] = useState(false);

  const currentQuestion = inputs[currentQuestionIndex];

  const handleAnswer = (answer) => {
    const questionName = currentQuestion?.name;

    // Store the answer in the answers object
    setState((prevAnswers) => ({
      ...prevAnswers,
      [questionName]: answer,
    }));

    // Move to the next question
    if (currentQuestionIndex < inputs.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All inputs answered, submit answers and mark survey as complete
      save();
    }
  };
  const slideInFromRight = {
    hidden: { x: "100%" },
    visible: { x: "0%", transition: { duration: 0.5, ease: "easeInOut" } },
  };
  console.log(state);
  const handleSkip = () => {
    // Move to the next question
    if (currentQuestionIndex < inputs.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All inputs answered, submit answers and mark survey as complete
      save();
    }
  };

  const completedAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const textAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.5 },
    },
  };

  const [textInputValue, setTextInputValue] = useState(""); // State to track the text input value

  const handleTextChange = (e) => {
    // Update the text input value as the user types
    setTextInputValue(e.target.value);
  };

  const handleTextSubmit = () => {
    // Submit the text input value when the user clicks the "Submit" button
    handleAnswer(textInputValue);
  };
  const save = async () => {
    setSurveyComplete(true);
    await axios
      .post(
        `/clinical_data`,
        {
          formId: formId,
          patientId: userId,
          doctorId: doctor,
          data: state,
        },
        {
          headers: { Authorization: token },
        }
      )
      .then((res) => {
        setState(initialState);
        toast.success(
          `${form.displayName} Saved on ${new Date().toLocaleDateString()}`
        );
        setTimeout(() => {
          window.close();
        }, 2000);
      });
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (validateForm(inputs, setInputs, state)) save();
        else toast.error(`${form.displayName} was not completed `);
      }}
    >
      {surveyComplete ? (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={completedAnimation}
            className={`py-8 px-4 text-gray-900 mx-auto max-w-screen-xl lg:py-16 lg:px-6`}
          >
            <div
              className={`mx-auto max-w-screen-md text-center mb-8 lg:mb-12`}
            >
              <div className="mb-sm-5 pb-sm-4 pb-5">
                <img
                  src={comingsoon}
                  alt=""
                  height="120"
                  className="move-animation"
                />
              </div>
              <motion.h2
                className={`mb-4 text-4xl tracking-tight font-extrabold text-gray-900`}
                variants={textAnimation}
              >
                Thanks for Submitting!
              </motion.h2>
              <motion.p
                className={`mb-4 text-4xl tracking-tight font-extrabold text-gray-900`}
                variants={textAnimation}
              >
                This browser will close in a few seconds!
              </motion.p>
              {/* Additional content or a redirect can be added here */}
            </div>
          </motion.div>
        </div>
      ) : layout === "assessment" ? (
        <div className="container py-5 justify-content-center align-items-center min-vh-100">
          <AssessmentLayout
            heading={form?.displayName}
            form={inputs}
            state={state}
            setState={setState}
          />
          <Button type="submit">Submit</Button>

          {/* {data?.map((i) => {
            return (
              <tr key={i._id}>
                <td>{new Date(i.createdAt).toLocaleString()}</td>
                <td className="link-success"></td>
              </tr>
            );
          })} */}
        </div>
      ) : (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
          <h5 className="m-2 rounded bg-light p-3 text-black text-center text-uppercase">
            {form?.displayName}
          </h5>
          <AnimatePresence exitBeforeEnter={false}>
            <motion.section
              key={currentQuestionIndex}
              className={`h-screen`}
              variants={slideInFromRight}
              initial={{ y: 300, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <motion.div
                className={`py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6`}
                variants={slideInFromRight}
              >
                <motion.div
                  className="mx-auto max-w-screen-md mb-8 lg:mb-12"
                  variants={slideInFromRight}
                >
                  <h2
                    className={`mb-4 text-4xl tracking-tight font-extrabold text-gray-900`}
                  >
                    Question {currentQuestionIndex + 1}
                  </h2>
                  <p className={`mb-4 text-lg text-gray-600`}>
                    {currentQuestion?.label}
                  </p>
                  <motion.div
                    className={`d-flex flex-column`}
                    variants={slideInFromRight}
                  >
                    {currentQuestion?.type === "text" ? (
                      <>
                        <motion.input
                          type="text"
                          placeholder="Enter your answer"
                          className={`form-control mb-4`}
                          variants={textAnimation}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.95 }}
                          onChange={handleTextChange}
                        />
                        {/* Submit button for text input */}
                        <motion.button
                          type="button"
                          whileHover={{
                            scale: 1.05,
                            backgroundColor: "#f8b133",
                          }}
                          whileTap={{ scale: 0.95 }}
                          className={`btn btn-primary mb-2`}
                          onClick={handleTextSubmit}
                        >
                          Submit
                        </motion.button>
                      </>
                    ) : (
                      currentQuestion?.items.split(",").map((option, index) => (
                        <motion.button
                          whileHover={{
                            scale: 1.05,
                            backgroundColor: "#f8b133",
                          }}
                          whileTap={{ scale: 0.95 }}
                          key={index}
                          type="button"
                          className={`btn btn-secondary mb-2`}
                          onClick={() => handleAnswer(option)}
                          variants={slideInFromRight}
                        >
                          {option.split("~")[1] || option.split("~")[0]}
                        </motion.button>
                      ))
                    )}
                    {currentQuestion?.required === "false" && (
                      <motion.button
                        type="button"
                        className={`btn btn-link mt-2`}
                        onClick={handleSkip}
                        variants={slideInFromRight}
                      >
                        Skip
                      </motion.button>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.section>
          </AnimatePresence>
        </div>
      )}
    </form>
  );
};

export default TakeAssessment;
