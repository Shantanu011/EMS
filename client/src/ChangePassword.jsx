import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ChangePassword({
  password,
  username,
  userID,
  onLogout,
}) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [passwordChange, setPasswordChange] = useState({
    oldPassword: "",
    newPassword: "",
    retypedNewPassword: "",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const { oldPassword, newPassword, retypedNewPassword } = passwordChange;
  let passwordStatus = false;
  function handelShowOldPassword() {
    setShowOldPassword(!showOldPassword);
  }

  console.log("username from change password", username);
  console.log("userID from change password", userID);

  function handleSavePassword(e) {
    e.preventDefault();

    if (passwordChange.retypedNewPassword !== passwordChange.newPassword) {
      setAlertMessage("New and re-typed password did not match");
    } else {
      passwordStatus = true;
    }

    if (passwordStatus) {
      axios.post(
        `${process.env.REACT_APP_API_URL}/users/password_change/${userID}`,
        { Password: passwordChange.newPassword }
      );
    }
    onLogout();
  }

  function onInputChange(e) {
    console.log("Change password");
    setPasswordChange({ ...passwordChange, [e.target.name]: e.target.value });
    console.log(passwordChange);
  }

  return (
    <div className=" px-5">
      {alertMessage && (
        <Alert
          variant="success"
          onClose={() => setAlertMessage("")}
          dismissible
        >
          {alertMessage}
        </Alert>
      )}

      <h1 className="mb-5">Change Password</h1>

      {/* <div class="mb-3 d-flex">
        <label for="oldPassword" class="col-sm-2 col-form-label">
          Old Password
        </label>
        <div class="col-sm-5">
          <input
            type={showOldPassword ? "text" : "password"}
            class="form-control"
            id="inputPassword"
            onChange={onInputChange}
            name="oldPassword"
            value={oldPassword}
          />
        </div> */}
      {/* <span
          className="col-sm-1 mt-2 fa-solid fa-eye"
          onClick={handelShowOldPassword}
        ></span> */}
      {/* </div> */}

      <div class="mb-3 d-flex ">
        <label for="oldPassword" class="col-sm-2 col-form-label">
          New Password
        </label>
        <div class="col-sm-5">
          <input
            type={showOldPassword ? "text" : "password"}
            class="form-control"
            id="inputPassword"
            onChange={onInputChange}
            name="newPassword"
            value={newPassword}
          />
        </div>
        {/* <span
          className="col-sm-1 mt-2 fa-solid fa-eye"
          onClick={handelShowOldPassword}
        ></span> */}
      </div>

      <div class="mb-3 d-flex">
        <label for="oldPassword" class="col-sm-2 col-form-label">
          Re-Type New Password
        </label>
        <div class="col-sm-5">
          <input
            type={showOldPassword ? "text" : "password"}
            class="form-control"
            id="inputPassword"
            onChange={onInputChange}
            value={retypedNewPassword}
            name="retypedNewPassword"
          />
        </div>
        {/* <span
          className="col-sm-1 mt-2 fa-solid fa-eye"
          onClick={handelShowOldPassword}
        ></span> */}
      </div>
      <div className="button-group">
        <button
          className="btn btn-small btn-secondary px-2 my-2"
          onClick={handelShowOldPassword}
        >
          Show Password
        </button>

        <button
          className="btn btn-small btn-info "
          onClick={handleSavePassword}
        >
          Save Password
        </button>
      </div>
    </div>
  );
}
