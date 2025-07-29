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
  }
};
