import React from "react";
import {
  AsyncSelectInput,
  BasicInput,
  BasicSelectInput,
  CheckBoxInput,
  DocumentInput,
  EditorInput,
  ImageInput,
  MultipleInput,
  PickerInput,
  RadioInput,
  RangeInput,
  SelectInput,
  TextareaInput,
} from "./Inputs";

const Tools = ({ inputs, setState, state }) => {
  return inputs?.map((k, index) => {
    if (
      k.element === "basicInput" ||
      k.element === "number" ||
      k.element === "text" ||
      k.element === "date" ||
      k.element === "email" ||
      k.element === "time" ||
      k.element === "color" ||
      k.element === "password"
    ) {
      return <BasicInput key={index} k={k} state={state} setState={setState} />;
    } else if (k.element === "select") {
      return (
        <SelectInput key={index} k={k} state={state} setState={setState} />
      );
    } else if (k.element === "basicSelect") {
      return (
        <BasicSelectInput key={index} k={k} state={state} setState={setState} />
      );
    } else if (k.element === "api") {
      return (
        <AsyncSelectInput key={index} k={k} state={state} setState={setState} />
      );
    } else if (k.element === "textarea") {
      return (
        <TextareaInput key={index} k={k} state={state} setState={setState} />
      );
    } else if (k.element === "checkbox") {
      return (
        <CheckBoxInput key={index} k={k} state={state} setState={setState} />
      );
    } else if (k.element === "radio") {
      return <RadioInput key={index} k={k} state={state} setState={setState} />;
    } else if (k.element === "picker") {
      return (
        <PickerInput key={index} k={k} state={state} setState={setState} />
      );
    } else if (k.element === "range") {
      return <RangeInput key={index} k={k} state={state} setState={setState} />;
    } else if (k.element === "image") {
      return <ImageInput key={index} k={k} state={state} setState={setState} />;
    } else if (k.element === "multiple") {
      return (
        <MultipleInput key={index} k={k} state={state} setState={setState} />
      );
    } else if (k.element === "document") {
      return (
        <DocumentInput key={index} k={k} state={state} setState={setState} />
      );
    } else if (k.element === "editor") {
      return (
        <EditorInput key={index} k={k} state={state} setState={setState} />
      );
    } else {
      return null;
    }
  });
};

export default Tools;
