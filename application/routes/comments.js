const express = require('express');
const { isLoggedIn } = require('../middleware/auth');
const router = express.Router();

router.post("/create", isLoggedIn, async function(req,res,next){

});

module.exports = router;