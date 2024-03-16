import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import Tools from "../../pages/Forms/Builder/Tools";
import ChildrenModal from "./ChildrenModal";
import axios from "axios";
import config from "../../config";
import { toast } from "react-toastify";

const Share = ({ timeline }) => {
  const [emailDialog, setEmailDialog] = useState(false);
  const [email, setEmail] = useState({});
  const printPrescription = () => {
    window.print();
  };
  const openEmailDialog = () => {
    setEmailDialog(true);
  };

  const closeEmailDialog = () => {
    setEmailDialog(false);
  };

  return (
    <>
      <ChildrenModal size={"sm"} show={emailDialog} onSubmit={() => {}} buttons={false} onCloseClick={closeEmailDialog}>
        <Tools
          state={email}
          setState={setEmail}
          inputs={[
            {
              label: "Enter Email",
              name: "email",
              required: "true",
              element: "email",
            },
          ]}
        />
        <Button
          onClick={() => {
            axios
              .post(`${config.api.API_URL}/file/send/email`, {
                subject: timeline.description,
                htmlTemplate: `PFA ${timeline.title}`,
                email: email,
                path: timeline.title,
                url: timeline?.reference?.document?.[0]?.Location,
              })
              .then((res) => {
                setEmail({ email: "" });
                setEmailDialog(false);
                toast.success("Email Sent.");
              });
          }}
          className="mt-2 btn btn-success"
        >
          <i className="ri-send-plane-2-fill align-bottom me-1"></i> Send
        </Button>
      </ChildrenModal>

      <div className="hstack gap-2 justify-content-end d-print-none">
        {/* <Link to="#" onClick={printPrescription} className="btn btn-success">
          <i className="ri-printer-line align-bottom me-1"></i> Print
        </Link> */}

        <Button onClick={openEmailDialog} className="btn btn-success">
          <i className="ri-send-plane-2-fill align-bottom me-1"></i> Send Email
        </Button>

        <Link to={timeline?.reference?.document?.[0]?.Location} className="btn btn-primary">
          <i className="ri-download-2-line align-bottom me-1"></i> Download
        </Link>
      </div>
    </>
  );
};
export default Share;
