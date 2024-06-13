import axios from "axios";
import { useEffect, useState } from "react";

export default function MyLeave({ userID }) {
  console.log("myleave UserId", userID);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    return `${dateObject.getUTCFullYear()}-${(dateObject.getUTCMonth() + 1)
      .toString()
      .padStart(2, "0")}-${dateObject
      .getUTCDate()
      .toString()
      .padStart(2, "0")}`;
  };

  const getLeaveData = async () => {
    try {
      const response = await axios.get(`
      ${process.env.REACT_APP_API_URL}/leave/getById/${userID}`);
      setData(response.data.responseBody);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  };

  useEffect(() => {
    getLeaveData();
  }, [userID]);

  console.log(data);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  const latestLeave = data.length > 0 ? data[0] : null;

  return (
    <div>
      <h4 className="leave-heading mx-auto justify-content-center w-50 p-2">
        My Leave
      </h4>
      <div className="leave-cards-container d-flex">
        <div className="card m-3">
          <div className="card-header p-3">
            <h5 className="card-title">My Leave</h5>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            latestLeave && (
              <div className="card-body">
                <h5 className="card-title">Your Leave Information</h5>
                <p className="card-text">
                  Total Leave: {latestLeave.TotalLeave}
                </p>
                <p className="card-text">
                  Remaining Leaves: {latestLeave.RemainingDays}
                </p>
                <p className="card-text">Total Sick Leave: 12</p>
                <p className="card-text">
                  Remaining sick Leave: {latestLeave.SickLeave}
                </p>

                <p className="card-text">Total Paid Leave: 18</p>
                <p className="card-text">
                  Remaining paid Leave: {latestLeave.PaidLeave}
                </p>

                <p className="card-text">
                  Latest Leave Status: {latestLeave.LeaveStatus}
                </p>
                <div className="btn-group">
                  {/* <ul className="dropdown-menu">
                  {data.map((leave, index) => (
                    <li key={index}>
                      <a className="dropdown-item" href="#">
                        {leave.LeaveStatus} - {leave.TotalLeave} days
                      </a>
                    </li>
                  ))}
                </ul> */}
                </div>
              </div>
            )
          )}
        </div>
        <div className="card m-3">
          <div className="card-header p-3">
            <h5 className="card-title">Leave History</h5>
          </div>

          <div className="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">From Date</th>
                  <th scope="col">To Date</th>
                  <th scope="col">Reason</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item.Leave_Id}>
                    <td>{formatDate(item.fromDate)}</td>
                    <td>{formatDate(item.toDate)}</td>
                    <td>{item.reason}</td>
                    <td>{item.LeaveStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <nav
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "5px",
              }}
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
          </div>
        </div>
      </div>
    </div>
  );
}
