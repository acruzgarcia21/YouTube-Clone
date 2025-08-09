const express = require('express');
const router = express.Router();
const multer = require('multer');
const { isLoggedIn, isMyProfile, isPostOwner } = require('../middleware/auth');
const db = require("../config/database");
const { makeThumbnail, getPostById, getCommentsByPostId, getLikesByPostId } = require('../middleware/post');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/videos/uploads')
  },
  filename: function (req, file, cb) {
    let fileExt = file.mimetype.split("/")[1]
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`)
  }
});

const uploader = multer({ storage: storage });

router.post('/create', isLoggedIn, uploader.single('videoUpload'), makeThumbnail, async function (req, res, next) {
  const user_id = req.session.user.user_id;
  const { title, description } = req.body;
  const { path, thumbnail } = req.file;

  if (!title || !description || !path) {
    req.flash("error", "Request must have title AND description AND video");
    return req.session.save((err) => {
      res.redirect("/post");
    });
  }

  try {
    const [resultObj, _] = await db.query(
      `INSERT INTO post (title, description, video, thumbnail, fk_user_id) VALUE (?,?,?,?,?)`,
      [title, description, path, thumbnail, user_id]
    );

    if (resultObj.affectedRows == 1) {
      req.flash("success", "Your post has been created");
      return req.session.save((err) => {
        if (err) next(err);
        res.redirect(`/posts/${resultObj.insertId}`);
      });
    } else {
      req.flash("error", "Your post could not be created");
      return req.session.save((err) => {
        if (err) next(err);
        return res.redirect('/post');
      });
    }
  } catch (err) {
    next(err);
  }
}
);

router.get("/:id(\\d+)", getPostById, getCommentsByPostId, getLikesByPostId, function (req, res, next) {
  res.render('view', {
    title: 'View Post',
    css: ['style.css'],
    post: res.locals.post,
    comments: res.locals.comments || [],
    likeCount: res.locals.likeCount || 0,
    userLiked: res.locals.userLiked || false,
    userPosts: res.locals.userPosts || []
  });
});

router.get("/search", async function (req, res, next) {
  try {
    const { s } = req.query;

    if (!s || s.trim() === "") {
      // If search is empty, just render with no results or maybe all posts
      res.locals.results = [];
      res.locals.resultsSize = 0;
      res.locals.searchValue = "";
      return res.render('index', { title: 'CSC 317 App', css: ['style.css'] });
    }

    const searchKey = `%${s}%`;

    const [rows] = await db.query(`
      SELECT post.post_id, post.title, post.thumbnail, post.created_at, user.username,
             CONCAT_WS(' ', post.title, post.description) AS haystack
      FROM post
      JOIN user ON post.fk_user_id = user.user_id
      WHERE CONCAT_WS(' ', post.title, post.description) LIKE ?
      ORDER BY post.created_at DESC
      LIMIT 50;
    `, [searchKey]);

    res.locals.results = rows;
    res.locals.resultsSize = rows.length;
    res.locals.searchValue = s;

    return res.render('index', { title: 'CSC 317 App', css: ['style.css'] });
  } catch (err) {
    next(err);
  }
});


router.delete('/:id(\\d+)', isLoggedIn, isPostOwner, async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    await db.query('DELETE FROM likes WHERE fk_post_id = ?', [postId]);
    await db.query('DELETE FROM comments WHERE fk_post_id = ?', [postId]);
    const [result] = await db.query('DELETE FROM post WHERE post_id = ?', [postId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    next(err);
  }
});



module.exports = router;