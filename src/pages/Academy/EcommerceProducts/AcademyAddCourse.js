import React, { useEffect, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Input,
  Label,
  FormFeedback,
  Form,
} from "reactstrap";

// Redux
import { useDispatch } from "react-redux";
import {
  addNewCourse as onAddNewCourse,
  updateCourse as onUpdateCourse,
  getCourses as onGetCourses,
} from "../../../store/academy/action";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import classnames from "classnames";
import Dropzone from "react-dropzone";
import { Link, useLocation, useNavigate } from "react-router-dom";

//formik
import { useFormik } from "formik";
import * as Yup from "yup";

// Import React FilePond
import { registerPlugin } from "react-filepond";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { useProfile } from "../../../Components/Hooks/UserHooks";
import axios from "axios";
import config from "../../../config";
import AsyncSelect from "react-select/async";
import { toast } from "react-toastify";
import Tools from "../../Forms/Builder/Tools";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const AcademyAddCourse = (props) => {
  document.title = "Create Course | Psymate - Management Portal";

  const history = useNavigate();
  const dispatch = useDispatch();

  const [customActiveTab, setcustomActiveTab] = useState("1");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [image, setImage] = useState({});
  const [state, setState] = useState({});

  const { loading } = useProfile();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const [course, setCourse] = useState({});

  useEffect(() => {
    if (id)
      axios.get(config.api.API_URL + `/courses?id=${id}`).then((res) => {
        setCourse(res.data);
        console.log("CCCC : ", course);
      });
  }, []);
  const [selectedFiles, setselectedFiles] = useState([]);
  const [selectedVisibility, setselectedVisibility] = useState(null);

  function handleAcceptedFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
  }

  function handleSelectVisibility(selectedVisibility) {
    setselectedVisibility(selectedVisibility);
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

  const courseCategory = [
    {
      options: [
        { label: "All", value: "All" },
        { label: "Prescription Medicines", value: "prescription_medicines" },
        { label: "OTC Medicines", value: "otc_medicines" },
        { label: "Health Supplements", value: "health_supplements" },
        { label: "Health Devices", value: "health_devices" },
        { label: "Sexual Wellness", value: "sexual_wellness" },
        { label: "Personal Care", value: "personal_care" },
      ],
    },
  ];

  const dateFormat = () => {
    let d = new Date(),
      months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
    let h = d.getHours() % 12 || 12;
    let ampm = d.getHours() < 12 ? "AM" : "PM";
    return (
      d.getDate() +
      " " +
      months[d.getMonth()] +
      ", " +
      d.getFullYear() +
      ", " +
      h +
      ":" +
      d.getMinutes() +
      " " +
      ampm
    ).toString();
  };

  const [date, setDate] = useState(dateFormat());

  const dateformate = (e) => {
    const dateString = e.toString().split(" ");
    let time = dateString[4];
    let H = +time.substr(0, 2);
    let h = H % 12 || 12;
    h = h <= 9 ? (h = "0" + h) : h;
    let ampm = H < 12 ? "AM" : "PM";
    time = h + time.substr(2, 3) + " " + ampm;

    const date = dateString[2] + " " + dateString[1] + ", " + dateString[3];
    const orderDate = (date + ", " + time).toString();
    setDate(orderDate);
  };

  const courseStatus = [
    {
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
        { label: "Scheduled", value: "scheduled" },
      ],
    },
  ];

  const courseVisibility = [
    {
      options: [
        { label: "Hidden", value: "Hidden" },
        { label: "Public", value: "Public" },
      ],
    },
  ];

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      displayName: course?.displayName,
      price: course?.price,
      duration: course?.duration,
      side_effects: course?.side_effects,
      dosage: course?.dosage,
      type: course?.type,
      category: course?.category,
      publishedDate: course?.publishedDate,
      status: course?.status,
      rating: 4.5,
      course_discount: course?.course_discount,
      meta_title: course?.meta?.title,
      meta_keyword: course?.meta?.keyword,
      metaDescription: course?.meta?.description,
      course_tags: course?.meta?.tags,
    },
    validationSchema: Yup.object({
      displayName: Yup.string().required("Please Enter a display Name"),
      status: Yup.string().required("Please Enter a Course status"),
      meta_title: Yup.string().required("Please Enter a Meta Title"),
      meta_keyword: Yup.string().required("Please Enter a Meta Keyword"),
      metaDescription: Yup.string().required("Please Enter a Meta Description"),
      course_tags: Yup.string().required("Please Enter a Course Tags"),
    }),
    onSubmit: (values) => {
      if (!selectedManufacturer) {
        toast.error("Please select a manufacturer");
        return;
      }
      const newCourse = {
        displayName: values.displayName,
        instructor: selectedManufacturer,
        meta: {
          title: values.meta_title,
          keyword: values.meta_keyword,
          tags: values.course_tags,
          metaDescription: values.metaDescription,
        },
        price: state.price,
        duration: state.duration,
        category: values.category,
        status: values.status,
        createdAt: date,
        ...course,
      };
      // save new course

      if (id) {
        dispatch(onUpdateCourse({ data: newCourse, id: course._id }));
      } else {
        dispatch(onAddNewCourse({ data: newCourse }));
      }
      history("/apps-academy-courses");
      validation.resetForm();
    },
  });
  console.log(course);
  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Manage Courses" pageTitle="Academy" />

        <Row>
          <Col lg={8}>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
              }}
            >
              <Card>
                <CardBody>
                  <div className="mb-4">
                    <div className="">
                      <Tools
                        setState={setCourse}
                        state={course}
                        inputs={[
                          {
                            name: "displayName",
                            label: "Course Title",
                            element: "text",
                          },
                          {
                            name: "description",
                            label: "Course Description",
                            element: "textarea",
                          },
                        ]}
                      />
                    </div>
                  </div>
                  {/* <div>
                    <Label>Course Description</Label>

                    <CKEditor
                      editor={ClassicEditor}
                      data="<p>
                      Tommy Hilfiger men striped pink sweatshirt. Crafted with
                      cotton. Material composition is 100% organic cotton.
                      This is one of the world’s leading designer lifestyle
                      brands and is internationally recognized for celebrating
                      the essence of classic American cool style, featuring
                      preppy with a twist designs.
                    </p>
                    <ul>
                      <li>Full Sleeve</li>
                      <li>Cotton</li>
                      <li>All Sizes available</li>
                      <li>4 Different Color</li>
                    </ul>"
                      onReady={(editor) => {
                        const editorData = editor;
                        console.log(editorData);
                        // You can store the "editor" and use when it is needed.
                      }}
                    />
                  </div> */}
                </CardBody>

                <Card>
                  <CardHeader>
                    <h5 className="card-title mb-0">Course Gallery</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="mb-4">
                      <div className="text-center">
                        <Tools
                          setState={setImage}
                          state={image}
                          inputs={[
                            {
                              name: "thumbnail",
                              label: "Upload Image Cover Photo",
                              element: "image",
                            },
                          ]}
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Card>

              <Card>
                <CardHeader>
                  <Nav className="nav-tabs-custom card-header-tabs border-bottom-0">
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "1",
                        })}
                        onClick={() => {
                          toggleCustom("1");
                        }}
                      >
                        General Info
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "2",
                        })}
                        onClick={() => {
                          toggleCustom("2");
                        }}
                      >
                        Meta Data
                      </NavLink>
                    </NavItem>
                  </Nav>
                </CardHeader>

                <CardBody>
                  <TabContent activeTab={customActiveTab}>
                    <TabPane id="addcourse-general-info" tabId="1">
                      <Row>
                        <Col lg={6}>
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="manufacturer-name-input"
                            >
                              Instructor
                            </label>
                            <AsyncSelect
                              className="mb-0"
                              value={{
                                value: selectedManufacturer,
                                label: selectedManufacturer?.displayName,
                              }}
                              placeholder="Search For Patients"
                              onChange={(e) => {
                                setSelectedManufacturer(e.value);
                              }}
                              loadOptions={async (inputValue) => {
                                try {
                                  const response = await axios.get(
                                    config.api.API_URL +
                                      `/data/users?search=${inputValue}&searchBy=displayName`
                                  );
                                  const data = response.data;
                                  const options = data.map((item) => ({
                                    value: item,
                                    label: item.displayName,
                                  }));
                                  return options;
                                } catch (error) {
                                  console.error(
                                    "Error loading options:",
                                    error
                                  );
                                  return [];
                                }
                              }}
                              isClearable
                              isSearchable
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Tools
                          setState={setCourse}
                          state={course}
                          inputs={[
                            {
                              name: "language",
                              label: "Language",
                              element: "select",
                              items: "english,hindi",
                              variants: "multiple,searchable",
                              width: 4,
                            },
                            {
                              name: "access",
                              label: "Access",
                              element: "select",
                              items: "lifetime,month,week",
                              variants: "multiple,searchable",
                              width: 4,
                            },
                            {
                              name: "level",
                              label: "Skill level",
                              element: "select",
                              items: "beginner,intermediate,advance,expert",
                              variants: "multiple,searchable",
                              width: 4,
                            },
                            {
                              name: "topics",
                              label: "Topics",
                              element: "select",
                              items: "academy",
                              variants: "multiple,searchable",
                              width: 4,
                            },
                            {
                              name: "duration",
                              label: "Duration",
                              element: "text",
                              width: 4,
                            },
                            {
                              name: "price",
                              label: "Price",
                              element: "text",
                              width: 4,
                            },
                            {
                              name: "videoURL",
                              label: "Video URL",
                              element: "text",
                              width: 12,
                            },
                            {
                              name: "lessons",
                              label: "lessons",
                              element: "multiple",
                              items: "title,description,videoURL,thumbnail",
                              width: 12,
                            },
                          ]}
                        />
                      </Row>
                    </TabPane>

                    <TabPane id="addcourse-metadata" tabId="2">
                      <Row>
                        <Col lg={6}>
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor="meta-title-input"
                            >
                              Meta title
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              placeholder="Enter meta title"
                              id="meta-title-input"
                              name="meta_title"
                              value={validation.values.meta_title || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              invalid={
                                validation.errors.meta_title &&
                                validation.touched.meta_title
                                  ? true
                                  : false
                              }
                            />
                            {validation.errors.meta_title &&
                            validation.touched.meta_title ? (
                              <FormFeedback type="invalid">
                                {validation.errors.meta_title}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </Col>

                        <Col lg={6}>
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor="meta-keywords-input"
                            >
                              Meta Keywords
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              placeholder="Enter meta keywords"
                              id="meta-keywords-input"
                              name="meta_keyword"
                              value={validation.values.meta_keyword || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              invalid={
                                validation.errors.meta_keyword &&
                                validation.touched.meta_keyword
                                  ? true
                                  : false
                              }
                            />
                            {validation.errors.meta_keyword &&
                            validation.touched.meta_keyword ? (
                              <FormFeedback type="invalid">
                                {validation.errors.meta_keyword}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                      </Row>

                      <div>
                        <Label
                          className="form-label"
                          htmlFor="meta-description-input"
                        >
                          Meta Description
                        </Label>
                        <Input
                          type="text"
                          rows={3}
                          className="form-control"
                          placeholder="Enter meta keywords"
                          id="meta-keywords-input"
                          name="metaDescription"
                          value={validation.values.metaDescription || ""}
                          onBlur={validation.handleBlur}
                          onChange={validation.handleChange}
                          invalid={
                            validation.errors.metaDescription &&
                            validation.touched.metaDescription
                              ? true
                              : false
                          }
                        />
                        {validation.errors.metaDescription &&
                        validation.touched.metaDescription ? (
                          <FormFeedback type="invalid">
                            {validation.errors.metaDescription}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>

              <div className="text-end mb-3">
                <button type="submit" className="btn btn-success w-sm">
                  Submit
                </button>
              </div>
            </Form>
          </Col>

          <Col lg={4}>
            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Publish</h5>
              </CardHeader>
              <CardBody>
                <div className="mb-3">
                  <Label
                    htmlFor="choices-publish-status-input"
                    className="form-label"
                  >
                    Status
                  </Label>
                  <Input
                    name="status"
                    type="select"
                    className="form-select"
                    id="choices-publish-status-input"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.status || ""}
                  >
                    {courseStatus.map((item, key) => (
                      <React.Fragment key={key}>
                        {item.options.map((item, key) => (
                          <option value={item.value} key={key}>
                            {item.label}
                          </option>
                        ))}
                      </React.Fragment>
                    ))}
                  </Input>
                  {validation.touched.status && validation.errors.status ? (
                    <FormFeedback type="invalid">
                      {validation.errors.status}
                    </FormFeedback>
                  ) : null}
                </div>

                <div>
                  <Label
                    htmlFor="choices-publish-visibility-input"
                    className="form-label"
                  >
                    Visibility
                  </Label>

                  <Select
                    value={selectedVisibility}
                    onChange={() => {
                      handleSelectVisibility();
                    }}
                    options={courseVisibility}
                    name="choices-publish-visibility-input"
                    classNamePrefix="select2-selection form-select"
                  />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Publish Schedule</h5>
              </CardHeader>

              <CardBody>
                <div>
                  <label
                    htmlFor="datepicker-publish-input"
                    className="form-label"
                  >
                    Publish Date & Time
                  </label>
                  <Flatpickr
                    name="publishedDate"
                    id="publishedDate-field"
                    className="form-control"
                    placeholder="Enter publish date"
                    options={{
                      enableTime: true,
                      altInput: true,
                      altFormat: "d M, Y, G:i K",
                      dateFormat: "d M, Y, G:i K",
                    }}
                    onChange={(e) => dateformate(e)}
                    value={validation.values.publishedDate || ""}
                  />
                  {validation.touched.publishedDate &&
                  validation.errors.publishedDate ? (
                    <FormFeedback type="invalid">
                      {validation.errors.publishedDate}
                    </FormFeedback>
                  ) : null}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Course Categories</h5>
              </CardHeader>
              <CardBody>
                <p className="text-muted mb-2">
                  {" "}
                  <Link to="#" className="float-end text-decoration-underline">
                    Add New
                  </Link>
                  Select course category
                </p>

                <Input
                  name="category"
                  type="select"
                  className="form-select"
                  id="category-field"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.category || ""}
                >
                  {courseCategory.map((item, key) => (
                    <React.Fragment key={key}>
                      {item.options.map((item, key) => (
                        <option value={item.value} key={key}>
                          {item.label}
                        </option>
                      ))}
                    </React.Fragment>
                  ))}
                </Input>
                {validation.touched.category && validation.errors.category ? (
                  <FormFeedback type="invalid">
                    {validation.errors.category}
                  </FormFeedback>
                ) : null}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Course Tags</h5>
              </CardHeader>
              <CardBody>
                <div className="hstack gap-3 align-items-start">
                  <div className="flex-grow-1">
                    <Input
                      className="form-control"
                      placeholder="Enter tags"
                      type="text"
                      name="course_tags"
                      value={validation.values.course_tags || ""}
                      onBlur={validation.handleBlur}
                      onChange={validation.handleChange}
                      invalid={
                        validation.errors.course_tags &&
                        validation.touched.course_tags
                          ? true
                          : false
                      }
                    />
                    {validation.errors.course_tags &&
                    validation.touched.course_tags ? (
                      <FormFeedback type="invalid">
                        {validation.errors.course_tags}
                      </FormFeedback>
                    ) : null}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AcademyAddCourse;
