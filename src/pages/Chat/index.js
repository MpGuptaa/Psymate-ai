import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Container,
  Button,
  UncontrolledTooltip,
  Input,
  DropdownToggle,
  DropdownMenu,
  Dropdown,
  DropdownItem,
  Row,
  Col,
  Card,
  CardBody,
  UncontrolledDropdown,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import { Link, useParams } from "react-router-dom";
import { isEmpty, map } from "lodash";
import classnames from "classnames";
import SimpleBar from "simplebar-react";
import { sendMessageApi, fetchPastMessagesApi } from "../../utils/api";

//Import Icons
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import EastIcon from "@mui/icons-material/East";
import FeatherIcon from "feather-icons-react";
import PersonalInfo from "./PersonalInfo";
import socketIOClient from "socket.io-client";

import Picker from "emoji-picker-react";

//redux
import { useSelector, useDispatch } from "react-redux";
import {
  getDirectContact as onGetDirectContact,
  getMessages,
  getChannels as onGetChannels,
  addMessage as onAddMessage,
  deleteMessage as onDeleteMessage,
} from "../../store/actions";

import avatar2 from "../../assets/images/users/avatar-2.jpg";
import userDummayImage from "../../assets/images/users/user-dummy-img.jpg";

//Import Scrollbar
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import SimplePeer from "simple-peer";
import { useProfile } from "../../Components/Hooks/UserHooks";
import { getUsers } from "../../store/users/action";
import config from "../../config";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

const Chat = () => {
  // const socket = io("http://localhost:200", {
  //   transports: ["websocket"],
  // });
  const socket = socketIOClient("http://localhost:200");

  document.title = "Chat | Psymate - Management Portal";
  const dispatch = useDispatch();
  const [type, setType] = useState("patient");

  const { loading } = useProfile();
  const { users } = useSelector((state) => ({
    users: state.User.users,
  }));

  useEffect(() => {
    setTeam(users);
    setTeamlist(users);
  }, [users]);

  useEffect(() => {
    dispatch(getUsers(type, 1, `search=${type}&searchBy=type`));
  }, [dispatch, loading, type]);

  const [customActiveTab, setcustomActiveTab] = useState("1");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };
  const { id } = useParams();

  const ref = useRef();
  const [isInfoDetails, setIsInfoDetails] = useState(false);
  const [Chat_Box_Username, setChat_Box_Username] = useState("");
  const [Chat_Box_Image, setChat_Box_Image] = useState(avatar2);
  const [clickedUser, setClickedUser] = useState(null);
  const [currentRoomId, setCurrentRoomId] = useState(1);
  const [messageBox, setMessageBox] = useState(null);
  const [curMessage, setcurMessage] = useState("");
  const [search_Menu, setsearch_Menu] = useState(false);
  const [settings_Menu, setsettings_Menu] = useState(false);
  const [reply, setreply] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [emojiPicker, setemojiPicker] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: "Anna Adame",
    isActive: true,
  });
  const [allMessages, setAllMessages] = useState([]);
  const [currentId, setCurrentId] = useState(1);
  const [searchBy, setSearchBy] = useState("displayName");
  const [teamList, setTeamlist] = useState([]);
  const [team, setTeam] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [pageCount, setPageCount] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { chats, messages, channels } = useSelector((state) => ({
    chats: state.chat.chats,
    messages: state.chat.messages,
    channels: state.chat.channels,
  }));
  // console.log("messages-> ", messages);
  useEffect(() => {
    const userById = users.find((user) => user._id === id);
    setClickedUser(userById);
  }, [id]);

  const { user } = useSelector((state) => ({
    user: state.Profile.user,
  }));
  //Toggle Chat Box Menus
  const toggleSearch = () => {
    setsearch_Menu(!search_Menu);
  };

  //Info details offcanvas
  const toggleInfo = () => {
    setIsInfoDetails(!isInfoDetails);
  };

  const toggleSettings = () => {
    setsettings_Menu(!settings_Menu);
  };
  useEffect(() => {
    dispatch(onGetDirectContact());
    dispatch(onGetChannels());
    // dispatch(getMessages(currentRoomId));
  }, [dispatch, currentRoomId]);

  //Use For Chat Box
  const userChatOpen = (id, name, status, roomId, image) => {
    setChat_Box_Username(name);
    setCurrentRoomId(roomId);
    setChat_Box_Image(image);
    // dispatch(getMessages(roomId));
    setCurrentUser(name);
    setCurrentId(id);
  };
  const handleClickedUser = (user) => {
    setClickedUser(user);
  };
  const getInitials = (fullName) => {
    const names = fullName?.split(" ");
    const initials = names?.map((name) => name.charAt(0)).join("");
    return initials?.toUpperCase();
  };

  const addMessage = (roomId, sender) => {
    const message = {
      id: Math.floor(Math.random() * 100),
      roomId,
      sender,
      message: curMessage,
      createdAt: new Date(),
    };
    setcurMessage("");
    // dispatch(onAddMessage(message));
  };

  const scrollToBottom = useCallback(() => {
    if (messageBox) {
      messageBox.scrollTop = messageBox.scrollHeight + 1000;
    }
  }, [messageBox]);

  useEffect(() => {
    if (!isEmpty(messages)) scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async () => {
    if (clickedUser) {
      const newMessage = {
        sender: user,
        receiver: clickedUser,
        content: curMessage,
        isDeleted: false,
      };
      try {
        // Call the sendMessageApi function
        const response = await sendMessageApi(newMessage);
        dispatch(onAddMessage(response));
        socket.emit("usermsg", response);
        console.log("Message sent successfully:", response);
      } catch (error) {
        console.error("Error sending message:", error);
      }
      setcurMessage("");
    }
  };

  //fine----------
  useEffect(() => {
    if (clickedUser) {
      const fetchData = async () => {
        try {
          const resp = await fetchPastMessagesApi(user._id, clickedUser._id);
          console.log("fetched msgs=> ", resp);
          dispatch(getMessages(resp));
          console.log("messages after fetch=> ", messages);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }
  }, [dispatch, clickedUser]);

  useEffect(() => {
    const socket = socketIOClient("http://localhost:200");
    socket.emit("user-connect", user);
    socket.on("new-message", (message) => {
      console.log("new-message:", message);
      if (
        (message?.sender?._id === user?._id && message?.receiver?._id === clickedUser?._id) ||
        (message?.receiver?._id === user?._id && message?.sender?._id === clickedUser?._id)
      ) {
        dispatch(onAddMessage(message));
      }
    });
    return () => {
      socket.disconnect();
      socket.off("new-message");
    };
  }, [dispatch, clickedUser, user?._id]);

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const searchList = (e) => {
    let inputVal = e.toLowerCase();
    axios.get(config.api.API_URL + `/users?page=1&limit=20&search=${inputVal}&searchBy=${searchBy}`).then((res) => {
      setTeam(res.data);
      setTeamlist(res.data);
      if (res.data.length === 0) {
        // document.getElementById("noresult").style.display = "block";
        // document.getElementById("teamlist").style.display = "none";
      } else {
        // document.getElementById("noresult").style.display = "none";
        // document.getElementById("teamlist").style.display = "block";
      }
    });
  };

  const fetchMoreData = () => {
    console.log("Fetch");
    axios.get(config.api.API_URL + `/users?page=${pageCount + 1}&limit=20`).then((res) => {
      console.log("res=>", res);
      if (res.data.length === 0) {
        // console.log("res.length : ", res.length);
        setHasMore(false); // No more data available
      } else {
        setPageCount(pageCount + 1);
        setTeamlist((prevTeamList) => [...prevTeamList, ...res.data]);
      }
      setTeam((prevTeamList) => [...prevTeamList, ...res.data]);
    });
  };

  //Search Message
  const searchMessages = () => {
    var searchInput, searchFilter, searchUL, searchLI, a, i, txtValue;
    searchInput = document.getElementById("searchMessage");
    searchFilter = searchInput.value.toUpperCase();
    searchUL = document.getElementById("users-conversation");
    searchLI = searchUL.getElementsByTagName("li");
    Array.prototype.forEach.call(searchLI, function (search) {
      a = search.getElementsByTagName("p")[0] ? search.getElementsByTagName("p")[0] : "";
      txtValue = a.textContent || a.innerText ? a.textContent || a.innerText : "";
      if (txtValue.toUpperCase().indexOf(searchFilter) > -1) {
        search.style.display = "";
      } else {
        search.style.display = "none";
      }
    });
  };

  // Copy Message
  const handleCkick = (ele) => {
    var copy = ele.closest(".chat-list").querySelector(".ctext-content").innerHTML;
    navigator.clipboard.writeText(copy);

    document.getElementById("copyClipBoard").style.display = "block";
    setTimeout(() => {
      document.getElementById("copyClipBoard").style.display = "none";
    }, 2000);
  };

  // emoji
  const [emojiArray, setemojiArray] = useState("");

  const onEmojiClick = (event, emojiObject) => {
    setemojiArray([...emojiArray, emojiObject.emoji]);
    let emoji = [...emojiArray, emojiObject.emoji].join(" ");
    setcurMessage(emoji);
  };

  const myVideoRef = useRef();
  const peerVideoRef = useRef();
  const peerRef = useRef();

  const handleCameraButtonClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Display the local stream
      myVideoRef.current.srcObject = stream;

      // Initialize the peer connection
      peerRef.current = new SimplePeer({
        initiator: window.location.hash === "#init",
        stream: stream,
      });

      // Event handlers for the peer connection
      peerRef.current.on("signal", (data) => {
        // Send the signal to the other peer via your signaling server
        socket.current.emit("signal", JSON.stringify(data));
      });

      peerRef.current.on("stream", (stream) => {
        // Display the remote stream
        peerVideoRef.current.srcObject = stream;
      });

      socket.current.on("signal", (data) => {
        // Receive and process the signal from the other peer
        peerRef.current.signal(JSON.parse(data));
      });
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="chat-wrapper d-flex gap-1 mx-n4 mt-n4 p-1 overflow-scroll">
            <div
              className={` overflow-scroll ${showSidebar ? "" : "d-none"}`}
              style={{
                minWidth: "20rem",
                transition: "width 1s ease-in-out",
              }}
            >
              <div className="chat-leftsidebar justify-content-start overflow-scroll">
                <div className="px-4 pt-4 mb-4">
                  <div className="d-flex align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <h5 className="mb-4">Chats</h5>
                      </div>
                    </div>
                  </div>
                  <div className="search-box">
                    <input
                      // onKeyUp={searchUsers}
                      onChange={(e) => searchList(e.target.value)}
                      id="search-user"
                      type="text"
                      className="form-control bg-light border-light"
                      placeholder="Search here..."
                    />
                    <i className="ri-search-2-line search-icon"></i>
                  </div>
                </div>
                <Nav tabs className="nav nav-tabs nav-tabs-custom nav-success nav-justified mb-3">
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
                      Chats
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
                      Contacts
                    </NavLink>
                  </NavItem>
                </Nav>

                <TabContent activeTab={customActiveTab} className="text-muted">
                  <TabPane tabId="1" id="chats">
                    <SimpleBar className="chat-room-list pt-3" style={{ margin: "-16px 0px 0px" }}>
                      <div className="d-flex align-items-center px-4 mb-2">
                        <div className="flex-grow-1">
                          <h4 className="mb-0 fs-12 text-muted text-uppercase">Direct Messages</h4>
                        </div>
                        <div className="flex-shrink-0">
                          <UncontrolledTooltip placement="bottom" target="addnewmsg">
                            New Message
                          </UncontrolledTooltip>

                          <button type="button" id="addnewmsg" className="btn btn-soft-success btn-sm">
                            <i className="ri-add-line align-bottom"></i>
                          </button>
                        </div>
                      </div>

                      <div className="chat-message-list">
                        <ul className="list-unstyled chat-list chat-user-list users-list" id="userList">
                          {(users || []).map((user) => (
                            <li key={user._id + user?.status} className={currentRoomId === user?._id ? "active" : ""}>
                              <Link
                                to="#"
                                onClick={(e) => {
                                  userChatOpen(
                                    user._id,
                                    user.displayName,
                                    // user.status,
                                    // user.roomId,
                                    user?.image,
                                  );
                                  // fetchChatId(user.uid, chat._id)
                                }}
                              >
                                <div className="d-flex align-items-center" id="teamlist">
                                  <div className="flex-shrink-0 chat-user-img online align-self-center me-2 ms-0">
                                    <div className="avatar-xxs">
                                      {user.image ? (
                                        <img
                                          src={user?.image}
                                          className="rounded-circle img-fluid userprofile"
                                          alt=""
                                        />
                                      ) : (
                                        <div
                                          className={"avatar-title rounded-circle bg-" + user.bgColor + " userprofile"}
                                        >
                                          {user?.displayName?.charAt(0)}
                                        </div>
                                      )}
                                    </div>
                                    <span className="user-status"></span>
                                  </div>
                                  <div className="flex-grow-1 overflow-hidden">
                                    <p className="text-truncate mb-0">{user.displayName}</p>
                                  </div>
                                  {user.badge && (
                                    <div className="flex-shrink-0">
                                      <span className="badge badge-soft-dark rounded p-1">{user.badge}</span>
                                    </div>
                                  )}
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="d-flex align-items-center px-4 mt-4 pt-2 mb-2">
                        <div className="flex-grow-1">
                          <h4 className="mb-0 fs-12 text-muted text-uppercase">Channels</h4>
                        </div>
                        <div className="flex-shrink-0">
                          <UncontrolledTooltip placement="bottom" target="createnewmsg">
                            Create group
                          </UncontrolledTooltip>
                          <Button color="" id="createnewmsg" className="btn btn-soft-success btn-sm">
                            <i className="ri-add-line align-bottom"></i>
                          </Button>
                        </div>
                      </div>

                      <div className="chat-message-list">
                        <ul className="list-unstyled chat-list chat-user-list mb-0 users-list" id="channelList">
                          {channels.map((channel, key) => (
                            <React.Fragment key={key}>
                              <li>
                                <Link to="#" className="unread-msg-user">
                                  <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0 chat-user-img online align-self-center me-2 ms-0">
                                      <div className="avatar-xxs">
                                        <div className="avatar-title bg-light rounded-circle text-body">#</div>
                                      </div>
                                    </div>
                                    <div className="flex-grow-1 overflow-hidden">
                                      <p className="text-truncate mb-0">{channel.name}</p>
                                    </div>
                                    {channel.unReadMessage && (
                                      <div className="flex-shrink-0">
                                        <span className="badge badge-soft-dark rounded p-1">
                                          {channel.unReadMessage}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </Link>
                              </li>
                            </React.Fragment>
                          ))}
                        </ul>
                      </div>
                    </SimpleBar>
                  </TabPane>
                  <TabPane tabId="2" id="">
                    <SimpleBar className="chat-room-list pt-3" style={{ margin: "-16px 0px 0px" }}>
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          overflowX: "hidden",
                        }}
                      >
                        <InfiniteScroll
                          dataLength={teamList.length}
                          next={fetchMoreData}
                          hasMore={hasMore}
                          loader={<h4>Loading...</h4>}
                        >
                          <div style={{ overflow: "scroll", height: "100%" }}>
                            {(teamList || []).map((item, key) => (
                              <div className="mt-3" key={key}>
                                <ul id={"contact-sort-" + item._id} className="list-unstyled contact-list">
                                  <li onClick={() => {
                                    setIsModalOpen(true)
                                    setShowSidebar(false)
                                  }}>
                                    <div className="d-flex align-items-center">
                                      <div className="flex-shrink-0 me-2">
                                        <div className="avatar-xxs">
                                          {item?.image ? (
                                            <img src={item.image} className="img-fluid rounded-circle" alt="" />
                                          ) : (
                                            <span className="avatar-title rounded-circle bg-primary fs-10">
                                              {item?.displayName?.charAt(0) +
                                                (item.name
                                                  ? item.displayName.split(" ").slice(-1).toString().charAt(0)
                                                  : "")}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex-grow-1">
                                        <div className="flex-grow-1" onClick={() => handleClickedUser(item)}>
                                          <p className="text-truncate contactlist-name mb-0">
                                            {item.displayName || "Unknown"}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex-shrink-0">
                                        <UncontrolledDropdown>
                                          <DropdownToggle tag="a" className="text-muted">
                                            <i className="ri-more-2-fill" />
                                          </DropdownToggle>
                                          <DropdownMenu className="dropdown-menu-end">
                                            <DropdownItem>
                                              <i className="ri-pencil-line text-muted me-2 align-bottom" />
                                              Edit
                                            </DropdownItem>
                                            <DropdownItem>
                                              <i className="ri-forbid-2-line text-muted me-2 align-bottom" />
                                              Block
                                            </DropdownItem>
                                            <DropdownItem>
                                              <i className="ri-delete-bin-6-line text-muted me-2 align-bottom" /> Remove
                                            </DropdownItem>
                                          </DropdownMenu>
                                        </UncontrolledDropdown>
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            ))}
                          </div>
                        </InfiniteScroll>
                      </div>
                    </SimpleBar>
                  </TabPane>
                </TabContent>
              </div>
            </div>

            <div
              className="user-chat justify-content-end d-lg-block w-100 position-relative"
              style={{
                visibility: "visible",
                transform: "translateX(0%)",
                minWidth: "20rem",
                minHeight: "90vh",
                ...(window.innerWidth <= 1000 && {
                  position: "absolute",
                  top: "-4.5rem",
                }),
              }}
            >
              <div className="chat-content d-flex h-100">
                <div className="w-100 overflow-auto position-relative">
                  <div className="position-relative">
                    <div className="p-2 user-chat-topbar position-relative">
                      <Row className="align-items-center">
                        <Col sm={4} xs={8}>
                          <div className="d-flex align-items-center">
                            <div className="flex-shrink-0 d-block d-none me-3">
                              <Link to="#" className="user-chat-remove fs-18 p-1">
                                <i className="ri-arrow-left-s-line align-bottom"></i>
                              </Link>
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center">
                                <Button
                                  variant="primary"
                                  className="me-3"
                                  style={{ zIndex: 2000, padding: 4 }}
                                  onClick={() => setShowSidebar(!showSidebar)}
                                >
                                  {showSidebar ? <KeyboardBackspaceIcon /> : <EastIcon />}
                                </Button>
                                <div className="flex-shrink-0 chat-user-img online user-own-img align-self-center me-2 ms-0">
                                  {Chat_Box_Image === undefined ? (
                                    <img src={userDummayImage} className="rounded-circle avatar-xs" alt="" />
                                  ) : (
                                    <div className="fw-bold fs-5 mb-1">{getInitials(clickedUser?.displayName)}</div>
                                  )}
                                  <span className="user-status"></span>
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                  <h5 className="text-truncate mb-0 fs-16">
                                    <a
                                      className="text-reset username"
                                      data-bs-toggle="offcanvas"
                                      href="#userProfileCanvasExample"
                                      aria-controls="userProfileCanvasExample"
                                    >
                                      {clickedUser?.displayName}
                                    </a>
                                  </h5>
                                  <p className="text-truncate text-muted mb-0 userStatus">
                                    <span>Online</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col sm={8} xs={4}>
                          <ul className="list-inline user-chat-nav text-end mb-0">
                            <li className="list-inline-item d-none d-lg-inline-block m-0">
                              <button
                                type="button"
                                className="btn btn-ghost-secondary btn-icon"
                                onClick={handleCameraButtonClick}
                              >
                                <i className="las la-video"></i>
                              </button>
                            </li>

                            <li className="list-inline-item m-0">
                              <Dropdown isOpen={search_Menu} toggle={toggleSearch}>
                                <DropdownToggle className="btn btn-ghost-secondary btn-icon" tag="button">
                                  <FeatherIcon icon="search" className="icon-sm" />
                                </DropdownToggle>
                                <DropdownMenu className="p-0 dropdown-menu-end dropdown-menu-lg">
                                  <div className="p-2">
                                    <div className="search-box">
                                      <Input
                                        onKeyUp={searchMessages}
                                        type="text"
                                        className="form-control bg-light border-light"
                                        placeholder="Search here..."
                                        id="searchMessage"
                                      />
                                      <i className="ri-search-2-line search-icon"></i>
                                    </div>
                                  </div>
                                </DropdownMenu>
                              </Dropdown>
                            </li>

                            <li className="list-inline-item d-none d-lg-inline-block m-0">
                              <button type="button" className="btn btn-ghost-secondary btn-icon" onClick={toggleInfo}>
                                <FeatherIcon icon="info" className="icon-sm" />
                              </button>
                            </li>

                            <li className="list-inline-item m-0">
                              <Dropdown isOpen={settings_Menu} toggle={toggleSettings}>
                                <DropdownToggle className="btn btn-ghost-secondary btn-icon" tag="button">
                                  <FeatherIcon icon="more-vertical" className="icon-sm" />
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem href="#" className="d-block d-lg-none user-profile-show">
                                    <i className="ri-user-2-fill align-bottom text-muted me-2"></i> View Profile
                                  </DropdownItem>
                                  <DropdownItem href="#">
                                    <i className="ri-inbox-archive-line align-bottom text-muted me-2"></i> Archive
                                  </DropdownItem>
                                  <DropdownItem href="#">
                                    <i className="ri-mic-off-line align-bottom text-muted me-2"></i> Muted
                                  </DropdownItem>
                                  <DropdownItem href="#">
                                    {" "}
                                    <i className="ri-delete-bin-5-line align-bottom text-muted me-2"></i> Delete
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </li>
                          </ul>
                        </Col>
                      </Row>
                    </div>

                    <div className="position-relative" id="users-chat">
                      <PerfectScrollbar
                        className="chat-conversation p-3 p-lg-4"
                        id="chat-conversation"
                        containerRef={(ref) => setMessageBox(ref)}
                      >
                        <div id="elmLoader"></div>
                        <ul className="list-unstyled chat-conversation-list" id="users-conversation">
                          {messages &&
                            messages?.map((message, key) => (
                              <li
                                className={message?.sender?._id !== user?._id ? "chat-list left" : "chat-list right"}
                                key={key}
                              >
                                <div className="conversation-list">
                                  {message.sender === Chat_Box_Username && (
                                    <div className="chat-avatar">
                                      {Chat_Box_Image === undefined ? (
                                        <img src={userDummayImage} alt="" />
                                      ) : (
                                        <img src={Chat_Box_Image} alt="" />
                                      )}
                                    </div>
                                  )}

                                  <div className="user-chat-content">
                                    <div className="ctext-wrap">
                                      <div className="ctext-wrap-content">
                                        <p className="mb-0 ctext-content">{message.content}</p>
                                      </div>
                                      <UncontrolledDropdown className="align-self-start message-box-drop">
                                        <DropdownToggle href="#" className="btn nav-btn" tag="i">
                                          <i className="ri-more-2-fill"></i>
                                        </DropdownToggle>
                                        <DropdownMenu>
                                          <DropdownItem
                                            href="#"
                                            className="reply-message"
                                            onClick={() => setreply(message)}
                                          >
                                            <i className="ri-reply-line me-2 text-muted align-bottom"></i>
                                            Reply
                                          </DropdownItem>
                                          <DropdownItem href="#">
                                            <i className="ri-share-line me-2 text-muted align-bottom"></i>
                                            Forward
                                          </DropdownItem>
                                          <DropdownItem href="#" onClick={(e) => handleCkick(e.target)}>
                                            <i className="ri-file-copy-line me-2 text-muted align-bottom"></i>
                                            Copy
                                          </DropdownItem>
                                          <DropdownItem href="#">
                                            <i className="ri-bookmark-line me-2 text-muted align-bottom"></i>
                                            Bookmark
                                          </DropdownItem>
                                          <DropdownItem href="#" onClick={() => dispatch(onDeleteMessage(message.id))}>
                                            <i className="ri-delete-bin-5-line me-2 text-muted align-bottom"></i>
                                            Delete
                                          </DropdownItem>
                                        </DropdownMenu>
                                      </UncontrolledDropdown>
                                    </div>
                                    <div className="conversation-name">
                                      <small className="text-muted time">09:07 am</small>{" "}
                                      <span className="text-success check-message-icon">
                                        <i className="ri-check-double-line align-bottom"></i>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                        </ul>
                      </PerfectScrollbar>
                      <div
                        className="alert alert-warning alert-dismissible copyclipboard-alert px-4 fade show "
                        id="copyClipBoard"
                        role="alert"
                      >
                        Message copied
                      </div>
                      {emojiPicker && (
                        <div className="alert pickerEmoji">
                          <Picker disableSearchBar={true} onEmojiClick={onEmojiClick} />
                        </div>
                      )}
                    </div>

                    <div className="chat-input-section p-3 p-lg-4">
                      <form id="chatinput-form">
                        <Row className="g-0 align-items-center">
                          <div className="col-auto">
                            <div className="chat-input-links me-2">
                              <div className="links-list-item">
                                <button
                                  type="button"
                                  className="btn btn-link text-decoration-none emoji-btn"
                                  id="emoji-btn"
                                  onClick={() => setemojiPicker(!emojiPicker)}
                                >
                                  <i className="bx bx-smile align-middle"></i>
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="col">
                            <div className="chat-input-feedback">Please Enter a Message</div>
                            <input
                              type="text"
                              value={curMessage}
                              onKeyDown={onKeyPress}
                              onChange={(e) => setcurMessage(e.target.value)}
                              className="form-control chat-input bg-light border-light"
                              id="chat-input"
                              placeholder="Type your message..."
                            />
                          </div>
                          <div className="col-auto">
                            <div className="chat-input-links ms-2">
                              <div className="links-list-item">
                                <Button
                                  type="button"
                                  color="success"
                                  onClick={() => {
                                    addMessage(currentRoomId, currentUser?.displayName);
                                    setemojiPicker(false);
                                    setemojiArray("");
                                    sendMessage();
                                  }}
                                  className="chat-send waves-effect waves-light"
                                >
                                  <i className="ri-send-plane-2-fill align-bottom"></i>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Row>
                      </form>
                    </div>

                    <div className={reply ? "replyCard show" : "replyCard"}>
                      <Card className="mb-0">
                        <CardBody className="py-3">
                          <div className="replymessage-block mb-0 d-flex align-items-start">
                            <div className="flex-grow-1">
                              <h5 className="conversation-name">{reply && reply.sender}</h5>
                              <p className="mb-0">{reply && reply.message}</p>
                            </div>
                            <div className="flex-shrink-0">
                              <button
                                type="button"
                                id="close_toggle"
                                className="btn btn-sm btn-link mt-n2 me-n3 fs-18"
                                onClick={() => setreply("")}
                              >
                                <i className="bx bx-x align-middle"></i>
                              </button>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <PersonalInfo
        show={isInfoDetails}
        onCloseClick={() => setIsInfoDetails(false)}
        currentuser={Chat_Box_Username}
        cuurentiseImg={Chat_Box_Image}
      />
    </React.Fragment>
  );
};

export default Chat;
