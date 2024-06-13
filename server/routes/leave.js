
require("dotenv").config();
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const nodemailer = require('nodemailer');
var {
  authenticateToken,
  roleBusinessAdmin,
  roleItAdmin,
  roleStandardUser,
  roleViewUser,
} = require("./../functions/authtoken");
// Middleware to parse JSON in the request body
router.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'asiatriad@gmail.com',
    pass: 'kkqa hqqg udxi twka'  // use your Gmail password
  }
});

// Route to handle POST requests to create a new leave entry
router.post('/', async (req, res) => {
  try {
    const { fromDate, toDate, appliedTo, reason, leaveType, Emp_Id,total_days } = req.body;

    // Check if the employee ID exists in the Employees table
    const employeeExists = await checkEmployeeExists(Emp_Id);

    if (!employeeExists) {
      return res.status(400).json({ error: 'Employee with provided ID does not exist' });
    }



	  const employeeResult = await sql.query`
      SELECT Email, FirstName,LastName
      FROM Employees
      WHERE Emp_Id = ${Emp_Id};
    `;
  if (employeeResult.recordset.length === 0) {
      return res.status(400).json({ error: 'Employee with provided ID does not exist' });
    }

    const { FirstName, LastName, Email } = employeeResult.recordset[0];


	const existingLeaveRequest = await sql.query`
      SELECT Leave_Id
      FROM [dbo].[LeaveMgmt]
      WHERE Emp_Id = ${Emp_Id} AND LeaveStatus = 'Pending';
    `;

           console.log("thisis ",existingLeaveRequest.recordset.length)
    if (existingLeaveRequest.recordset.length > 0) {
		console.log("emo",Emp_Id)
      return res.status(400).json({ message: 'You already have a leave request pending' });
    }
    // Calculate total_days - range_of_date in the database query itself
    const result = await sql.query`
      INSERT INTO LeaveMgmt (fromDate, toDate, appliedTo, reason, leaveType, Emp_Id)
      VALUES (${fromDate}, ${toDate}, ${appliedTo}, ${reason}, ${leaveType}, ${Emp_Id});
      /* SELECT TotalLeave - DATEDIFF(day, ${fromDate}, ${toDate}) AS adjusted_total_days FROM Employees WHERE Emp_Id = ${Emp_Id}; */
    `;


  const mailOptions = {
      from: 'asiatriad@gmail.com',
      to: 'sumitduwal@gmail.com',  // replace with the recipient's email
      subject: `Leave Request Created ${FirstName} ${LastName}`,
      text: `You Have New Leave Request from ${FirstName} ${LastName}.`
	  };

	  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email sending error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    // Extract the adjusted_total_days from the query result
    /* const adjustedTotalDays = result.recordset[0].adjusted_total_days;
      console.log("this is days", adjustedTotalDays) */
    res.status(201).json({ message: 'Leave entry created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to check if an employee with the given ID exists
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

// get leave

router.get(
  "/",

  async function (req, res) {
    try {
      const result = await sql.query`
    select
    Emp_Id,FirstName,MiddleName, LastName, PhoneNo, UserName, email,gender,Dept_Id,EmergencyContact,BloodGroup,TotalLeave,isLocked,address, ROLE,  Password, isPasswordChangeRequired, PasswordUpdated
    from Employees
    `;
      res.send({ responseBody: result.recordset });
    } catch (err) {
      tracelog(err);
      res.status(500).send({ responseBody: err });
    }
  }
);



router.get(
  "/getAll",

  async function (req, res) {
    try {
      const result = await sql.query`
        SELECT
          LM.Leave_Id,
          LM.fromDate,
          LM.toDate,
          LM.appliedTo,
          LM.reason,
          LM.leaveType,
          LM.Emp_Id,
          E.FirstName,
          E.LastName,
          LM.LeaveStatus,
		  LM.SuperAdminStatus,
		  LM.AdminStatus
        FROM
          [dbo].[LeaveMgmt] LM
        JOIN
          [dbo].[Employees] E ON LM.Emp_Id = E.Emp_Id
        ORDER BY CASE WHEN LM.LeaveStatus = 'Pending' THEN 0 ELSE 1 END, LM.LeaveStatus;
      `;

      // Flatten the nested array
      const flattenedArray = result.recordsets.flat();

      res.send({ responseBody: flattenedArray });
    } catch (err) {
      tracelog(err);
      res.status(500).send({ responseBody: err });
    }
  }
);



router.get('/getById/:empId', async function (req, res) {
  try {
    const empId = req.params.empId;

    const result = await sql.query`
      SELECT
        LM.Leave_Id,
        LM.fromDate,
        LM.toDate,
        LM.appliedTo,
        LM.reason,
        LM.leaveType,
        LM.Emp_Id,
		E.TotalLeave,
        E.FirstName,
        E.LastName,
        LM.LeaveStatus,
        LM.ReasonRejected,
        E.RemainingDays,
        E.PaidLeave,
        E.SickLeave,
        E.UnpaidLeave
      FROM
        [dbo].[LeaveMgmt] LM
      JOIN
        [dbo].[Employees] E ON LM.Emp_Id = E.Emp_Id
      WHERE
        LM.Emp_Id = ${empId}
      ORDER BY CASE WHEN LM.LeaveStatus = 'Pending' THEN 0 ELSE 1 END, LM.LeaveStatus;
    `;

    // Flatten the nested array
    const flattenedArray = result.recordsets.flat();

    res.send({ responseBody: flattenedArray });
  } catch (err) {
    tracelog(err);
    res.status(500).send({ responseBody: err });
  }
});

router.get('/getAdminList', async(req,res)=>{
  const result = await sql.query(
    `select UserName,role from Employees where role='Admin' or role='SuperAdmin'`
  )
  console.log(result)
  res.status(200).json({data:result.recordset})
})
module.exports = router;






// // Function to send an email
// const sendEmail = async (to, subject, text) => {
//   try {
//     const mailOptions = {
//       from: 'asiatriad@gmail.com',
//       to,
//       subject,
//       text,
//     };
//
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Email sent:', info.response);
//   } catch (error) {
//     console.error('Email sending error:', error);
//   }
// };






router.post('/updateLeaveStatus/:leaveId', authenticateToken, async (req, res) => {
  try {
    const leaveId = req.params.leaveId;
    const newLeaveStatus = req.body.LeaveStatus;
    const reasonRejected = req.body.reasonRejected;
    console.log(req.user.role)
    // Validate if leaveId and leaveStatus are provided
    if (!leaveId || !newLeaveStatus) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Retrieve the current leave status
    const currentLeaveStatusResult = await sql.query`
      SELECT LeaveStatus,leaveType
      FROM [dbo].[LeaveMgmt]
      WHERE Leave_Id = ${leaveId};
    `;

    if (currentLeaveStatusResult.recordset.length === 0) {
      return res.status(400).json({ error: 'Leave record not found' });
    }

    const currentLeaveStatus = currentLeaveStatusResult.recordset[0].LeaveStatus;

    // Update the leave status in the 'LeaveMgmt' table based on the user's role
    if (req.user.role === "SuperAdmin") {
      await sql.query`
        UPDATE [dbo].[LeaveMgmt]
        SET SuperAdminStatus = ${newLeaveStatus}
        WHERE Leave_Id = ${leaveId};
      `;
    }

    if (req.user.role === "Admin") {
      await sql.query`
        UPDATE [dbo].[LeaveMgmt]
        SET AdminStatus = ${newLeaveStatus}, ReasonRejected = ${reasonRejected}
        WHERE Leave_Id = ${leaveId};
      `;
    }

    // Update LeaveStatus based on conditions
    await sql.query`
      UPDATE LeaveMgmt
      SET LeaveStatus =
        CASE
          WHEN SuperAdminStatus = 'Approved' AND AdminStatus = 'Approved' THEN 'Approved'
          WHEN SuperAdminStatus = 'Approved' AND AdminStatus = 'Rejected' THEN 'Rejected'
          WHEN SuperAdminStatus = 'Rejected' AND AdminStatus = 'Approved' THEN 'Rejected'
          WHEN SuperAdminStatus = 'Rejected' AND AdminStatus = 'Rejected' THEN 'Rejected'
        END;
    `;

    // Retrieve LeaveStatus from the database
    const leaveStatusResult = await sql.query`
      SELECT LeaveStatus,leaveType
      FROM [dbo].[LeaveMgmt]
      WHERE Leave_Id = ${leaveId};
    `;

    // Check if the recordset has a length greater than 0
    if (leaveStatusResult.recordset.length > 0) {
      const {LeaveStatus ,leaveType} = leaveStatusResult.recordset[0];

      // If the leave status is updated from 'Pending' to 'Approved', subtract the remaining days
      if (LeaveStatus === 'Approved' && leaveType==="Sick") {
        const leaveInfo = await sql.query`
          SELECT fromDate, toDate, Emp_Id
          FROM [dbo].[LeaveMgmt]
          WHERE Leave_Id = ${leaveId};
        `;

        if (leaveInfo.recordset.length === 0) {
          return res.status(400).json({ error: 'Leave record not found' });
        }

        const { fromDate, toDate, Emp_Id } = leaveInfo.recordset[0];

        const result = await sql.query`
          SELECT DATEDIFF(day, ${fromDate}, ${toDate}) + 1 AS NumberOfDays;
        `;

        const numberOfDays = result.recordset[0].NumberOfDays;

        // Subtract the totalLeave by numberOfDays in the employees table
        await sql.query`
          UPDATE [dbo].[Employees]
          SET RemainingDays = RemainingDays - ${numberOfDays},
          SickLeave=PaidLeave-${numberOfDays}
          WHERE Emp_Id = ${Emp_Id};
        `;
      }

      else if(LeaveStatus === 'Approved' && leaveType==="Paid"){
        const leaveInfo = await sql.query`
          SELECT fromDate, toDate, Emp_Id
          FROM [dbo].[LeaveMgmt]
          WHERE Leave_Id = ${leaveId};
        `;

        if (leaveInfo.recordset.length === 0) {
          return res.status(400).json({ error: 'Leave record not found' });
        }

        const { fromDate, toDate, Emp_Id } = leaveInfo.recordset[0];

        const result = await sql.query`
          SELECT DATEDIFF(day, ${fromDate}, ${toDate}) + 1 AS NumberOfDays;
        `;

        const numberOfDays = result.recordset[0].NumberOfDays;

        // Subtract the totalLeave by numberOfDays in the employees table
        await sql.query`
          UPDATE [dbo].[Employees]
          SET RemainingDays = RemainingDays - ${numberOfDays},
          PaidLeave=PaidLeave-${numberOfDays}
          WHERE Emp_Id = ${Emp_Id};
        `;
      }



      // If the leave status is updated from 'Approved' to something else, add back the remaining days
      if (currentLeaveStatus === 'Approved' && newLeaveStatus === 'Rejected' && leaveType==="Paid") {
        const leaveInfo = await sql.query`
          SELECT fromDate, toDate, Emp_Id
          FROM [dbo].[LeaveMgmt]
          WHERE Leave_Id = ${leaveId};
        `;

        if (leaveInfo.recordset.length === 0) {
          return res.status(400).json({ error: 'Leave record not found' });
        }

        const { fromDate, toDate, Emp_Id } = leaveInfo.recordset[0];

        const result = await sql.query`
          SELECT DATEDIFF(day, ${fromDate}, ${toDate}) + 1 AS NumberOfDays;
        `;

        const numberOfDays = result.recordset[0].NumberOfDays;

        // Add back the totalLeave by numberOfDays in the employees table
        await sql.query`
          UPDATE [dbo].[Employees]
          SET RemainingDays = RemainingDays + ${numberOfDays},
          PaidLeave =  PaidLeave + ${numberOfDays}
          WHERE Emp_Id = ${Emp_Id};
        `;


      }

      else if (currentLeaveStatus === 'Approved' && newLeaveStatus === 'Rejected' && leaveType==="Sick"){
        const leaveInfo = await sql.query`
          SELECT fromDate, toDate, Emp_Id
          FROM [dbo].[LeaveMgmt]
          WHERE Leave_Id = ${leaveId};
        `;

        if (leaveInfo.recordset.length === 0) {
          return res.status(400).json({ error: 'Leave record not found' });
        }

        const { fromDate, toDate, Emp_Id } = leaveInfo.recordset[0];

        const result = await sql.query`
          SELECT DATEDIFF(day, ${fromDate}, ${toDate}) + 1 AS NumberOfDays;
        `;

        const numberOfDays = result.recordset[0].NumberOfDays;

        // Add back the totalLeave by numberOfDays in the employees table
        await sql.query`
          UPDATE [dbo].[Employees]
          SET RemainingDays = RemainingDays + ${numberOfDays},
          SickLeave =  SickLeave + ${numberOfDays}
          WHERE Emp_Id = ${Emp_Id};
        `;
      }
      // const employeeEmailResult = await sql.query`
      //   SELECT Email, FirstName, LastName
      //   FROM [dbo].[Employees]
      //   WHERE Emp_Id = ${Emp_Id};
      // `;

      // if (employeeEmailResult.recordset.length === 0) {
      //   return res.status(400).json({ error: 'Employee not found' });
      // }
      //
      // const { Email, FirstName, LastName } = employeeEmailResult.recordset[0];

      // Send email notification
      // const mailOptions = {
      //   from: 'asiatriad@gmail.com',
      //   to: Email,  // Use the employee's email
      //   subject: `Leave Status Update for ${FirstName} ${LastName}`,
      //   text: `Your leave request has been updated to ${newLeaveStatus}.`
      // };

      // transporter.sendMail(mailOptions, (error, info) => {
      //   if (error) {
      //     console.error('Email sending error:', error);
      //   } else {
      //     console.log('Email sent:', info.response);
      //   }
      // });
    }

    res.status(200).json({ message: `Leave status updated to ${newLeaveStatus} successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = router;
