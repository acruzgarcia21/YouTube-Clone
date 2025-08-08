const db = require('../config/database');

module.exports = {
  isLoggedIn: function (req, res, next) {
    if (req.session && req.session.user) {
      return next();
    }

    req.flash("error", "Must be logged in to view resource");
    req.session.save((err) => {
      if (err) return next(err);
      res.redirect('/');
    });
  },

  isMyProfile: function (req, res, next) {
    const profileId = Number(req.params.id); // From URL

    if (req.session?.user?.user_id === profileId) {
      return next();
    }

    req.flash("error", "You do not have permission to view this profile.");
    req.session.save((err) => {
      if (err) return next(err);
      return res.redirect('/');
    });
  },

  isPostOwner: async function (req, res, next) {
    try {
      const postId = Number(req.params.id);
      const userId = req.session.user.user_id;

      const [rows] = await db.query('SELECT fk_user_id FROM post WHERE post_id = ?', [postId]);

      if (rows.length === 0) {
        req.flash("error", "Post not found.");
        return req.session.save(err => {
          if (err) return next(err);
          return res.redirect('/');
        });
      }

      if (rows[0].fk_user_id !== userId) {
        req.flash("error", "You do not have permission to delete this post.");
        return req.session.save(err => {
          if (err) return next(err);
          return res.redirect('/');
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  }
};
