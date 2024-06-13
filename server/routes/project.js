require("dotenv").config();

var express = require("express");
var bcrypt = require("bcryptjs");
var router = express.Router();
var saltRounds = 10;
const jwt = require("jsonwebtoken");
const sql = require("mssql");
const fs = require("fs");
const moment = require("moment");
var tracelog = require("../functions/tracelog");

var {
  authenticateToken,
  roleBusinessAdmin,
  roleItAdmin,
  roleStandardUser,
  roleViewUser,
} = require("./../functions/authtoken");
const { trace } = require("console");



async function checkEmployeeExists(empId) {
  try {
    const result = await sql.query`
      SELECT COUNT(*) AS count FROM Employees WHERE Emp_Id = ${empId};
    `;

    return result.recordset[0].count > 0;
  } catch (err) {
    console.error(err);
    return false;
  }
}

// Route to handle POST requests to create a new project entry
router.post('/', async (req, res) => {
  try {
    const {
      title,
      details,
      status_comment,
      project_status,
      project_lead,
      project_member,
      starting_date,
      due_date,
      completion_date,
      tag,
      Emp_Id
    } = req.body;

    const leadExists = await checkEmployeeExists(project_lead);
    const memberExists = await checkEmployeeExists(project_member);

    if (!leadExists || !memberExists) {
      return res.status(400).json({ error: 'One or more employees with provided IDs do not exist' });
    }

    // Insert the project into the Project table
    const result = await sql.query`
      INSERT INTO Project (
        title,
        details,
        status_comment,
        project_status,
        project_lead,
        project_member,
        starting_date,
        due_date,
        completion_date,
        tag,
        Emp_Id
      )
      VALUES (
        ${title},
        ${details},
        ${status_comment},
        ${project_status},
        ${project_lead},
        ${project_member},
        ${starting_date},
        ${due_date},
        ${completion_date},
        ${tag},
        ${Emp_Id}
      );
    `;

    res.status(201).json({ message: 'Project entry created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});







module.exports = router;
