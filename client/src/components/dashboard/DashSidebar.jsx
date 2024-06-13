import React, { useState } from "react";
import DashSideItem from "./DashSideItem";
import Collapse from "react-bootstrap/Collapse";
import { Link } from "react-router-dom";
import "./DashSidebar.css";

export default function DashSidebar({ onLogout, role }) {
  console.log("Role from Dashsidebar", role);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [detailedLeaveOpen, setDetailedLeaveOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);

  const toggleLeave = () => {
    setLeaveOpen(!leaveOpen);
  };

  const toggleLeaveDetails = () => {
    setDetailedLeaveOpen(!detailedLeaveOpen);
  };

  const toggleProjectDropdown = () => {
    setProjectDropdownOpen(!projectDropdownOpen);
  };

  return (
    <>
      <div
        className="custom-sidebar"
        style={{ position: "fixed", top: "60px", left: "0" }}
      >
        <ul className="custom-list">
          <DashSideItem
            title={"Dashboard"}
            logo={<i className="fa-solid fa-clipboard-user"></i>}
          />

          <li onClick={toggleLeaveDetails}>
            <DashSideItem
              title={"Leave"}
              logo={<i className="fa-solid fa-calendar-days"></i>}
            />
          </li>
          <Collapse in={detailedLeaveOpen}>
            <ul className="custom-subitem">
              <li>
                <span className="custom-logo">
                  <i className="fa-solid fa-plus"></i>
                </span>
                <Link to="/leave" className="custom-link">
                  Apply Leave
                </Link>
              </li>
              <br></br>
              {
              role === "Admin" ||
              role === "SuperAdmin" ? (
                <li>
                  <span className="custom-logo">
                    <i className="fa-solid fa-list mb-4"></i>
                  </span>
                  <Link to="/leave-request" className="custom-link">
                    Leave Reqest
                  </Link>
                </li>
              ) : (
                ""
              )}
              <li>
                <span className="custom-logo">
                  <i className="fa-regular fa-bell"></i>
                </span>
                <Link to="/my-leave" className="custom-link">
                  My Leave
                </Link>
              </li>
            </ul>
          </Collapse>
          {/* <li onClick={toggleProjectDropdown}>
            <DashSideItem
              title={"Project"}
              logo={<i className="fa-solid fa-diagram-project"></i>}
            />
          </li> */}
          {/* <Collapse in={projectDropdownOpen}>
            <ul className="custom-subitem">
              <li>
                <span className="custom-logo">
                  <i className="fa-solid fa-plus"></i>
                </span>
                <Link to="/create-project" className="custom-link">
                  Create Project
                </Link>
              </li>
              <br></br>
              <li>
                <span className="custom-logo">
                  <i className="fa-solid fa-list"></i>
                </span>
                <Link to="/track-project" className="custom-link">
                  Track Project
                </Link>
              </li>
            </ul>
          </Collapse> */}

          <DashSideItem
            title={"Policy"}
            logo={<i className="fa-solid fa-file-contract"></i>}
          />
      {
              role === "Admin" ||
              role === "SuperAdmin" ? (
          <li onClick={toggleLeave}>
            <DashSideItem
              title={"User"}
              logo={<i className="fa-solid fa-calendar-days"></i>}
            />
          </li>
                ):("")
              }
          <Collapse in={leaveOpen}>
            <ul className="custom-subitem">
              <li>
                <span className="custom-logo">
                  <i className="fa-solid fa-plus"></i>
                </span>
                <Link to="/add-user" className="custom-link">
                  Add User
                </Link>
              </li>
              <br></br>
              <li>
                <span className="custom-logo">
                  <i className="fa-solid fa-list"></i>
                </span>
                <Link to="/user-list" className="custom-link">
                  User List
                </Link>
              </li>
            </ul>
          </Collapse>

        

        </ul>
        <button className="btn btn-danger px-3 logoutbtn mb-5 " onClick={onLogout}>
          <i class="fa-solid fa-right-from-bracket mx-1"></i>
          Logout
        </button>
      </div>
      {/* <div>
        <button>Logout</button>
      </div> */}
    </>
  );
}

//checking
