var express = require('express');
var router = express.Router();
const { doesUsernameExist, doesEmailExist, validateEmail, validatePassword,
  validateUsername } = require('../middleware/validate');
const db = require('../config/database');
const bcrypt = require('bcrypt');
const { isLoggedIn, isMyProfile } = require('../middleware/auth.js');
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
      const hashedPassword = await bcrypt.hash(password, 8);
      var [resultObject] = await db.query(
        `INSERT INTO user (username, email, password) VALUES (?, ?, ?);`,
        [username, email, hashedPassword]
      );
      req.flash("success", "Account created. Please log in.");
      return req.session.save(() => res.redirect('/login'));
    } catch (err) {
      console.error("Insert failed:", err);
      req.flash("error", `Account Creation Failed!!!`)
      return req.session.save((err) => {
        res.redirect('/register');
      });
    }
  }
);

router.post("/login",

  async function (req, res, next) {
    var { username, password } = req.body;

    try {
      const [rows] = await db.query(
        "SELECT * FROM user WHERE username = ? LIMIT 1;",
        [username]
      );

      if (rows.length == 0) {
        req.flash("error", "Invalid username!")
        return req.session.save(() => res.redirect('/login'));
      }

      const user = rows[0];
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        req.flash("error", "Password is incorrect!");
        return req.session.save(() => res.redirect('/login'));
      }

      req.session.user = {
        user_id: user.user_id,
        username: user.username,
        email: user.email
      };

      req.flash("success", `Welcome, ${user.username}!`);
      return req.session.save(() => res.redirect('/'));
    } catch {
      console.flash("error", "Login failed!");
      return req.session.save(() => res.redirect('/login'));
    }
  }
);

router.post("/logout",
  function (req, res, next) {
    req.session.destroy(
      function (err) {
        if (err) {
          console.error("Logout Error: ", err);
          return res.redirect("/");
        }
        res.clearCookie('connect.sid');
        res.redirect("/login");
      }
    );
  }
);

router.get('/:id(\\d+)', isLoggedIn, isMyProfile, async function (req, res) {
  const user_id = req.params.id;

  try {
    const [rows] = await db.query(
      "SELECT username, email FROM user WHERE user_id = ?",
      [user_id]
    );

    if (rows.length === 0) {
      req.flash("error", "User not found.");
      return res.redirect('/');
    }

    const user = rows[0];

    res.render('profile', {
      title: `${user.username}'s Profile`,
      user
    });
  } catch (err) {
    console.error("Failed to load profile:", err);
    req.flash("error", "Could not load profile.");
    res.redirect('/');
  }
});



module.exports = router;
