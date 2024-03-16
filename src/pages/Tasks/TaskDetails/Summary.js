import React, { useEffect } from 'react';
import { Card, CardBody, Input, Label } from 'reactstrap';
import { getTaskList } from "../../../store/actions";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../Components/Common/Loader";
const Summary = ({ taskId }) => {
    const dispatch = useDispatch();
    const itemId = "";
    const { taskList, error } = useSelector((state) => ({
        taskList: state.Tasks.taskList._doc,
        error: state.Tasks.error,
    }));
    useEffect(() => {
        dispatch(getTaskList(itemId, taskId));
    }, [dispatch, itemId, taskId]);
    return (
        taskList ?
            <React.Fragment>
                <Card>
                    <CardBody>
                        <div className="text-muted">
                            <h6 className="mb-3 fw-semibold text-uppercase">Summary</h6>
                            <p>{taskList.description}</p>
                        </div>
                    </CardBody>
                </Card>
            </React.Fragment> : <Loader />
    );
};

export default Summary;