import Card from "react-bootstrap/Card";
import EditUser from "./EditUser.jsx";
import { useState, useEffect } from "react";
import axios from "axios";
import { isEditable } from "@testing-library/user-event/dist/utils/index.js";

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
  ROLE: "",
  Password: "",
  TotalLeave: 0,
  isLocked: false,
  isPasswordChangeRequired: false,
  tagline: "",
  profilePicture: "",
};

export default function Profile({ userID }) {
  const [user, setUser] = useState(INITIAL_USER);
  const [editMode, setEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  console.log("this is eleeselected ", selectedFile);
  const getUserByID = async () => {
    const data = await axios.get(`${process.env.REACT_APP_API_URL}/users/${userID}`);
    setUser(data.data.responseBody);
  };

  useEffect(() => {
    getUserByID();
  }, []);

  async function userOnSubmit(e) {
    let res = "";
    e.preventDefault();
    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/${userID}`, user)
      .then((response) => alert(response.data.responseBody));
    setEditMode(!editMode);

    // history("/user-list");
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("file image", file);
    setSelectedFile(file);
  };
  function handleInputChange(e) {
    e.preventDefault();
    setUser({ ...user, [e.target.name]: e.target.value });
    console.log("user", user);
  }

  function handleEditClick(e) {
    e.preventDefault();
    setEditMode(!editMode);
  }

  console.log("Profile uuser", userID);

  return (
    <div className="m-5 d-flex justify-content-center">
      <Card bg="Light" key="light" text="dark" className="mb-2 w-1">
        <div>
          <Card.Header className="profile-header p-3">
            Your Profile
            {editMode ? (
              <i
                class="fa-solid fa-xmark btn btn-info float-end"
                onClick={handleEditClick}
              ></i>
            ) : (
              <i
                class="fas fa-edit btn btn-info float-end"
                onClick={handleEditClick}
              ></i>
            )}
          </Card.Header>
        </div>
        <div classname="mt-0">
          <Card.Body className="w-1 d-flex justify-content-center">
            <div className="w-50 m-5 justify-content-center">
              {/* <h4 className="leave-heading p-2">Add New User</h4> */}
              <form class="row g-3 mt-3" onSubmit={(e) => userOnSubmit(e)}>
                <div class="col-6">
                  <label for="profilePicture" class="form-label">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    class="form-control"
                    id="ProfilePicture"
                    name="ProfilePicture"
                    onChange={handleFileChange}
                    readOnly={!editMode}
                  />
                </div>
                <div class="col-md-4">
                  <label for="firstName" class="form-label">
                    First Name
                  </label>
                  <input
                    onChange={handleInputChange}
                    type="text"
                    class="form-control"
                    id="firstName"
                    name="FirstName"
                    value={user.FirstName}
                    readOnly={!editMode}
                  />
                </div>
                <div class="col-md-4">
                  <label for="middleName" class="form-label">
                    Middle Name
                  </label>
                  <input
                    onChange={handleInputChange}
                    type="text"
                    class="form-control"
                    id="middleName"
                    name="MiddleName"
                    value={user.MiddleName}
                    readOnly={!editMode}
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
                    readOnly={!editMode}
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
                    readOnly={!editMode}
                  />
                </div>

                {/* <div class="col-md-6">
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
              </div> */}

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
                    readOnly={!editMode}
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
                    readOnly={!editMode}
                  />
                </div>

                <div class="col-6">
                  <label for="role" class="form-label">
                    Role
                  </label>
                  {/* <input type="email" class="form-control" id="email" /> */}
                  <select
                    onChange={handleInputChange}
                    name="ROLE"
                    class="form-control"
                    value={user.ROLE}
                    readOnly={!editMode}
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
                    readOnly={!editMode}
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
                    readOnly={!editMode}
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
                    readOnly={!editMode}
                  >
                    <option selected>Choose...</option>
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
                    readOnly={!editMode}
                  />
                </div>

                <div class="col-12">
                  <label for="inputAddress2" class="form-label">
                    Tag Line
                  </label>
                  <input
                    onChange={handleInputChange}
                    type="text"
                    class="form-control"
                    id="inputAddress"
                    name="tagline"
                    value={user.tagline}
                    readOnly={!editMode}
                  />
                </div>

                <div class="col-12 mt-4">
                  {editMode ? (
                    <button type="submit" class="btn btn-danger w-50">
                      Save
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </form>
            </div>
          </Card.Body>
        </div>
      </Card>
    </div>
  );
}
