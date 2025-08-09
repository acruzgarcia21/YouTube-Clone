var express = require('express');
const { getRecentPosts } = require('../middleware/post');
var router = express.Router();
const db = require("../config/database");

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT p.post_id, p.title, p.thumbnail, p.created_at, u.username
      FROM post p
      JOIN user u ON p.fk_user_id = u.user_id
      ORDER BY p.created_at DESC
      LIMIT 20
    `);

    res.locals.results = rows;
    res.locals.resultsSize = rows.length;
    res.locals.searchValue = '';
    return res.render('index', { title: 'CSC 317 App', css: ['style.css'] });
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
