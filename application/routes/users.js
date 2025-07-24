var express = require('express');
var router = express.Router();
const {doesUsernameExist, doesEmailExist, validateEmail, validatePassword, validateUsername} = require('../middleware/validate');

/**
 *  /users/register
 * 
 * if fails redirect to /register
 * if succeeds redirect to /login
 */
router.post("/register",
  validateUsername,
  validatePassword,
  validateEmail,
  doesUsernameExist,
  doesEmailExist,
  async function (req, res, next) {
  var {username,email,password,cpassword,aoc,tos} = req.body;

  /**
   * 1 - validate data
   * 2 - check uniqueness
   * 3 - insert into db(create new user)
   * 4 - respond
   * 5 - failed redirect to /register
   * 6 - succeed redirect to /login
   */
  res.send(username)
})

module.exports = router;
