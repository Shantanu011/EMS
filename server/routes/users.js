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

const responseMessage = "Operation failed. Please try later.";
// this is to get all the users
//business admin
router.get(
  "/",
  authenticateToken,


  async function (req, res) {
    try {
      const result = await sql.query`
    select
    Emp_Id,FirstName,MiddleName, LastName, PhoneNo, UserName, email,gender,Dept_Id,EmergencyContact,BloodGroup,TotalLeave,isLocked,address, role, ProfilePicture,tagline,Password, isPasswordChangeRequired, PasswordUpdated,PaidLeave,SickLeave,UnpaidLeave,RemainingDays
    from Employees
    `;
      res.send({ responseBody: result.recordset,userDetails:req.user });
    } catch (err) {
      tracelog(err);
      res.status(500).send({ responseBody: err });
    }
  }
);

// // this is used for login authentication and token generation
// router.post("/login/", async function (req, res) {
//   var showPickList = true;
//   try {
//     const result = await sql.query`
//     select
//      REG_USERS_ID, USERNAME, ROLE, Password,isPasswordChangeRequired,terminal_id
//      from application_users where (USERNAME =${req.body.USERNAME})
//      `;
//     if (
//       result.rowsAffected[0] !== 0 &&
//       (await bcrypt.compare(req.body.Password, result.recordset[0].Password))
//     ) {
//       const accessToken = jwt.sign(
//         result.recordset[0],
//         process.env.ACCESS_TOKEN_SECRET
//       );
//       var authorizedTerminal = result.recordset[0].terminal_id;
//       if (req.body.device_name) {
//         const result2= await sql.query`
//         select terminal_id from tablet_config where
//         name = ${req.body.device_name}`
//         showPickList = result2.rowsAffected == 0;
//         authorizedTerminal = showPickList ? result.recordset[0].terminal_id :result2.recordset[0].terminal_id
//        }
//       res.send({
//         responseBody: {
//           token: accessToken,
//           role: result.recordset[0].ROLE,
//           isPasswordChangeRequired:
//             result.recordset[0].isPasswordChangeRequired,
//           terminals: authorizedTerminal,
//           REG_USERS_ID: result.recordset[0].REG_USERS_ID,
//           showPickList: (result.recordset[0].terminal_id).includes(authorizedTerminal)?showPickList:true
//         },
//       });
//     } else {
//       throw "Invalid username/password combination.";
//     }
//   } catch (err) {
//     tracelog(err);
//     res.status(500).send({ responseBody: err });
//   }
// });

//Another endpoint for LOGIN
router.post("/login", async function (req, res) {
  // var showPickList = true;
  const time_stamp = new Date().toISOString();
  tracelog(req.body.UserName," attempted to login!")
  try {
    //USER data check

    var result1 = await sql.query` select
    Emp_Id,FirstName,MiddleName, LastName, PhoneNo, UserName, email,gender,Dept_Id,EmergencyContact,BloodGroup,TotalLeave,isLocked,address, role,  Password, isPasswordChangeRequired,PasswordUpdated,PaidLeave,SickLeave,UnpaidLeave,RemainingDays
    from Employees where (UserName =${req.body.UserName})`;
    if (result1.rowsAffected != 0 && result1.recordset[0].isLocked) {
      throw "Your account is locked!! Please contact your adminstrator";
    } else if (
      // result1.rowsAffected != 0
      result1.rowsAffected != 0 && 
      (await bcrypt.compare(req.body.Password, result1.recordset[0].Password))
    ) {
      const accessToken = jwt.sign(
        result1.recordset[0],
        process.env.ACCESS_TOKEN_SECRET
        // Add the below line to add session time and the last number represent the minutes ll
        // { expiresIn: 60 * 120 }
      );
      var authorizedTerminal = result1.recordset[0].terminal_id;
      var to_date = result1.recordset[0].PasswordUpdated;
      var changed_epoch = new Date(result1.recordset[0].PasswordUpdated);
      var last_change_date = changed_epoch.setDate(
        changed_epoch.getDate() + 120
      );
      var today_date = new Date();
      var d = "this is new";
      if (today_date > last_change_date) {
        res.send({
          responseBody: {
            token: accessToken,
            role: result1.recordset[0].role,
            isPasswordChangeRequired: true,
            Emp_Id: result1.recordset[0].Emp_Id,
            PasswordUpdated: result1.recordset[0].PasswordUpdated,
            FirstName: result1.recordset[0].FirstName,
            LastName: result1.recordset[0].LastName,
            UserName: result1.recordset[0].UserName,
          },
        });
      } else {
        res.send({
          responseBody: {
            token: accessToken,
            role: result1.recordset[0].role,
            isPasswordChangeRequired:
              result1.recordset[0].isPasswordChangeRequired,
            Emp_Id: result1.recordset[0].Emp_Id,
            PasswordUpdated: result1.recordset[0].PasswordUpdated,
            FirstName: result1.recordset[0].FirstName,
            LastName: result1.recordset[0].LastName,
            UserName: result1.recordset[0].UserName,
          },
        });
      }
    } else {
      throw "Invalid username/password combination.";
    }
  } catch (err) {
    tracelog(err);
    res.status(500).send({ responseBody: err });
  }
});

//this is the endpoint to update the passowrd when the isPasswordChangeRequired is checked
//no user check as required to change password upon reset
router.post(
  "/password_change/:id/",
  async function (req, res) {
    try {
      var result1 = await sql.query` select USERNAME,
      PrevPassword1, PrevPassword2, PrevPassword3, PrevPassword4, PrevPassword5,Password
      from Employees where (REG_USERS_ID =${req.params.id})`;
      const salt = await bcrypt.genSalt(saltRounds);
      hashpassword = await bcrypt.hash(req.body.Password, salt);
      if (
        (await bcrypt.compare(
          req.body.Password,
          result1.recordset[0].PrevPassword1
        )) ||
        (await bcrypt.compare(
          req.body.Password,
          result1.recordset[0].PrevPassword2
        )) ||
        (await bcrypt.compare(
          req.body.Password,
          result1.recordset[0].PrevPassword3
        )) ||
        (await bcrypt.compare(
          req.body.Password,
          result1.recordset[0].PrevPassword4
        )) ||
        (await bcrypt.compare(
          req.body.Password,
          result1.recordset[0].PrevPassword5
        )) ||
        (await bcrypt.compare(req.body.Password, result1.recordset[0].Password))
      ) {
        res.status(201).send({
          responseBody: "New Password cannot be same as Previous Password",
        });
      } else {
        const salt = await bcrypt.genSalt(saltRounds);
        hashpassword = await bcrypt.hash(req.body.Password, salt);
        const time_stamp = moment().format("YYYY-MM-DD HH:mm:ss").toString();
        await sql.query`
    UPDATE
     Employees
     SET
     prev_password5=prev_password4,prev_password4=prev_password3,prev_password3=prev_password2,prev_password2=prev_password1,prev_password1=Password,Password=${hashpassword}, isPasswordChangeRequired=0,PasswordUpdated=${time_stamp} WHERE (REG_USERS_ID =${req.params.id})
     `;
        res.send({
          responseBody: "New password updated successfully.",
        });
      }
    } catch (err) {
      tracelog(err);
      res.status(500).send({ responseBody: err });
    }
  }
);
router.get("/self", async function (req, res) {
  res.send({ responseBody: req.user.USERNAME });
});
// this is to get specific user in the parameter the users
//business admin
// router.get("/:id/", authenticateToken, adminonly, async function (req, res) {
router.get(
  "/:id/",
  async function (req, res) {
    try {
			  const uid= req.params.id

      console.log("req.querry.params ",req.query)
      const result = await sql.query`
	  select
    Emp_Id,FirstName,MiddleName, LastName, PhoneNo, UserName, email,gender,Dept_Id,EmergencyContact,BloodGroup,TotalLeave,isLocked,address, role,ProfilePicture, isPasswordChangeRequired, PasswordUpdated,PasswordUpdated,PaidLeave,SickLeave,UnpaidLeave,RemainingDays
     from Employees where (Emp_Id =${uid})
      `;
      const user = result.recordset[0];
      //     const result2 = await sql.query`
      //   select distinct  terminal_name from terminal_info
      //   `;
      //     const terminalsList = result2.recordset.map((element) => {
      //         return { ...element, checked: user.terminal_id.includes(element.terminal_id) }
      //     });

      const data = {
        ...user,
        // terminal: terminalsList,
      };
      res.send({ responseBody: result.recordset[0] });
    } catch (err) {my
      tracelog(err);
      res.status(500).send({ responseBody: err });
    }
  }
);

//this is to update the data from the database
//business admin
// router.post("/:id", authenticateToken, adminonly, async function (req, res) {
router.post(
  "/:id",
  async function (req, res) {
    const uid = req.params.id;
    console.log("user id from update ",req.params.id)
    console.log("user body from update ",req.body)
    console.log("user body from update ",req.body.ProfilePicture)


      let profilePictureBuffer="";
    if (req.body.ProfilePicture) {
   profilePictureBuffer = Buffer.from(req.body.ProfilePicture, 'base64');
  // Rest of your code...
} else {
  console.log("error")
  // Handle the case where ProfilePicture is undefined in the request body.
  // You may want to send an appropriate response or log an error.
}

	console.log("Logging :", profilePictureBuffer);
    // const time_stamp = moment().format("YYYY-MM-DD HH:mm:ss").toString();
    var hashpassword;
    try {
      if (req.body.Password) {
        var result1 = await sql.query` select USERNAME,
      PrevPassword1, PrevPassword2, PrevPassword3, PrevPassword4, PrevPassword5,Password
      from Employees where (Emp_Id =${req.params.id})`;
        if (
          (await bcrypt.compare(
            req.body.Password,
            result1.recordset[0].PrevPassword1
          )) ||
          (await bcrypt.compare(
            req.body.Password,
            result1.recordset[0].PrevPassword2
          )) ||
          (await bcrypt.compare(
            req.body.Password,
            result1.recordset[0].PrevPassword3
          )) ||
          (await bcrypt.compare(
            req.body.Password,
            result1.recordset[0].PrevPassword4
          )) ||
          (await bcrypt.compare(
            req.body.Password,
            result1.recordset[0].PrevPassword5
          )) ||
          (await bcrypt.compare(
            req.body.Password,
            result1.recordset[0].Password
          ))
        ) {
          res.status(201).send({
            responseBody: "New Password cannot be same as Previous Password",
          });
        } else {
          const salt = await bcrypt.genSalt(saltRounds);
          hashpassword = await bcrypt.hash(req.body.Password, salt);
          const time_stamp = moment().format("YYYY-MM-DD HH:mm:ss").toString();
          var result = await sql.query`
      UPDATE Employees
      SET
      Emp_Id=${req.body.Emp_Id},
      FirstName=${req.body.FirstName},
      MiddleName=${req.body.MiddleName},
      LastName=${req.body.LastName},
      PhoneNo=${req.body.PhoneNo},
      UserName=${req.body.UserName},
      email=${req.body.email},
      gender=${req.body.gender},
      address=${req.body.address},
      Dept_Id=${req.body.Dept_Id},
      EmergencyContact=${req.body.EmergencyContact},
      BloodGroup=${req.body.BloodGroup},
      role=${req.body.role},
      Password=${hashpassword},
      TotalLeave=${req.body.TotalLeave},
      isLocked=${req.body.isLocked},
      tagline=${req.body.tagline},
  ProfilePicture = CONVERT(varbinary(max), ${profilePictureBuffer}),
        isPasswordChangeRequired=${req.body.isPasswordChangeRequired}
      WHERE (Emp_Id =${uid})
       `;
          res.send({
            responseBody:
              result.rowsAffected === 0
                ? // ? responseMessage
                  "The data could not be updated"
                : "Details updated successfully.",
          });
        }
      } else {
        hashpassword = null;
        var result = await sql.query`UPDATE Employees
      SET
      Emp_Id=${req.body.Emp_Id},
      FirstName=${req.body.FirstName},
      MiddleName=${req.body.MiddleName},
      LastName=${req.body.LastName},
      PhoneNo=${req.body.PhoneNo},
      UserName=${req.body.UserName},
      email=${req.body.email},
      gender=${req.body.gender},
      address=${req.body.address},
      Dept_Id=${req.body.Dept_Id},
      EmergencyContact=${req.body.EmergencyContact},
      BloodGroup=${req.body.BloodGroup},
      role=${req.body.role},
      TotalLeave=${req.body.TotalLeave},
      isLocked=${req.body.isLocked},
      isPasswordChangeRequired=${req.body.isPasswordChangeRequired},
  ProfilePicture = CONVERT(varbinary(max), ${profilePictureBuffer})
      WHERE (Emp_Id =${uid})
        `;
        res.send({
          responseBody:
            result.rowsAffected === 0
              ? responseMessage
              : "Details updated successfully.",
        });
      }
      // res.send({
      //   responseBody:
      //     result.rowsAffected === 0
      //       ? responseMessage
      //       : "Details updated successfully.",
      // });
    } catch (err) {
      tracelog(err);
      res.status(500).send({ responseBody: err });
    }
  }
);

//this is to create a new user to the database table users
//business admin
// router.post("/", authenticateToken, adminonly, async function (req, res) {
router.post(
  "/",
  // authenticateToken,
  // roleBusinessAdmin,
  async function (req, res) {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      let hashpassword = await bcrypt.hash(req.body.Password, salt);
      // console.log('this is the hash password', hashpassword)
      var tempRole = "ItAdmin";

      const time_stamp = moment().format("YYYY-MM-DD HH:mm:ss").toString();

      // await sql.query`
      // INSERT INTO application_users
      // (FIRSTNAME, LASTNAME, PHONE, USERNAME, EMAIL, CARRIER, SEND_ALERTS, ROLE,  Password, isPasswordChangeRequired, PasswordUpdated, prev_password1,prev_password2,prev_password3,prev_password4,prev_password5)
      //   VALUES
      //   (${req.body.FIRSTNAME},${req.body.LASTNAME},${req.body.PHONE},${req.body.USERNAME},${req.body.EMAIL},${req.body.CARRIER},${req.body.SEND_ALERTS},${req.body.ROLE},${hashpassword},${req.body.isPasswordChangeRequired},${time_stamp},${hashpassword},${hashpassword},${hashpassword},${hashpassword},${hashpassword})
      //   `;

      //for now all the users created are ITadmin
      // await sql.query`
      //   INSERT INTO Employees

      //   (Emp_Id,FirstName,MiddleName, LastName, PhoneNo, UserName, join_date,email,gender,Dept_Id,EmergencyContact,BloodGroup,TotalLeave,isLocked,address, role,ProfilePicture , Password, isPasswordChangeRequired, PasswordUpdated, PrevPassword1,PrevPassword2,PrevPassword3,PrevPassword4,PrevPassword5)
      //     VALUES
      //     (${req.body.Emp_Id},${req.body.FirstName},${req.body.MiddleName},${req.body.LastName},${req.body.PhoneNo},${req.body.UserName},${req.body.join_date},${req.body.email},${req.body.gender},${req.body.Dept_Id},
      //       ${req.body.EmergencyContact},${req.body.BloodGroup},${req.body.TotalLeave},${req.body.isLocked},
      //     ${req.body.address},${req.body.role},${req.body.ProfilePicture},${hashpassword},${req.body.isPasswordChangeRequired},${time_stamp},${hashpassword},${hashpassword},
      //     ${hashpassword},${hashpassword},${hashpassword})
      //     `;

      await sql.query`
        INSERT INTO Employees

        (Emp_Id,FirstName,MiddleName, LastName, PhoneNo, UserName, join_date,email,gender,Dept_Id,EmergencyContact,BloodGroup,TotalLeave,isLocked,address, role , Password, isPasswordChangeRequired, PasswordUpdated, PrevPassword1,PrevPassword2,PrevPassword3,PrevPassword4,PrevPassword5)
          VALUES
          (${req.body.Emp_Id},${req.body.FirstName},${req.body.MiddleName},${req.body.LastName},${req.body.PhoneNo},${req.body.UserName},${req.body.join_date},${req.body.email},${req.body.gender},${req.body.Dept_Id},
            ${req.body.EmergencyContact},${req.body.BloodGroup},${req.body.TotalLeave},${req.body.isLocked},
          ${req.body.address},${req.body.role},${hashpassword},${req.body.isPasswordChangeRequired},${time_stamp},${hashpassword},${hashpassword},
          ${hashpassword},${hashpassword},${hashpassword})
          `;

      res.send({
        responseBody: "New user added successfully.",
      });
    } catch (err) {
      tracelog(err);
      res.status(500).send({
        // responseBody: err.originalError.info.message
        //   ? err.originalError.info.message
        //   : err,
        err
      });
    }
  }
);

// Delete the user based on the username sent on the parameter
//business admin
// router.get(
//   "/delete/:id/",
//   authenticateToken,
//   adminonly,
//   async function (req, res) {
router.get(
  "/delete/:id/",
  async function (req, res) {
    const uid = req.params.id;
    try {
      const result =
        await sql.query`DELETE FROM Employees WHERE (Emp_Id =${uid})`;
      result.rowsAffected > 0
        ? res.send({ responseBody: "Data deleted successfully" })
        : res.status(204).send({ responseBody: "there is no such data in the database" });
      // res.send({responseMessage : result.rowsAffected > 0 ? {responseBody : "Data deleted successfully"}:{responseBody:"there is no such data in the database"}});
    } catch (err) {
      tracelog(err);
      res.status(500).send({ responseBody: err });
    }
  }
);

function adminonly(req, res, next) {
  req.user.ROLE.toUpperCase() != "ADMIN"
    ? res
        .status(403)
        .send({ responseBody: "Access Denied!! Contact your Administrator!!" })
    : next();
}

module.exports = router;
