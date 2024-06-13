import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

const DATA = [
  {
    name: "Rahul",
    position: "IT Head",
  },
  {
    name: "Pradip",
    position: "Electrical Engineering Head",
  },
  {
    name: "Rabi",
    position: "Manager",
  },
];

const PROJECT_DATA = {
  Emp_Id: 11,
  title: "",
  details: "",
  status_comment: "",
  project_status: "",
  project_lead: 11,
  starting_date: "",
  due_date: "",
  completion_date: "",
  tag: "",
  project_member: 11,
};

export default function CreateProject() {
  const [data, setData] = useState([]);
  const [assignMembers, setAssignMembers] = useState([]);
  const [projectData, setProjectData] = useState(PROJECT_DATA);

  const getData = async () => {
    const userData = await axios.get(`${process.env.REACT_APP_API_URL}/user`);
    setData(userData.data.responseBody);

    const userOptions = userData.data.responseBody.map((item) => ({
      value: item.UserName,
      label: item.FirstName + " " + item.LastName,
    }));
    setAssignMembers(userOptions);
  };

  function handleProjectInput(selectedOptionsOrEvent) {
    if (selectedOptionsOrEvent.target) {
      const { name, value } = selectedOptionsOrEvent.target;
      setProjectData({ ...projectData, [name]: value });
    } else {
      const selectedOptions = selectedOptionsOrEvent;
      const selectedValues = selectedOptions.map((option) => option.value);
      setProjectData({ ...projectData, project_member: selectedValues });
    }
  }

  async function handleCreateProjectSubmit(e) {
    e.preventDefault();
    const projectSubmitData = await axios.post(
      `${process.env.REACT_APP_API_URL}/project`,
      projectData
    );
  }

  console.log("Project Input Data", projectData);

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="w-75 mx-auto justify-content-center">
      <h4 className="leave-heading p-1 mx-auto justify-content-center w-50">
        Create Project
      </h4>
      <form className="p-2" action="POST" onSubmit={handleCreateProjectSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Project Title
          </label>
          <input
            type="text"
            className="form-control"
            name="title"
            onChange={handleProjectInput}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="details" className="form-label">
            Details
          </label>
          <input
            type="text"
            className="form-control"
            id="details"
            name="details"
            onChange={handleProjectInput}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="status_comment" className="form-label">
            Status Comment
          </label>
          <input
            type="text"
            className="form-control"
            id="status_comment"
            name="status_comment"
            onChange={handleProjectInput}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="project_status" className="form-label">
            Project Status
          </label>
          <input
            type="text"
            className="form-control"
            id="project_status"
            name="project_status"
            onChange={handleProjectInput}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="tag" className="form-label">
            Tag
          </label>
          <input
            type="text"
            className="form-control"
            id="tag"
            name="tag"
            onChange={handleProjectInput}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="project_lead" className="form-label">
            Assign Leader
          </label>
          <select
            className="form-select"
            id="project_lead"
            name="project_lead"
            onChange={handleProjectInput}
          >
            {DATA.map((item, index) => (
              <option key={index} value={item.position}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="project_member" className="form-label">
            Assign Team Members
          </label>
          <Select
            // defaultValue={"abc"}
            isMulti
            name="project_member"
            options={assignMembers}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleProjectInput}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="starting_date" className="form-label">
            Starting Date
          </label>
          <input
            type="date"
            className="form-control"
            id="starting_date"
            name="starting_date"
            onChange={handleProjectInput}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="completion_date" className="form-label">
            Completion Date
          </label>
          <input
            type="date"
            className="form-control"
            id="completion_date"
            name="completion_date"
            onChange={handleProjectInput}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="due_date" className="form-label">
            Due Date
          </label>
          <input
            type="date"
            className="form-control"
            id="due_date"
            name="due_date"
            onChange={handleProjectInput}
          />
        </div>

        <button type="submit" className="btn btn-danger w-50 justify-content-center">
          Submit
        </button>
      </form>
    </div>
  );
}
