import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { Link } from "react-router-dom";
import { Card, Col, Input, Label, Row } from "reactstrap";

const OtherInfo = ({ isContainerEnabled }) => {
  const unitDecimal = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const [selectedFiles, setselectedFiles] = useState([]);
  const [files, setFiles] = useState([]);

  function handleAcceptedFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  return (
    <div className={isContainerEnabled ? "" : "disabled-tab"}>
      <div className="tab-pane fade show advacnceInfo">
        <div className="row mr-0 mr-sm-n3 d-flex align-items-stretch mb-2">
          <div className="col-md-6 col-lg-12">
            <div className="row">
              <div className="col-md-12 pr-0">
                <div className="form-group-cont row m-0">
                  <Label
                    className="col-4 col-sm-5 col-form-label"
                    style={{ padding: "10px" }}
                  >
                    Min. Margin %
                  </Label>
                  <div className="col-8 col-sm-7">
                    <Input
                      autoComplete="off "
                      className="form-control ng-untouched ng-pristine ng-valid"
                      //   value={}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-12 pr-0">
                <div className="form-group-cont row m-0">
                  <Label
                    className="col-4 col-sm-5 col-form-label"
                    style={{ padding: "10px" }}
                  >
                    Prohibited
                  </Label>
                  <div className="col-8 col-sm-7">
                    <Row>
                      <Col>
                        <select
                          className=" form-select form-control ng-untouched ng-pristine ng-valid"
                          aria-label="Default select example"
                        >
                          {unitDecimal.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                          <i className="las la-angle-down"></i>
                        </select>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>

              <div className="col-md-12 pr-0">
                <div className="form-group-cont row m-0">
                  <Label
                    className="col-4 col-sm-5 col-form-label"
                    style={{ padding: "10px" }}
                  >
                    Visibility{" "}
                  </Label>
                  <div className="col-8 col-sm-7">
                    <Row>
                      <Col>
                        <select
                          className=" form-select form-control ng-untouched ng-pristine ng-valid"
                          aria-label="Default select example"
                        >
                          {unitDecimal.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                          <i className="las la-angle-down"></i>
                        </select>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>

              <div className="col-md-12 pr-0">
                <div className="form-group-cont row m-0">
                  <Label
                    className="col-4 col-sm-5 col-form-label"
                    style={{ padding: "10px" }}
                  >
                    Min. Margin %
                  </Label>
                  <div className="col-8 col-sm-7">
                    <Input
                      autoComplete="off "
                      className="form-control ng-untouched ng-pristine ng-valid"
                      //   value={}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-12 pr-0">
                <div className="form-group-cont row m-0">
                  <Label
                    className="col-4 col-sm-5 col-form-label"
                    style={{ padding: "10px" }}
                  >
                    Upload Image
                  </Label>
                  <div className="co-8 col-sm-7">
                    <Dropzone
                      onDrop={(acceptedFiles) => {
                        handleAcceptedFiles(acceptedFiles);
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div className="dropzone dz-clickable">
                          <div
                            className="dz-message needsclick"
                            {...getRootProps()}
                          >
                            <div className="mb-3">
                              <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                            </div>
                            <h4>Drop files here or click to upload.</h4>
                          </div>
                        </div>
                      )}
                    </Dropzone>
                    <div className="list-unstyled mb-0" id="file-previews">
                      {selectedFiles.map((f, i) => {
                        return (
                          <Card
                            className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                            key={i + "-file"}
                          >
                            <div className="p-2">
                              <Row className="align-items-center">
                                <Col className="col-auto">
                                  <img
                                    data-dz-thumbnail=""
                                    height="80"
                                    className="avatar-sm rounded bg-light"
                                    alt={f.name}
                                    src={f.preview}
                                  />
                                </Col>
                                <Col>
                                  <Link
                                    to="#"
                                    className="text-muted font-weight-bold"
                                  >
                                    {f.name}
                                  </Link>
                                  <p className="mb-0">
                                    <strong>{f.formattedSize}</strong>
                                  </p>
                                </Col>
                              </Row>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherInfo;
