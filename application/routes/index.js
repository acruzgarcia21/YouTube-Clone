var express = require('express');
const { getRecentPosts } = require('../middleware/post');
var router = express.Router();
const db = require("../config/database");

router.get('/', async (req, res, next) => {
  try {
    const [posts] = await db.query(`
      SELECT post_id, title, description, thumbnail, video, created_at
      FROM post
      ORDER BY created_at DESC
    `);

    res.render('index', {
      title: 'Home',
      results: posts,
      css: ['style.css'], 
      js: ['r.js']
    });
  } catch (err) {
    next(err);
  }
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
