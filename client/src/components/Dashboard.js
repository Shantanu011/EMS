import DashHeader from "./dashboard/DashHeader";
import DashSidebar from "./dashboard/DashSidebar";
import React, { useState, useEffect } from "react";
import DashBody from "../pages/DashBody";
import Policy from "../pages/Policy";
import Leave from "../pages/Leave";
import { Routes, Route } from "react-router-dom";
import AddUser from "./AddUser.jsx";
import UserList from "./UserList.jsx";
import EditUser from "./EditUser.jsx";
import Profile from "./Profile.jsx";
import ChangePassword from "../ChangePassword.jsx";
import LeaveDetails from "./LeaveDetails.jsx";
import MyLeave from "./MyLeave.jsx";
import CreateProject from "./CreateProject.jsx";
import TrackProject from "./TrackProject.jsx";
import NotificationsComponent from "../pages/NotificationsComponent.jsx";

const Dashboard = ({ token, username, onLogout, userID, password, role, isPasswordChangeRequired }) => {
  console.log("Role from dashboard", role);
  console.log("password change required", isPasswordChangeRequired)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  console.log("This is dash user", userID);

  return (
    <div className="dashboard-container">
      <DashHeader
        userName={username}
        windowWidth={windowWidth}
        onLogOut={onLogout}
      />

      {windowWidth >= 960 && <DashSidebar onLogout={onLogout} role={role} />}

      <div className="dashbody-container">
      <Routes>
              <Route path="/dashboard" element={<DashBody userID={userID} />} />
              <Route path="/" element={<DashBody userID={userID} />} />
              <Route path="/leave" element={<Leave userID={userID} />} />
              <Route path="/project" element={<CreateProject />} />
              <Route path="/policy" element={<Policy />} />
             
        
             {
          role === "Admin" ||
            role === "SuperAdmin" ? 
            (
            <><Route path="/add-user" element={<AddUser />} />
              <Route path="/user-list" element={<UserList />} />
              </>
              ) : ("")
        }
   
              <Route path="/edit/:Emp_Id" element={<EditUser />} />
              <Route path="/profile" element={<Profile userID={userID} />} />
              <Route
                path="/change-password"
                element={<ChangePassword password={password} />}
              />
              <Route path="/leave-request" element={<LeaveDetails role={role} />} />
              <Route path="/my-leave" element={<MyLeave userID={userID} />} />
              <Route path="/create-project" element={<CreateProject />} />
              <Route path="/track-project" element={<TrackProject />} />
              <Route path="/track-project" element={<TrackProject />} />

            </Routes>
          

      </div>
    </div>
  );
};

export default Dashboard;
