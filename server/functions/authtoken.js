const jwt = require("jsonwebtoken");

var ROLES = {
  "ROLEONE": "StandardUser",
  "ROLETWO": "ITAdmin",
  "ROLETHREE": "Admin",
  "ROLEFOUR": "SuperAdmin",
 
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  // const token = req.body.token;

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send({ responseBody: err });
    req.user = user;
   /*  req.query.term_code
      ? req.user.terminal_id.includes(req.query.term_code) */
         next()
      /*   : res
          .status(403)
          .send({
            responseBody: "Access Denied!!! Contact your Administrator!!!",
          }) */
     
  });
}

function onlyStandardUser(req, res, next) {
  if (req.user.ROLE === ROLES.ROLETHREE) {
    next();
  }
  else {
    res.status(403)
      .send({
        responseBody: "Access Denied!!! Contact your Administrator!!!",
      })
  }
}

function roleItAdmin(req, res, next) {
  if (req.user.ROLE === ROLES.ROLEONE) {
    next();
  }
  else {
    res.status(403)
      .send({
        responseBody: "Access Denied!!! Contact your Administrator!!!",
      })
  }
}

function roleBusinessAdmin(req, res, next) {
  if (req.user.ROLE === ROLES.ROLETWO ||
    req.user.ROLE === ROLES.ROLEONE) {
    next();
  }
  else {
    res.status(403)
      .send({
        responseBody: "Access Denied!!! Contact your Administrator!!!",
      })
  }
}



function roleStandardUser(req, res, next) {
  if (req.user.ROLE === ROLES.ROLEONE ||
    req.user.ROLE === ROLES.ROLETWO ||
    req.user.ROLE === ROLES.ROLETHREE) {
    //if checking the term_code in query to match with the user is to be executed only for operatrs
    // req.query.term_code
    // ? req.user.terminal_id.includes(req.query.term_code)
    //   ? next()
    //   : res
    //     .status(403)
    //     .send({
    //       responseBody: "Access Denied!!! Contact your Administrator!!!",
    //     })
    // : next();
    next()
  }
  else {
    res.status(403)
      .send({
        responseBody: "Access Denied!!! Contact your Administrator!!!",
      })
  }
}

function roleViewUser(req, res, next) {
  if (req.user.ROLE === ROLES.ROLEONE ||
    req.user.ROLE === ROLES.ROLETWO ||
    req.user.ROLE === ROLES.ROLETHREE ||
    req.user.ROLE === ROLES.ROLEFOUR) {
    next()
  }
  else {
    res.status(403)
      .send({
        responseBody: "Access Denied!!! Contact your Administrator!!!",
      })
  }
}

module.exports = {
  authenticateToken,
  roleItAdmin,
  roleBusinessAdmin,
  roleStandardUser,
  roleViewUser
};
