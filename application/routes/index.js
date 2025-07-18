var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'CSC 317 App' });
});

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Login' });
});

router.get('/post', function (req, res, next) {
  res.render('post', { title: 'Post' });
});

router.get('/register', function (req, res, next) {
  res.render('register', { title: 'Register' });
});

router.get('/viewpost', function (req, res, next) {
  res.render('viewpost', { title: 'View Post' });
});


module.exports = router;
