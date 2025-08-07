var express = require('express');
const { getRecentPosts } = require('../middleware/post');
var router = express.Router();

router.get('/', getRecentPosts, function (req, res, next) {
  res.render('index', { title: 'CSC 317 App', css: ['style.css'] });
});

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Login', css: ['style.css'], js: ['r.js'] });
});

router.get('/post', function (req, res, next) {
  res.render('post', { title: 'Post', css: ['style.css'] });
});

router.get('/register', function (req, res, next) {
  res.render('register', { title: 'Register', css: ['style.css'], js: ['r.js'] });
});

router.get('/view', function (req, res, next) {
  res.render('view', { title: 'View', css: ['style.css'], js: ['r.js'] });
});

module.exports = router;
