import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../common/Alert";
import CommonModal from "../common/Alert";

export default function UserList() {
  const [data, setData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleShowDeleteModal = (Emp_Id) => {
    console.log("emp_id from showmodal", Emp_Id);
    setSelectedUserId(Emp_Id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedUserId(null);
    setShowDeleteModal(false);
  };

  const getData = async () => {
    const data = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
    setData(data.data.responseBody);
  };
  useEffect(() => {
    getData();
  }, []);

  // axios.get("http://localhost:8090/users").then(response => console.log(response.data.responseBody));

  console.log("userlistData", data);

  function handleDelete(e, Emp_Id) {
    e.preventDefault();

    // console.log("User deleted");
  }

  const handleDeleteConfirm = () => {
    console.log("this is user from delete confirm", selectedUserId);
    // Perform delete operation here
    axios
      .get(`${process.env.REACT_APP_API_URL}/users/delete/${selectedUserId}`)
      .then(() => {
        // If successful, close the modal and refresh data
        handleCloseDeleteModal();
        getData();
      })
      .catch((error) => {
        // Handle delete error
        console.error("Delete error:", error);
        handleCloseDeleteModal();
      });
  };
  return (
    <>
      <CommonModal
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        title="Delete Confirmation"
        content="Are you sure you want to delete this item?"
        onConfirm={handleDeleteConfirm}
        onCancel={handleCloseDeleteModal}
      />
      <h4 className="leave-heading mx-auto justify-content-center w-50 p-2">
        User List Page
      </h4>
      <table className="table table-striped-columns border border-dark m-2 pt-4">
        <thead>
          <tr>
            <th scope="col">Username</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Contact</th>
            <th scope="col">Address</th>
            <th scope="col">Action</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.map((item) => (
            <tr key={item.Emp_Id}>
              <td>{item.UserName}</td>
              <td>{item.FirstName + " " + item.LastName}</td>
              <td>{item.email}</td>
              <td>{item.PhoneNo}</td>
              <td>{item.address}</td>
              <td className="m-2">
                <button
                  className="btn btn-danger fa-solid fa-trash m-1"
                  onClick={() => handleShowDeleteModal(item.Emp_Id)}
                ></button>
                <Link
                  Key={"EDIT"}
                  to={`/edit/${item.Emp_Id}`}
                  className="custom-link"
                >
                  <button
                    text="EDIT"
                    className="btn btn-primary fa-solid fa-pencil"
                  ></button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
