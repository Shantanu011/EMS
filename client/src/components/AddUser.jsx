import { useState } from "react";
import axios from "axios";
import { Card, Container, Row, Col } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";

const listErrors = [
  {
    name: "lowercase",
    isDone: false,
    text: "Please Enter a lower case alphabet [a-z]",
    type: /[a-z]/g,
  },
  {
    name: "uppercase",
    isDone: false,
    text: "Please Enter a uppercase case alphabet [A-Z]",
    type: /[A-Z]/g,
  },
  {
    name: "special",
    isDone: false,
    text: "Please Enter a Special Character",
    type: /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/,
  },
  {
    name: "number",
    isDone: false,
    text: "Please Enter a Number from 1-9",
    type: /[0-9]/g,
  },
  {
    name: "length",
    isDone: false,
    text: "Please Enter Password over 12 characters",
    len: 12,
  },
  {
    name: "space",
    isDone: false,
    text: "Should not contain whitespace",
    type: /\s/,
  },
];
const INITIAL_USER = {
  Emp_Id: 0,
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
  TotalLeave: 30,
  isLocked: false,
  join_date: "",
  isPasswordChangeRequired: false,
};

export default function AddUser() {
  const [user, setUser] = useState(INITIAL_USER);

  const [passwordErrors, setPasswordErrors] = useState(listErrors);
  const [alertMessage, setAlertMessage] = useState();
  const [showOnFocus, setShowOnFocus] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);
  const [different, setDifferent] = useState(false);

  const [error, setError] = useState({});

  function handleInputChange(e) {
    e.preventDefault();
    const { name, value, type, checked } = e.target;

    // For input elements other than checkboxes
    if (type !== "checkbox") {
      setUser({ ...user, [name]: value });
    } else {
      setUser({ ...user, [name]: checked });
    }

    if (name === "Password") {
      const newErrorList = passwordErrors.map((error) => {
        if (error.name === "length") {
          value.length >= error.len
            ? (error.isDone = true)
            : (error.isDone = false);
        } else if (error.name === "space") {
          !value.match(error.type)
            ? (error.isDone = true)
            : (error.isDone = false);
        } else {
          value.match(error.type)
            ? (error.isDone = true)
            : (error.isDone = false);
        }
        return error;
      });
      setPasswordErrors(newErrorList);
    }
  }

  console.log("User from add user", user);

  const validate = () => {
    let temp = {};

    temp.Password =
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{12,50}$/.test(
        user.Password
      ) && !different
        ? ""
        : "Password policy should be matched";

    setError({ ...temp });

    return Object.values(temp).every((x) => x === "");
  };

  const validatePassword = () => {
    const newErrorList = passwordErrors.map((error) => {
      if (error.name === "length") {
        user.Password.length >= error.len
          ? (error.isDone = true)
          : (error.isDone = false);
      } else if (error.name === "space") {
        !user.Password.match(error.type)
          ? (error.isDone = true)
          : (error.isDone = false);
      } else {
        user.Password.match(error.type)
          ? (error.isDone = true)
          : (error.isDone = false);
      }
      return error;
    });
    setPasswordErrors(newErrorList);
  };
  const userOnSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${process.env.REACT_APP_API_URL}/users`, user)
      .then((response) => setAlertMessage(response.data.responseBody)).then((res)=>setUser(INITIAL_USER));
  };

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
    <div className="w-75 mx-auto justify-content-center">
      <Card className="p-4 add-user-card">
        <h4 className="leave-heading mx-auto justify-content-center w-50 p-2">
          Add New User
        </h4>
        <form class="row g-3 mt-3" onSubmit={userOnSubmit}>
          <div class="col-md-4">
            <label for="firstName" class="form-label">
              Employee ID
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-id-badge"></i>
              </span>
              <input
                onChange={handleInputChange}
                type="text"
                class="form-control"
                id="empID"
                required
                name="Emp_Id"
              />
            </div>
          </div>
          <div class="col-md-4">
            <label for="firstName" class="form-label">
              First Name
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className=" fa-solid fa-user"></i>
              </span>
              <input
                onChange={handleInputChange}
                type="text"
                class="form-control"
                id="firstName"
                required
                name="FirstName"
              />
            </div>
          </div>
          <div class="col-md-4">
            <label for="middleName" class="form-label">
              Middle Name
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className=" fa-solid fa-user"></i>
              </span>
              <input
                onChange={handleInputChange}
                type="text"
                class="form-control"
                id="middleName"
                name="MiddleName"
              />
            </div>
          </div>

          <div class="col-md-4">
            <label for="lastName" class="form-label">
              Last Name
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className=" fa-solid fa-user"></i>
              </span>
              <input
                onChange={handleInputChange}
                type="text"
                class="form-control"
                id="lastName"
                name="LastName"
                required
              />
            </div>
          </div>

          <div class="col-md-6">
            <label for="userName" class="form-label">
              User Name
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-circle-user"></i>
              </span>
              <input
                onChange={handleInputChange}
                type="text"
                class="form-control"
                id="userName"
                name="UserName"
                required
              />
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-lock"></i>
              </span>
              <input
                type="password"
                id="Password"
                className="form-control"
                name="Password"
                autoComplete="false"
                value={user.Password}
                onChange={(e) => handleInputChange(e)}
                onFocus={() => {
                  setShowOnFocus(true);
                }}
                onBlur={() => {
                  setShowOnFocus(false);
                  validatePassword();
                }}
              />
            </div>

            <div>
              <input
                class="form-check-input mx-2"
                type="checkbox"
                value=""
                name="isPasswordChangeRequired"
                onChange={handleInputChange}
                id="flexCheckDefault"
              />
              <label for="flexCheckDefault">Password Change Required?</label>
            </div>

            {/* <div className="tooltip">
            <div className={`tooltip-text ${showOnFocus ? "show" : ""}`}>
              <ul>
                {passwordErrors.map((error, index) => (
                  <li className={error.isDone ? "tick" : "cross"} key={index}>
                    {error.text}
                  </li>
                ))}
                <li className={different ? "cross" : "tick"}>
                  Password should not exceed more than 2 consecutive characters
                  from username, firstname, and lastname
                </li>
              </ul>
            </div>
          </div> */}
          </div>

          {/* <div class="col-md-4 mt-4">
          <label for="email" class="form-label"></label>
          <div>
            <input
              class="form-check-input p-2 mx-2"
              type="checkbox"
              value=""
              id="flexCheckDefault"
            />
            <label for="flexCheckDefault">Password Change Required?</label>
          </div>
        </div> */}

          <div class="col-md-6">
            <label for="joinDate" class="form-label">
              Join Date
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className=" fa-solid fa-user"></i>
              </span>
              <input
                onChange={handleInputChange}
                type="date"
                class="form-control"
                id="join_date"
                name="join_date"
                required
              />
            </div>
          </div>

          <div class="col-6">
            <label for="phoneNumber" class="form-label">
              Phone Number
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className=" fa-solid fa-user"></i>
              </span>
              <input
                onChange={handleInputChange}
                type="text"
                class="form-control"
                id="phoneNumber"
                name="PhoneNo"
                required
              />
            </div>
          </div>

          <div class="col-6">
            <label for="role" class="form-label">
              Role
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className=" fa-solid fa-user"></i>
              </span>
              {/* <input type="email" class="form-control" id="email" /> */}
              <select
                onChange={handleInputChange}
                name="role"
                class="form-control"
              >
                <option selected>Choose the role...</option>
                <option value="SuperAdmin">SuperAdmin</option>
                <option value="Admin">Admin</option>
                <option value="StandardUser">StandardUser</option>
              </select>
            </div>
          </div>

          <div class="col-6">
            <label for="role" class="form-label">
              Department
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className=" fa-solid fa-user"></i>
              </span>
              {/* <input type="email" class="form-control" id="email" /> */}
              <select
                onChange={handleInputChange}
                name="Dept_Id"
                class="form-control"
              >
                <option selected>Select the department...</option>
                <option value="3">Electrical</option>
                <option value="1">Computer</option>
                <option value="2">Administrator</option>
              </select>
            </div>
          </div>

          <div class="col-6">
            <label for="email" class="form-label">
              Email
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className=" fa-solid fa-user"></i>
              </span>
              <input
                onChange={handleInputChange}
                type="email"
                class="form-control"
                id="email"
                name="email"
                required
              />
            </div>
          </div>

          <div class="col-12">
            <label for="inputAddress2" class="form-label">
              Address
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className=" fa-solid fa-user"></i>
              </span>
              <input
                onChange={handleInputChange}
                type="text"
                class="form-control"
                id="inputAddress"
                name="address"
              />
            </div>
          </div>

          <div class="col-md-4">
            <label for="emergencyContact" class="form-label">
              Emergency Contact
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className=" fa-solid fa-user"></i>
              </span>
              <input
                onChange={handleInputChange}
                name="EmergencyContact"
                type="text"
                class="form-control"
                id="inputCity"
              />
            </div>
          </div>

          <div class="col-md-4">
            <label for="inputState" class="form-label">
              Gender
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className=" fa-solid fa-user"></i>
              </span>
              <select
                onChange={handleInputChange}
                id="inputState"
                class="form-select"
                name="gender"
              >
                <option selected>Choose...</option>
                <option>Male</option>
                <option>Female</option>
                <option>Others</option>
              </select>
            </div>
          </div>

          <div class="col-md-4">
            <label for="bloodGroup" class="form-label">
              Blood Group
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className=" fa-solid fa-user"></i>
              </span>
              <select
                onChange={handleInputChange}
                id="bloodGroup"
                class="form-select"
                name="BloodGroup"
              >
                <option selected>Choose...</option>
                <option>A+</option>
                <option>A-</option>
                <option>O+</option>
                <option>O-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>
            </div>
          </div>

          <div class="col-12 mt-4">
            <button type="submit" class="btn btn-danger w-50">
              Add User
            </button>
          </div>
        </form>
      </Card>
    </div>
    </>
  );
}
