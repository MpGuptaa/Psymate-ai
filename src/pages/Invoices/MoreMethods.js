import React, { useState } from "react";
import Select from "react-select";
import {
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Row,
  Table,
} from "reactstrap";
import Tools from "../Forms/Builder/Tools";

const PaymentForm = ({ isOpen, state, setState, setInvoiceModal }) => {
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState([]);

  const handleSaveInvoice = () => {
    const totalAmount = selectedPaymentMethods.reduce(
      (acc, method) => acc + Number(method.amount),
      0
    );
    setState({
      ...state,
      methods: selectedPaymentMethods,
      amtPaid: totalAmount,
    });
    setTimeout(()=>{
      setInvoiceModal(false);
    }, [1000])
  };
  const handleInputChange = (name, value, index) => {
    const updatedMethods = [...selectedPaymentMethods];
    updatedMethods[index] = { ...updatedMethods[index], [name]: value };
    setSelectedPaymentMethods(updatedMethods);
  };

  const handlePaymentMethodChange = (selectedOption) => {
    const paymentMethod = selectedOption.value;

    if (
      !selectedPaymentMethods.some((method) => method.value === paymentMethod)
    ) {
      setSelectedPaymentMethods([
        ...selectedPaymentMethods,
        { value: paymentMethod, amount: state.amount || 0 },
      ]);
    }
  };

  const handleRemovePaymentMethod = (index) => {
    const updatedMethods = [...selectedPaymentMethods];
    updatedMethods.splice(index, 1);
    setSelectedPaymentMethods(updatedMethods);
  };

  const renderPaymentFields = () => {
    switch (state.method) {
      case "Card":
        return (
          <Tools
            setState={handleInputChange}
            state={state}
            inputs={[
              {
                name: "cardNumber",
                label: "Card Number",
                element: "number",
              },
              {
                name: "cardHolderName",
                label: "Card Holder Name",
                element: "text",
              },
            ]}
          />
        );
      case "UPI":
        return (
          <Tools
            setState={handleInputChange}
            state={state}
            inputs={[
              {
                name: "upi",
                label: "UPI ID",
                element: "text",
              },
            ]}
          />
        );
      case "Bank transfer":
        return (
          <Tools
            setState={handleInputChange}
            state={state}
            inputs={[
              {
                name: "bankAccountNumber",
                label: "Bank Account Number",
                element: "number",
              },
              {
                name: "ifscCode",
                label: "IFSC Code",
                element: "text",
              },
            ]}
          />
        );
      default:
        return null;
    }
  };

  const renderPaymentMethods = () => {
    return selectedPaymentMethods.map((method, index) => (
      <tr key={index}>
        <td>{method.value}</td>
        <td>
          <Input
            type="text"
            placeholder="Amount"
            value={method.amount}
            onChange={(e) => handleInputChange("amount", e.target.value, index)}
          />
        </td>
        <td>
          <Button
            color="danger"
            size="sm"
            onClick={() => handleRemovePaymentMethod(index)}
          >
            Remove
          </Button>
        </td>
      </tr>
    ));
  };

  return (
    <Modal isOpen={isOpen} id="event-modal" centered>
      <ModalBody>
        <Row>
          <Col lg={8}>
            <Select
              options={[
                { value: "Cash", label: "Cash" },
                { value: "Bank transfer", label: "Bank transfer" },
                { value: "UPI", label: "UPI" },
                { value: "Card", label: "Card" },
                { value: "Practo", label: "Practo" },
              ]}
              placeholder="Select Payment Method"
              onChange={handlePaymentMethodChange}
            />
          </Col>
          <Col lg={4}>
            <Input
              type="text"
              disabled
              value={state.amtPaid}
              placeholder="Total Amount"
              onChange={(e) => handleInputChange("amount", e.target.value)}
            />
          </Col>
        </Row>

        {renderPaymentFields()}

        <hr />

        <h5>Selected Payment Methods</h5>
        <Table striped>
          <thead>
            <tr>
              <th>Payment Method</th>
              <th>Amount Paid</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{renderPaymentMethods()}</tbody>
        </Table>
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={() => setInvoiceModal(false)}>
          Discard
        </Button>
        <Button color="primary" onClick={handleSaveInvoice}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default PaymentForm;
