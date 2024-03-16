import PropTypes from "prop-types";
import React, { useState } from "react";
import CallBoxConfirmationDialogBox from './CallBoxConfirmationDialogBox'

const CallBoxWidget = () => {
  const [deleteModal, setDeleteModal] = useState(false);

  return (
    <div className="col-sm-auto ms-auto">
      <CallBoxConfirmationDialogBox
        show={deleteModal}
        messages={"Call has been triggered successfully"}
        onCloseClick={() => setDeleteModal(false)}
      />
      <button
       className="btn btn-primary"
       type="button"
       onClick={() => {
        setDeleteModal(true)
       }}
       >
        Click To Call
      </button>
    </div>
  );
};

CallBoxWidget.propTypes = {
  messages: PropTypes.string,
  onCloseClick: PropTypes.func,
  show: PropTypes.any,
};

export default CallBoxWidget;
