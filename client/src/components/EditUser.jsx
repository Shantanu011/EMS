import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

const INITIAL_USER = {
  Emp_Id: "",
  FirstName: "",
  MiddleName: "",
  LastName: "",
  PhoneNo: "",
  UserName: "",
  email: "",
  gender: "",
  address: "",
  Dept_Id: 0,
  EmergencyContact: "",
  BloodGroup: "",
  role: "",
  Password: "",
  TotalLeave: 0,
  isLocked: false,
  isPasswordChangeRequired: false,
};

export default function AddUser() {
  const [user, setUser] = useState(INITIAL_USER);
  const [alertMessage, setAlertMessage] = useState();
  const [passChanged,setPassChanged] = useState(false)
  let history = useNavigate();
  let { Emp_Id } = useParams();

  const getUserByID = async () => {
    const data = await axios.get(`${process.env.REACT_APP_API_URL}/users/${Emp_Id}`);
    setUser(data.data.responseBody);
  };

  useEffect(() => {
    getUserByID();
  }, []);

  function handleInputChange(e) {
    e.preventDefault();
    console.log(user)
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  async function userOnSubmit(e) {
    e.preventDefault();
    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/${Emp_Id}`, user)
      .then((response) => setAlertMessage(response.data.responseBody));

    history("/user-list");
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
      <div className="w-50 m-5 mx-auto justify-content-center">
        <h2 className="leave-heading p-1">Edit User</h2>
        <form className="row g-3 mt-3" onSubmit={(e) => userOnSubmit(e)}>
          <div className="col-md-4">
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              onChange={handleInputChange}
              type="text"
              className="form-control"
              id="firstName"
              name="FirstName"
              value={user.FirstName}
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="middleName" className="form-label">
              Middle Name
            </label>
            <input
              onChange={handleInputChange}
              type="text"
              className="form-control"
              id="middleName"
              name="MiddleName"
              // required
              value={user.MiddleName}
            />
          </div>

          <div class="col-md-4">
            <label for="lastName" class="form-label">
              Last Name
            </label>
            <input
              onChange={handleInputChange}
              type="text"
              class="form-control"
              id="lastName"
              name="LastName"
              required
              value={user.LastName}
            />
          </div>

          <div class="col-md-6">
            <label for="userName" class="form-label">
              User Name
            </label>
            <input
              onChange={handleInputChange}
              type="text"
              class="form-control"
              id="userName"
              name="UserName"
              required
              value={user.UserName}
            />
          </div>

          <div class="col-md-6">
            <label for="inputPassword" class="form-label">
              Password
            </label>
            <input
              type="password"
              onChange={handleInputChange}
              class="form-control"
              id="inputPassword"
              name="Password"
            />
          </div>

          <div class="col-6">
            <label for="email" class="form-label">
              Email
            </label>
            <input
              onChange={handleInputChange}
              type="email"
              class="form-control"
              id="email"
              name="email"
              required
              value={user.email}
            />
          </div>

          <div class="col-6">
            <label for="phoneNumber" class="form-label">
              Phone Number
            </label>
            <input
              onChange={handleInputChange}
              type="text"
              class="form-control"
              id="phoneNumber"
              name="PhoneNo"
              required
              value={user.PhoneNo}
            />
          </div>

          <div class="col-6">
            <label for="role" class="form-label">
              Role
            </label>
            {/* <input type="email" class="form-control" id="email" /> */}
            <select
              onChange={handleInputChange}
              name="role"
              class="form-control"
              value={user.role}
            >
              <option value="SuperAdmin">SuperAdmin</option>
              <option value="Admin">Admin</option>
              <option value="StandardUser">StandardUser</option>
            </select>
          </div>

          {/* <div class="col-6">
          <label for="role" class="form-label">
            Team
          </label>
       
          <select
            onChange={handleInputChange}
            name="Team"
            class="form-control"
            value={user.Dept_Id}
          >
            <option value="Electrical">Electrical</option>
            <option value="Computer">Computer</option>
            <option value="Other">Other</option>
          </select>
        </div> */}

          <div class="col-12">
            <label for="inputAddress2" class="form-label">
              Address
            </label>
            <input
              onChange={handleInputChange}
              type="text"
              class="form-control"
              id="inputAddress"
              name="address"
              value={user.address}
            />
          </div>
          <div class="col-md-4">
            <label for="emergencyContact" class="form-label">
              Emergency Contact
            </label>
            <input
              onChange={handleInputChange}
              name="EmergencyContact"
              type="text"
              class="form-control"
              id="inputCity"
              value={user.EmergencyContact}
            />
          </div>
          <div class="col-md-4">
            <label for="inputState" class="form-label">
              Gender
            </label>
            <select
              onChange={handleInputChange}
              id="inputState"
              class="form-select"
              name="gender"
              value={user.gender}
            >
              <option selected disabled="True">
                Choose...
              </option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div class="col-md-4">
            <label for="inputZip" class="form-label">
              Blood Group
            </label>
            <input
              onChange={handleInputChange}
              type="text"
              class="form-control"
              id="BloodGroup"
              name="BloodGroup"
              value={user.BloodGroup}
            />
          </div>

          <div className="col-12 mt-4">
            <button type="submit" className="btn btn-danger w-50">
              Edit User Details
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
