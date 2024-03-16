import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Label,
  Row,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

//Import Flatepicker
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { createVideo, updateVideo } from "../apiTimes";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import config from "../../../config";

const VideoForm = () => {
  document.title = "Video | Psymate - Management Portal";

  const SingleOptions = [
   
  ];
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const [selectedMulti, setselectedMulti] = useState(null);

  function handleMulti(selectedMulti) {
    setselectedMulti(selectedMulti);
  }
  const currentDate = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (selectedDates) => {
    // Update the state with the selected date
    setSelectedDate(selectedDates[0]?.toISOString());
  };
  //Dropzone file upload
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

  /**
   * Formats the size
   */
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  const [Title, setTitle] = useState("");
  const [descriptionContent, setDescriptionContent] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState("");
  const [authorName, setAuthorName] = useState("Psymate Healthcare");
  const [videoLink, setVideoLink] = useState("");

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (event, editor) => {
    if (editor && typeof editor.getData === "function") {
      const content = editor.getData();
      setDescriptionContent(content); // Update the state with the editor content
      // Call your function here with the updated content
      // yourFunction(content);
    } else {
      console.error("Editor or getData method not available");
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    // Make a POST request to the backend
    const response = await axios.post(`${config.api.API_URL}/file/upload`, formData);

    // Return the response
    return response;
  };

  const handleThumbnailImage = async (e) => {
    const file = e.target.files[0];

    // Assuming you have a function to handle image upload using axios
    try {
      const response = await uploadImage(file);
      // Set the uploaded image URL in the state
      // res.results[0]
      setThumbnailImage(response.results[0].Location);
      console.log(response.results[0].Location)
    } catch (error) {
      console.error("Error uploading image:", error);
    }

  };

  const handleAuthorChange = (e) => {
    setAuthorName(e.target.value);
  };

  const handlevideoLink = (e) => {
    setVideoLink(e.target.value);
  };
  const [isChecked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    setChecked(!isChecked);
  };
  const [selectedMulticategory, setselectedMulticategory] = useState([]);
  const [sendselectedMulticategory, sendsetselectedMulticategory] = useState([]);
  const handleCreatecategory = (inputValue) => {
    // Handle the creation of a new option
    const newOption = { value: inputValue, label: inputValue };
    setselectedMulticategory((prevSelectedMulticategory) => [...prevSelectedMulticategory, newOption]);
  };

  useEffect(() => {
    // Update sendselectedMulticategory whenever selectedMulticategory changes
    const valuesArray = selectedMulticategory.map((e) => e.value);
    sendsetselectedMulticategory(valuesArray);
  }, [selectedMulticategory]);
 
  const handleMulticategoryChange = (selectedOptions) => {
    setselectedMulticategory(selectedOptions);
  };
  console.log(sendselectedMulticategory);
  console.log(selectedMulticategory);
  const [selectedMultitag, setselectedMultitag] = useState([]);
  const [sendselectedMultitag, sendsetselectedMultitag] = useState([]);
  const handleCreatetag = (inputValue) => {
    // Handle the creation of a new option
    const newOption = { value: inputValue, label: inputValue };
    setselectedMultitag((prevSelectedMultitag) => [...prevSelectedMultitag, newOption]);
  };

  useEffect(() => {
    // Update sendselectedMultitag whenever selectedMultitag changes
    const valuesArray = selectedMultitag.map((e) => e.value);
    sendsetselectedMultitag(valuesArray);
  }, [selectedMultitag]);
  const handleMultitagChange = (selectedOptions) => {
    setselectedMultitag(selectedOptions);
  };
  console.log(sendselectedMultitag);
  console.log(selectedMultitag);
  const [selectedMultikey, setselectedMultikey] = useState([]);
  const [sendselectedMultikey, sendsetselectedMultikey] = useState([]);
  const handleCreatekey = (inputValue) => {
    // Handle the creation of a new option
    const newOption = { value: inputValue, label: inputValue };
    setselectedMultikey((prevSelectedMultikey) => [...prevSelectedMultikey, newOption]);
  };

  useEffect(() => {
    // Update sendselectedMultikey whenever selectedMultikey changes
    const valuesArray = selectedMultikey.map((e) => e.value);
    sendsetselectedMultikey(valuesArray);
  }, [selectedMultikey]);


  const handleMultikeyChange = (selectedOptions) => {
    setselectedMultikey(selectedOptions);
  };
  useEffect(() => {
    if (id)
      axios.get(config.api.API_URL + `/videos?id=${id}`).then((res) => {
        setTitle(res.data.title);
        sendsetselectedMultikey(res.data.keywords)
        sendsetselectedMultitag(res.data.tags)
        setVideoLink(res.data.videoLink)
        setChecked(res.data.index == "index" ? true : false)
        sendsetselectedMulticategory(res.data)
        setDescriptionContent(res.data.description)
        setThumbnailImage(res.data.thumbnail)
        setSelectedDate(res.data.publishedDate)
        console.log(res)
      });
  }, []);
  const handleCreateArticle = async () => {
    const obj = JSON.parse(sessionStorage.getItem("authUser"))


    const author = {
      _id: obj._id,
      email: obj.userId,
      phone: obj.phone,
      displayName: obj.displayName
    }
    const data = {
      title: Title,
      description: descriptionContent,
      thumbnail: thumbnailImage,
      keywords: sendselectedMultikey,
      index: isChecked ? "index" : "noIndex",
      category: sendselectedMulticategory,
      tags: sendselectedMultitag,
      author: author,
      status: "active",
      readingTime: "10",
      type: "content",
      videoLink: videoLink,
      publishedDate: selectedDate
    };
    console.log(data)
    try {
      if (id) {
        const response = await updateVideo(data, id)

      } else {
        const response = await createVideo(data);
      }
      console.log(data)
      // console.log("Lead created successfully:", response);
      window.location.reload();
    } catch (error) {
      console.error("Error creating article:", error.message);
    }
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Create Video" pageTitle="Video" />
          <Row pb={5}>
            <Col lg={8} className="pb-5">
              <Card>
                <CardBody>
                  <div className="mb-3">
                    <Label className="form-label" htmlFor="project-title-input">
                      Video Title
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="project-title-input"
                      placeholder="Enter project title"
                      value={Title}
                      onChange={handleTitle}
                    />
                  </div>

                  <div className="mb-3">
                    <Label
                      className="form-label"
                      htmlFor="project-thumbnail-img"
                    >
                      Thumbnail Image
                    </Label>
                    <Input
                      className="form-control"
                      id="project-thumbnail-img"
                      type="file"
                      accept="image/png, image/gif, image/jpeg"
                      // value={thumbnailImage}
                      onChange={handleThumbnailImage}
                    />
                  </div>

                  <div className="mb-3 d-flex  flex-column">
                    <Label className="form-label">Video Description</Label>

                    <CKEditor
                      editor={ClassicEditor}
                      data=""
                      onReady={(editor) => {
                        // You can store the "editor" and use it when needed.
                      }}
                      onChange={handleDescriptionChange}
                    />
                  </div>

                  <div className="mb-3 d-flex  flex-column">
                    <Label className="form-label">Video Link </Label>

                    <Input
                      type="text"
                      placeholder="Enter the video link"
                      value={videoLink}
                      onChange={handlevideoLink}
                    />
                  </div>
                </CardBody>
              </Card>

              <div className="text-end mb-4">
                {/* <button type="submit" className="btn btn-danger w-sm me-1">
                  Delete
                </button> */}
                <button type="submit" className="btn btn-secondary w-sm me-1">
                  Draft
                </button>
                <button
                  onClick={handleCreateArticle}
                  type="submit"
                  className="btn btn-success w-sm"
                >
                  {id ? "Update" : "Create"}
                </button>
              </div>
            </Col>
            <Col lg={4}>
            <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Tags </h5>
                </div>
                <CardBody>
                  <div className="mb-3">
                    <Label
                      htmlFor="choices-categories-input"
                      className="form-label"
                    >
                      Tags
                    </Label>
                    <CreatableSelect
                      isMulti
                      onChange={handleMultitagChange}
                      options={SingleOptions}
                      value={selectedMultitag}
                      onCreateOption={handleCreatetag}
                    />
                  </div>
                </CardBody>
              </div>
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">category  </h5>
                </div>
                <CardBody>
                  <div className="mb-3">
                    <Label
                      htmlFor="choices-categories-input"
                      className="form-label"
                    >
                      category
                    </Label>
                    <CreatableSelect
                      isMulti
                      onChange = {handleMulticategoryChange}
                      options={SingleOptions}
                      value={selectedMulticategory}
                      onCreateOption={handleCreatecategory}
                    />
                  </div>
                </CardBody>
              </div>
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">keywords </h5>
                </div>
                <CardBody>
                  <div className="mb-3">
                    <Label
                      htmlFor="choices-categories-input"
                      className="form-label"
                    >
                      keywords
                    </Label>
                    <CreatableSelect
                      isMulti
                      onChange={handleMultikeyChange}
                      options={SingleOptions}
                      value={selectedMultikey}
                      onCreateOption={handleCreatekey}
                    />
                  </div>
                </CardBody>
              </div>
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Published </h5>
                </div>
                <CardBody>
                  <div className="mb-3">
                    <Label htmlFor="choices-categories-input" className="form-label">
                      {isChecked ? "Published" : "Not Published"}
                    </Label>
                    <input
                      type="checkbox"
                      id="choices-categories-input"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                      style={{ marginLeft: "5px" }}
                    />
                  </div>
                </CardBody>
              </div>
    
              <div>
                <Label
                  htmlFor="datepicker-deadline-input"
                  className="form-label"
                >
                  Published Date
                </Label>
                <Flatpickr
                  className="form-control"
                  options={{
                    dateFormat: "d M, Y",
                    onChange: handleDateChange,
                    minDate: currentDate,
                  }}
                  placeholder="Selact Date"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default VideoForm;
