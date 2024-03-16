import React, { useEffect, useState } from "react";
import { Link, useNavigate , useLocation } from "react-router-dom";
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
import axios from "axios";
import config from "../../../config";
//Import Flatepicker
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import Dropzone from "react-dropzone";

//Import Images
import avatar3 from "../../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../../assets/images/users/avatar-4.jpg";
import { createArticles, updateArticles } from "../apiTimes";
import CreatableSelect from "react-select/creatable";

const Article = () => {
  document.title = "Create Article | Psymate - Management Portal";
  const navigate = useNavigate();
  const SingleOptions = [
   
  ];
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  console.log(id)
  const [selectedMulti, setselectedMulti] = useState(null);

  function handleMulti(selectedMulti) {
    setselectedMulti(selectedMulti);
  }

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

  console.log(selectedFiles)
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

  const [articleTitle, setArticleTitle] = useState("");
  const [descriptionContent, setDescriptionContent] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");

  const handleArticleTitle = (e) => {
    setArticleTitle(e.target.value);
  };

  const handleDescriptionChange = (event, editor) => {
    if (editor && typeof editor.getData === "function") {
      const content = editor.getData();
      // Remove HTML tags from the content
      stripHtmlTags(content);
    } else {
      console.error("Editor or getData method not available");
    }
  };

  // Function to strip HTML tags from a string
  const stripHtmlTags = (htmlString) => {
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    setDescriptionContent(doc.body.textContent || ""); // Update the state with the editor content

    // return doc.body.textContent || "";
  };

  const handleContentChange = (event, editor) => {
    if (editor && typeof editor.getData === "function") {
      const content = editor.getData();
      setContent(content); // Update the state with the editor content
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
  const handleThumbnailChange = async (event) => {
    const file = event.target.files[0];
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
  console.log(sendselectedMultikey)
  console.log(selectedMultikey)
  const currentDate = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (selectedDates) => {
    // Update the state with the selected date
    setSelectedDate(selectedDates[0]?.toISOString());
  };
  console.log(selectedDate)
  useEffect(() => {
    if (id)
      axios.get(config.api.API_URL + `/article?id=${id}`).then((res) => {
        setArticleTitle(res.data.title);
        setselectedMultikey(res.data.keywords)
       setselectedMultitag(res.data.tags)
        setContent(res.data.content)
        setChecked(res.data.index=="index" ? true:false)
        setselectedMulticategory(res.data.category)
        setDescriptionContent(res.data.description)
        setThumbnailImage(res.data.thumbnail)
        setSelectedDate(res.data.publishedDate)
        console.log(res)
      });
  }, [id]);
  const handleCreateArticle = async () => {
    const obj = JSON.parse(sessionStorage.getItem("authUser"))
    const author = {
      _id: obj._id,
      email: obj.userId,
      phone: obj.phone,
      displayName: obj.displayName
    }
    const data = {
      title: articleTitle,
      description: descriptionContent,
      author: author,
      thumbnail: thumbnailImage,
      content: content,
      keywords: sendselectedMultikey,
      index: isChecked ? "index" : "noIndex",
      category: sendselectedMulticategory,
      tags: sendselectedMultitag,
      publishedDate:selectedDate
    };

    try {
      if (id){
        const response = await updateArticles(data,id)
        if(response.status==200){
          navigate("/teams-articles");
        }
       
      }else{
        const response = await createArticles(data);
        if(response.status==200){
          navigate("/teams-articles");
        }
        // console.log(response)
      }
     
     
      // console.log("Lead created successfully:", response);
      // window.location.reload();
    } catch (error) {
      console.error("Error creating article:", error.message);
    }
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Create Article" pageTitle="Article" />
          <Row pb={5}>
            <Col lg={8} className="pb-5">
              <Card>
                <CardBody>
                  <div className="mb-3">
                    <Label className="form-label" htmlFor="project-title-input">
                      Article Title
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="project-title-input"
                      placeholder="Enter project title"
                      value={articleTitle}
                      onChange={handleArticleTitle}
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
                      onChange={handleThumbnailChange}
                    />
                  </div>

                  <div className="mb-3 d-flex  flex-column">
                    <Label className="form-label">Article Description</Label>

                    <CKEditor
                      editor={ClassicEditor}
                      data="<p>Hello from CKEditor 5!</p>"
                      onReady={(editor) => {
                        // You can store the "editor" and use it when needed.
                      }}
                      onChange={handleDescriptionChange}
                  
                    />
                  </div>

                  <div className="mb-3 d-flex  flex-column">
                    <Label className="form-label">Article Content</Label>

                    <CKEditor
                      editor={ClassicEditor}
                      data="<p>Hello from CKEditor 5!</p>"
                      onReady={(editor) => {
                        // You can store the "editor" and use it when needed.
                      }}
                      onChange={handleContentChange}
                    />
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Attached Images</h5>
                </CardHeader>
                <CardBody>
                  <div>
                    <p className="text-muted">Add Attached files here.</p>

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
                            <h5>Drop files here or click to upload.</h5>
                          </div>
                        </div>
                      )}
                    </Dropzone>

                    <ul className="list-unstyled mb-0" id="dropzone-preview">
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
                    </ul>
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
                 {id ? "Update":"Create"} 
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

export default Article;
