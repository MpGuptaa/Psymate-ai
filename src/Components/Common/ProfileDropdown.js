import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from 'react-toastify';
//import images
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import { loginSuccess, profileSuccess } from "../../store/actions";

const ProfileDropdown = () => {
  const { user } = useSelector((state) => ({
    user: state.Profile.user,
  }));
  const clock = JSON.parse(sessionStorage.getItem("authUser")).isClock
  const [userName, setUserName] = useState("Admin");
  // const [clock, setClock] = useState(true);
  const dispatch = useDispatch();
  const clockInfun = async () => {
    try {
      const obj = JSON.parse(sessionStorage.getItem("authUser"))
      const userId = obj.userId; // Replace with your user ID
      // const timestamp = await getTimeStamp(); // Get current timestamp
     await axios.post(`${process.env.REACT_APP_BASE_URL}/hr/clock/in`,{ userId }).then((res) => {
        if (res.success) {
          toast.success("Clock-in Successful", { autoClose: 3000 });
          obj.isClock = true;
          sessionStorage.setItem('authUser', JSON.stringify(obj));
        } else {
          toast.error("Clock-in failed", { autoClose: 3000 });
        }
      });
      
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const clockOutfun = async () => {
    try {
      const obj = JSON.parse(sessionStorage.getItem("authUser"))
      const userId = obj.userId; 
      // const timestamp =await getTimeStamp(); 

      await axios.post(`${process.env.REACT_APP_BASE_URL}/hr/clock/out`,{ userId }).then((res) => {
        
        if (res.success) {
          toast.success("Clock-out Successful", { autoClose: 3000 }); 
          obj.isClock = false;
          sessionStorage.setItem('authUser', JSON.stringify(obj));
        } else {
          toast.error("Clock-out failed", { autoClose: 3000 });
        }
      });
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("authUser")) {
      const obj = JSON.parse(sessionStorage.getItem("authUser"));
      setUserName(
        process.env.REACT_APP_DEFAULTAUTH === "fake"
          ? obj.displayName !== undefined
            ? user?.firstName
              ? user?.firstName
              : obj.firstName
            : "Admin" || "Admin"
          : process.env.REACT_APP_DEFAULTAUTH === "firebase"
          ? obj.providerData[0].email
          : "Admin"
      );
    }
  }, [userName]);

  //Dropdown Toggle
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };

  const getInitials = (name) => {
    const nameParts = name?.split(" ");
    return nameParts?.map((part) => part[0]).join("");
  };
  return (
    <React.Fragment>
      <Dropdown
        isOpen={isProfileDropdown}
        toggle={toggleProfileDropdown}
        className="ms-sm-3 header-item topbar-user"
      >
        <DropdownToggle tag="button" type="button" className="btn">
          <span className="d-flex align-items-center">
            <div
              className="rounded-circle header-profile-user"
              style={{
                backgroundColor: "#f7b848",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "600",
              }}
            >
              {getInitials(userName)}
            </div>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          {/* <h6 className="dropdown-header">Welcome {userName}!</h6> */}
          <DropdownItem href={process.env.PUBLIC_URL + "/profile"}>
            <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle">Profile</span>
          </DropdownItem>
          <DropdownItem href={process.env.PUBLIC_URL + "/apps-chat"}>
            <i className="mdi mdi-message-text-outline text-muted fs-16 align-middle me-1"></i>{" "}
            <span className="align-middle">Messages</span>
          </DropdownItem>
          <DropdownItem href={process.env.PUBLIC_URL + "#"}>
            <i className="mdi mdi-calendar-check-outline text-muted fs-16 align-middle me-1"></i>{" "}
            <span className="align-middle">Taskboard</span>
          </DropdownItem>
          <DropdownItem href={process.env.PUBLIC_URL + "/pages-faqs"}>
            <i className="mdi mdi-lifebuoy text-muted fs-16 align-middle me-1"></i>{" "}
            <span className="align-middle">Help</span>
          </DropdownItem>
          <div className="dropdown-divider"></div>
          <DropdownItem href={process.env.PUBLIC_URL + "/pages-profile"}>
            <i className="mdi mdi-wallet text-muted fs-16 align-middle me-1"></i>{" "}
            <span className="align-middle">
              Balance : <b>{user?.balance}</b>
            </span>
          </DropdownItem>
          <DropdownItem
            href={process.env.PUBLIC_URL + "/pages-profile-settings"}
          >
            <span className="badge bg-soft-success text-success mt-1 float-end">
              New
            </span>
            <i className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i>{" "}
            <span className="align-middle">Settings</span>
          </DropdownItem>
          <DropdownItem
            href={process.env.PUBLIC_URL + "/auth-lockscreen-basic"}
          >
            <i className="mdi mdi-lock text-muted fs-16 align-middle me-1"></i>{" "}
            <span className="align-middle">Lock screen</span>
          </DropdownItem>
          <DropdownItem  
          >
            <i className="mdi mdi-clock text-muted fs-16 align-middle me-1"></i>{" "}
            {clock ? <span onClick={clockOutfun} className="align-middle">Clock Out</span> : <span  onClick={clockInfun} className="align-middle">Clock In</span> }
            
          </DropdownItem>
          <DropdownItem href={process.env.PUBLIC_URL + "/logout"}>
            <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{" "}
            <span className="align-middle" data-key="t-logout">
              Logout
            </span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;
