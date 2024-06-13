import React, { useState, useEffect } from "react";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import CommonModal from "../common/Alert";

export default function LeaveDetails({ role }) {
  const [data, setData] = useState([]);
  const [LeaveStatus, setLeaveStatus] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLeaveEditable, setIsLeaveEditable] = useState(false);
  const [reasonRejected, setReasonRejected] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const itemsPerPage = 6;

  const getData = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/leave/getAll`
    );
    setData(response.data.responseBody);
  };

  useEffect(() => {
    getData();
  }, []);

  console.log("this is role from LeaveDetails", role);

  function handleReasonChange(e) {
    setReasonRejected(e.target.value);
  }

  function handleCloseDeleteModal() {
    setShowModal(!showModal);
    setCurrentId(null);
  }

  console.log("this is data from the data", data);

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    return `${dateObject.getUTCFullYear()}-${(dateObject.getUTCMonth() + 1)
      .toString()
      .padStart(2, "0")}-${dateObject
      .getUTCDate()
      .toString()
      .padStart(2, "0")}`;
  };

  const LeaveStatusRejectedHandler = async (leaveID) => {
    console.log("leave Id", leaveID);
    console.log("LeaveStatus Id", LeaveStatus);

    console.log("reasonRej", reasonRejected);

    await axios.post(
      `${process.env.REACT_APP_API_URL}/leave/updateLeaveStatus/${leaveID}`,
      { LeaveStatus: LeaveStatus, reasonRejected: reasonRejected }
    );
    setAlertMessage(`Leave ${LeaveStatus}`);
    getData();
  };

  const OnchangeStatus = (e) => {
    setLeaveStatus(e.target.value);
    console.log("Leave Status after set", LeaveStatus);
    console.log("this is rolw wo laskdlk", role);
  };

  function handleLeaveEdit() {
    setIsLeaveEditable(!isLeaveEditable);
    console.log("Toggle ", isLeaveEditable);
  }

  async function handleLeaveSetClick(leaveID) {
    const updatedLeaveStatus = LeaveStatus;
    console.log("Leave status for modal", LeaveStatus);

    setAlertMessage(`Leave ${LeaveStatus}`);

    if (updatedLeaveStatus === "Rejected") {
      setShowModal(true);
      // Optionally, you can perform additional actions specific to Rejected status.
    } else if (updatedLeaveStatus === "Approved") {
      // Use axios to post when LeaveStatus is Approved
      await axios.post(
        `${process.env.REACT_APP_API_URL}/leave/updateLeaveStatus/${leaveID}`,
        { LeaveStatus: updatedLeaveStatus }
      );
      // Optionally, you can set a success message or perform additional actions.
    }
  }

  // Calculate total number of pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Calculate the range of items to display for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);
  console.log("Currrr Id", currentId);
  return (
    <>
    
      {showModal && (
        <CommonModal
          show={showModal}
          handleClose={handleCloseDeleteModal}
          title="Reason for Rejection"
          onCancel={handleCloseDeleteModal}
          onConfirm={() => {
            LeaveStatusRejectedHandler(currentId);
          }}
        >
          <label>Reason</label>
          <textarea
            onChange={handleReasonChange}
            className="form-control"
          ></textarea>
        </CommonModal>
      )}
      {alertMessage && (
        <Alert
          variant="success"
          onClose={() => setAlertMessage("")}
          dismissible
        >
          {alertMessage}
        </Alert>
      )}
      <div className="d-flex">
        <h4 className="leave-heading mx-auto justify-content-center w-50 p-2">
          Leave Details Page
        </h4>
        <button className="btn btn-primary m-3" onClick={handleLeaveEdit}>
          Toggle Edit Leave
        </button>
      </div>
      <table className="table table-striped-columns border border-dark m-2 pt-4">
        {/* Table Header */}
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">From Date</th>
            <th scope="col">To Date</th>
            <th scope="col">Reason</th>
            <th scope="col">Status From Co-Admin</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.Leave_Id}>
              <td>{item.FirstName + " " + item.LastName}</td>
              <td>{formatDate(item.fromDate)}</td>
              <td>{formatDate(item.toDate)}</td>
              <td>{item.reason}</td>

              {/* CoAdmin Status */}
              <td>
                {role === "SuperAdmin" ? (
                  <p>{item.AdminStatus || "Pending"}</p>
                ) : (
                  <p>{item.SuperAdminStatus || "Pending"}</p>
                )}
              </td>

              <td>
                <div className="d-flex">
                  <select
                    onChange={OnchangeStatus}
                    className="form-select"
                    defaultValue={
                      role === "SuperAdmin"
                        ? item.SuperAdminStatus || "Pending"
                        : item.AdminStatus || "Pending"
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <button
                    className="btn btn-primary btn-sm m-1 fa-solid fa-check"
                    onClick={
                      () => {
                        setCurrentId(item.Leave_Id);
                        handleLeaveSetClick(item.Leave_Id);
                      }
                      // handleLeaveStatusChange(item.Leave_Id);
                    }
                  ></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <nav
        style={{ display: "flex", justifyContent: "center", marginTop: "5px" }}
      >
        <ul className="pagination">
          {Array.from({ length: totalPages }).map((_, index) => (
            <li
              key={index}
              className={`page-item ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
