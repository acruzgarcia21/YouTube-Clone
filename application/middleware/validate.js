const db = require('../config/database');

async function checkIfExists(column, value) {
    const query = `SELECT user_id FROM user WHERE ${column} = ?;`;
    const [rows, _] = await db.query(query, [value]);
    return rows && rows.length === 1;
}

module.exports = {
    doesUsernameExist: async function (req, res, next) {
        const { username } = req.body;
        console.log("[Check] Username exists?", username);

        if (await checkIfExists('username', username)) {
            console.log("Username already exists:", username);
            return res.redirect('/register');
        }
        console.log("Username is unique.");
        next();
    },

    doesEmailExist: async function (req, res, next) {
        const { email } = req.body;
        console.log("[Check] Email exists?", email);

        if (await checkIfExists('email', email)) {
            console.log("Email already exists:", email);
            return res.redirect('/register');
        }
        console.log("Email is unique.");
        next();
    },

    validateUsername: function (req, res, next) {
        let { username } = req.body;
        console.log("[Validate] Username:", username);

        username = username.trim();

        if (!/^[a-zA-Z]/.test(username)) {
            console.log("Invalid: Username must start with a letter.");
            return res.redirect('/register');
        }

        if (username.length < 3) {
            console.log("Invalid: Username too short.");
            return res.redirect('/register');
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            console.log("Invalid: Username has special characters.");
            return res.redirect('/register');
        }

        console.log("Username passed validation.");
        next();
    },

    validateEmail: function (req, res, next) {
        const { email } = req.body;
        console.log("[Validate] Email:", email);

        const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailFormat.test(email)) {
            console.log("Invalid: Email format.");
            return res.redirect('/register');
        }

        console.log("Email passed validation.");
        next();
    },

    validatePassword: function (req, res, next) {
        const { password } = req.body;
        console.log("[Validate] Password:", password);

        if (password.length < 8) {
            console.log("Invalid: Password too short.");
            return res.redirect('/register');
        }
        if (!/[A-Z]/.test(password)) {
            console.log("Invalid: Missing uppercase letter.");
            return res.redirect('/register');
        }
        if (!/\d/.test(password)) {
            console.log("Invalid: Missing number.");
            return res.redirect('/register');
        }
        if (!/[!@#$%^&*()\-+={}\[\]:;"'<>,.?/\\|~`]/.test(password)) {
            console.log("Invalid: Missing special character.");
            return res.redirect('/register');
        }

        console.log("Password passed validation.");
        next();
    },
};
