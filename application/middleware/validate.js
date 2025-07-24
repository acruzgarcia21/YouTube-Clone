const db = require('../config/database');

module.exports = {
    doesUsernameExist: async function (req, res, next) {
        var{username} = req.body;
        next()
    },
    doesEmailExist: async function (req, res, next) {
        next()
    },
    validateUsername: async function (req, res, next) {
        next()
    },
    validatePassword: async function (req, res, next) {
        next()
    },
    validateEmail: async function (req, res, next) {
        next()
    }
}