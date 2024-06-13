import React, { useState } from "react";
import logoImg from "../../assets/nankai.png";

import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Offcanvas from "react-bootstrap/Offcanvas";
import DashSidebar from "./DashSidebar";
import Leave from "../../pages/Leave";
import { Link } from "react-router-dom";

function DashHeader({ userName, windowWidth, onLogOut }) {
  console.log("uawernMW", userName);
  const [sideBar, setSideBar] = useState(false);

  const handleClose = () => setSideBar(false);
  const handleShow = () => setSideBar(true);

  return (
    <Navbar className="navbar" fixed="top">
      <Container fluid>
        <Navbar.Brand href="#home" className="text-white">
          {windowWidth >= 960 ? (
            <img
              alt="logo"
              src={logoImg}
              width="40"
              height="40"
              className="logo-img mx-8"
            />
          ) : (
            // <button className="fas fa-bars fa-1x p-1 m-2 border-0 ">
            <i onClick={handleShow} className="fas fa-bars fa-1x m-2"></i>

            // </button>
          )}
          <Offcanvas show={sideBar} onHide={handleClose} className="offClass">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>EMS</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <>
                <DashSidebar className="collapse-sidebar" />
              </>
            </Offcanvas.Body>
          </Offcanvas>
          EMS
        </Navbar.Brand>
        <div className="d-flex mt-2">
          {/* start */}
          <i
            class="fa fa-bell mt-2 mx-3 px-2 text-white"
            aria-hidden="true"
          ></i>

          <p className="text-white m-1">{userName}</p>
          <ul className="nav-item dropdown text-white mt-1 px-2">
            <a
              className="nav-link dropdown-toggle fa-solid fa-user"
              href="#"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            ></a>
            <div className="dropdownOwn">
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item font" to="/profile">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/change-password">
                    Change Password
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" onClick={onLogOut}>
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </ul>

          {/* end */}
        </div>
      </Container>
    </Navbar>
  );
}

export default DashHeader;
