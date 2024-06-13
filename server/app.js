require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var bodyParser = require("body-parser");
const { decrypt } = require("./functions/crypto");

//rotes
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var leaveRouter = require("./routes/leave")
var projectRouter = require("./routes/project")

var tracelog = require("./functions/tracelog");
const sql = require("mssql");
const cron = require("node-cron");


var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

//this is for the cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Authorization", "");
  next();
});

// console.log('the user hashed', process.env.DBCONFIG_USER)

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.text({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// mssql db config
const dbConfig = {
  user: decrypt(process.env.DBCONFIG_USER),
  password: decrypt(process.env.DBCONFIG_PASSWORD),
  server: process.env.DBCONFIG_URL,
  database: process.env.DBCONFIG_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true,
enableArithAbort: true
  },
};

// const dbConfig = {
//   user: "shant",
//   password: "12345",
//   server: "localhost",
//   database: "EMS",
//   options: {
//     encrypt: false,
//     trustServerCertificate: true,
//     enableArithAbort: true
//   }
// };

sql.connect(dbConfig).then(
  (res) => tracelog("EMS-srv:" + " Database connection instance ready"),
  (rej) => tracelog("EMS-srv: 12", rej)
);

//routes for the API
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/leave", leaveRouter)
app.use("/project",projectRouter)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  tracelog("EMS-srv", "404 :" + res);
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
tracelog(
  "EMS-srv:" + " EMS tracelog publisher connected to port 14159"
);

cron.schedule("0 0 0 * * *", async function () {
  const result =
    await sql.query`select convert(varchar, getdate(), 120) as date`;
  var current_date = result.recordset[0].date;
  // purgeRoutine(process.env.SCP_LOCAL_READ, 604800000);
  tracelog(null, "Cron health monitor working. \nThe date is: " + current_date);
});

module.exports = app;
