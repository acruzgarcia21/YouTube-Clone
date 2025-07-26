var express = require('express');
var router = express.Router();
const { doesUsernameExist, doesEmailExist, validateEmail, validatePassword,
  validateUsername } = require('../middleware/validate');
const db = require('../config/database');
const bcrypt = require('bcrypt');
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
    var { username, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password,3);
      var [resultObject] = await db.query(
        `INSERT INTO user (username, email, password) VALUES (?, ?, ?);`,
        [username, email, hashedPassword]
      );
      console.log("Insert successful:", resultObject);
      res.redirect('/login');
    } catch (err) {
      console.error("Insert failed:", err);
      res.redirect('/register');
    }
  }
);

module.exports = router;
