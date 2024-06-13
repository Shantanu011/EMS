import { useEffect, useState } from "react";
import "./Leave.css";
import Alert from "react-bootstrap/Alert";
import NotificationsComponent from "./NotificationsComponent";
import axios from "axios";

const INITIAL_DATA = {
  leaveType: "",
  // numberOfDays: numberOfDays,
  fromDate: "",
  toDate: "",
  appliedTo: "Rahul",
  reason: "",
  Emp_Id: 0,
};

function Leave({ userID }) {
  // const [notifications, setNotifications] = useState([]);

  // useEffect(() => {
  //   // Establish WebSocket connection
  //   const ws = new WebSocket('ws://192.168.100.120:8990');
  //   ws.onopen = () => {
  //     console.log("WebSocket connection established.");
  //   };

  //   // WebSocket message event listener
  //   ws.onmessage = (event) => {
  //     console.log("Received message:", event.data);
  //     const message = JSON.parse(event.data);
  //     if (message.type === 'leaveRequestCreated') {
  //       setNotifications(prevNotifications => [...prevNotifications, message.message]);
  //     }
  //   };

  //   // Cleanup function to close WebSocket connection
  //   return () => {
  //     ws.close();
  //   };
  // }, []); // Run only once on component mount


  // console.log("message is ",notifications)
  console.log("User ID from leave", userID);
  const [DATA,setDATA] = useState([{UserName:'',role:''}])
  const [empLeave, setEmpLeave] = useState(INITIAL_DATA);
  const [alertMessage, setAlertMessage] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [minDate, setMinDate] = useState("");
  function onInputChange(e) {
    console.log(e.target.value);
    setEmpLeave({
      ...empLeave,
      Emp_Id: userID,
      [e.target.name]: e.target.value,
    });

    console.log(empLeave);
  }
  const setData = async()=>{
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/leave/getAdminList`)
    setDATA(res.data.data)
  }
  useEffect(() => {
    const dtToday = new Date();
    const month = String(dtToday.getMonth() + 1).padStart(2, "0");
    const day = String(dtToday.getDate()).padStart(2, "0");
    const year = dtToday.getFullYear();
    setMinDate(`${year}-${month}-${day}`);
    setData()
  }, []);

  const handleFromDateChange = (e) => {
    const selectedDate = e.target.value;
    setEmpLeave({
      ...empLeave,
      fromDate: selectedDate,
      toDate: "", // Reset toDate when fromDate changes
    });
    setMinDate(selectedDate); // Update minDate for toDate
  };

  function alertFunction(e) {
    e.preventDefault();
    alert("successs");
  }
  let leaveData = "";
  async function handleSubmit(event) {
    event.preventDefault();
    const response = await fetch(`${process.env.REACT_APP_API_URL}/leave`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(empLeave),
    });

    leaveData = await response.json();
    setAlertMessage(leaveData.message);

    setEmpLeave(INITIAL_DATA);
  }

  return (
    <>
      {alertMessage && (
        <Alert
          variant="success"
          onClose={() => setAlertMessage("")}
          dismissible
        >
          {alertMessage}
        </Alert>
      )}
      <div class="form-container col-md-7 col-lg-8 mx-auto justify-content-center p-2">
        <h4 className="leave-heading p-2 mx-auto justify-content-center w-50 mb-4">
          Apply for Leave
        </h4>

        <form class="needs-validation mt-" novalidate onSubmit={handleSubmit}>
          <div class="row g-3">
            <div class="col-sm-6">
              <label for="leaveType" class="form-label">
                Leave Type
              </label>
              <select
                class="form-select"
                name="leaveType"
                onChange={(e) => onInputChange(e)}
                required
              >
                <option selected="selected" disabled="true">
                  Please Select a Value
                </option>
                <option value="Paid">Paid</option>
                <option value="Sick">Sick</option>
              </select>
            </div>

            <div class="col-sm-6">
              <label for="appliedTo" class="form-label">
                Apply To
              </label>
              <select
                onChange={(e) => onInputChange(e)}
                class="form-select"
                name="appliedTo"
                // value={empLeave.appliedTo}
                required
              >
                <option selected="selected" disabled="true">
                  Please Select a Value
                </option>
                {/* <option value="">Choose...</option> */}
                {/* <option>United States</option> */}
                {DATA.map((item, index) => (
                  <option key={index} value={item.role}>
                    {item.UserName}
                  </option>
                ))}
              </select>
            </div>

            {/* <div class="col-6">
              <label for="numberOfDays" class="form-label">
                Number of days
              </label>
              <input
                type="number"
                class="form-control"
                name="numberOfDays"
                placeholder="numberOfDays"
                value=""
                // required
              />
            </div> */}

            <div class="col-md-6">
              <label for="fromDate" class="form-label">
                From
              </label>
              <input
                onChange={(e) => handleFromDateChange(e)}
                class="form-control"
                type="date"
                value={empLeave.fromDate}
                name="fromDate"
                id="fromDate"
                min={minDate}
                required
              ></input>
            </div>

            <div class="col-md-6">
              <label for="toDate" class="form-label">
                To
              </label>
              <input
                onChange={(e) => onInputChange(e)}
                class="form-control"
                type="date"
                name="toDate"
                id="toDate"
                value={empLeave.toDate}
                min={minDate}
                max={maxDate}
                required
              ></input>
            </div>
          </div>

          {/* <div class="row gy-3 mt-3 mb-3">
            <div class="col-sm-6">
              <label for="appliedTo" class="form-label">
                Apply To
              </label>
              <select
                onChange={(e) => onInputChange(e)}
                class="form-select"
                name="appliedTo"
                value={empLeave.appliedTo}
                required
              >
                <option value="">Choose...</option>
                <option>United States</option>
                {DATA.map((item, index) => (
                  <option key={index} value={item.position}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div> */}

          <div class="row gy-3 mt-3 mb-3">
            <div class="col-sm-12">
              <label for="reason" class="form-label">
                Reason for Leave
              </label>
              {/* Step 4: Bind the value and onChange event */}
              <textarea
                onChange={(e) => onInputChange(e)}
                class="form-control"
                id="reason"
                name="reason"
                value={empLeave.reason}
                rows="4"
                placeholder="Enter reason for leave"
                required
              ></textarea>
            </div>
          </div>

          <button
            // onClick={alertFunction}
            class="w-75 btn btn-danger mt-2"
            type="submit"
          >
            Apply for Leave
          </button>
        </form>
      </div>
      {/* <NotificationsComponent notifications={notifications} /> */}
    </>
  );
}

export default Leave;
