import React, { useEffect, useState } from "react";
import logo from "../../assets/nankai.png";
import axios from "axios";
import ChangePassword from "../../ChangePassword";
import Dashboard from "../Dashboard";
import Header from "../Header";
import SetAuthToken from "../../utils/SetAuthToken";
import CommonModal from "../../common/Alert";
import NotificationsComponent from "../../pages/NotificationsComponent";
export default function Login({ notifications }) {
  console.log("not from dash", notifications);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, SetUserId] = useState("");
  const [role, setRole] = useState("");
  const [token, setToken] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [isPasswordChangeRequired, setIspasswordchangeReq] = useState();

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handleCloseModal() {
    setShowModal(!showModal);
  }

  const changePassword = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/users/reset-password`,
        { email }
      );
      // setMessage(response.data.message);
    } catch (error) {
      // setMessage('An error occurred. Please try again later.');
      console.error(error);
    }
  };
  function handleEmailModel(e) {
    e.preventDefault();
    setShowModal(!showModal);
  }
  useEffect(() => {
    // Check if user is already authenticated (e.g., by checking localStorage or session storage)
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);

      SetAuthToken(token);

      SetUserId(localStorage.getItem("userId"));
      setRole(localStorage.getItem("role"));
      setUsername(localStorage.getItem("username"));
    }
  }, []);

  let userID = null;

  function handleUserInput(event) {
    setUsername(event.target.value);
  }

  function handlePasswordInput(event) {
    setPassword(event.target.value);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    SetAuthToken(null);
    setIsAuthenticated(false);
  }

  // async function handleSubmit(event) {
  //   event.preventDefault();

  //   try {
  //     const response = await fetch("http://localhost:8090/users/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         UserName: username,
  //         Password: password,
  //       }),
  //     });

  //     const loginData = await response.json();

  //     if (response.ok) {
  //       console.log("this is the login role", loginData.responseBody.role);
  //       localStorage.setItem("token", token);

  //       SetAuthToken(token)
  //       setToken(loginData.responseBody.token);
  //       setRole(loginData.responseBody.role);
  //       SetUserId(loginData.responseBody.Emp_Id);
  //       console.log("Login Data", loginData);
  //       setIsAuthenticated(true);
  //     } else {
  //       setError(
  //         loginData.message || "The username or password was incorrect."
  //       );
  //     }
  //   } catch (err) {
  //     setError("An error occurred. Please try again.");
  //   }
  // }
  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserName: username,
          Password: password,
        }),
      });

      const loginData = await response.json();

      if (response.ok) {
        console.log("this is the login role", loginData.responseBody.role);
        const token = loginData.responseBody.token; // Get token from response
        localStorage.setItem("token", token); // Set token in local storage
        SetAuthToken(token); // Set token in Axios headers
        setToken(token);
        setRole(loginData.responseBody.role);
        SetUserId(loginData.responseBody.Emp_Id);
        setIspasswordchangeReq(loginData.responseBody.isPasswordChangeRequired);
        console.log("Login Data", loginData);
        setIsAuthenticated(true);
        localStorage.setItem("userId", loginData.responseBody.Emp_Id);
        localStorage.setItem("role", loginData.responseBody.role);
        localStorage.setItem("username", username);
      } else {
        setError(
          loginData.message || "The username or password was incorrect."
        );
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  }

  // if (isAuthenticated) {
  //   // SetAuthToken(token);
  //   return (
  //     <>
  //     <Dashboard
  //       username={username}
  //       onLogout={handleLogout}
  //       userID={userId}
  //       password={password}
  //       role={role}
  //       isPasswordChangeRequired={isPasswordChangeRequired}

  //     />

  //     {/* <NotificationsComponent notifications={notifications} /> */}
  //     </>
  //   );
  // }
  console.log(
    "is password change required from isAuth",
    isPasswordChangeRequired
  );

  if (isAuthenticated) {
    // SetAuthToken(token);
    return (
      <>
        {isPasswordChangeRequired ? (
          <ChangePassword
            username={username}
            onLogout={handleLogout}
            userID={userId}

            // onPasswordChange={handlePasswordChange}
          />
        ) : (
          <Dashboard
            username={username}
            onLogout={handleLogout}
            userID={userId}
            password={password}
            role={role}
            isPasswordChangeRequired={isPasswordChangeRequired}
          />
        )}
      </>
    );
  }

  return (
    <>
      {showModal && (
        <CommonModal
          show={showModal}
          handleClose={handleCloseModal}
          title="Change Password"
          onCancel={handleCloseModal}
          onConfirm={() => {
            changePassword(email);
          }}
        >
          <label>EMAIL</label>
          <input onChange={handleEmailChange} className="form-control" />
        </CommonModal>
      )}

      <Header />
      <div className="login-form container mt-3">
        <div className="row justify-content-center">
          <div className="col-md-4">
            {" "}
            {/* Decreased width from col-md-6 to col-md-5 */}
            <img
              className="img-fluid rounded mb-3"
              src={logo}
              alt="Logo"
            />
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                {" "}
                {/* Adjusted margin from mb-3 to mb-2 */}
                <label htmlFor="username" className="form-label">
                  User Name
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter User Name"
                  value={username}
                  onChange={handleUserInput}
                  className="form-control"
                />
              </div>
              <div className="mb-4">
                {" "}
                {/* Adjusted margin from mb-3 to mb-2 */}
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={handlePasswordInput}
                  className="form-control"
                />
              </div>
              {error && <p className="text-danger mb-2">{error}</p>}{" "}
              {/* Adjusted margin from mb-3 to mb-2 */}
              <button
                type="button"
                class="btn btn-link text-decoration-none text-black mb-2"
                onClick={handleEmailModel}
              >
                Forgot Password?
              </button>
              <button type="submit" className="btn btn-danger w-100 p-2">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
