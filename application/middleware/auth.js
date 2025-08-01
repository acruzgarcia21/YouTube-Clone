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
    const user_id = req.params.id;
    if (req.session && req.session.user && req.session.user.user_id === user_id) {
      next();
    } else {
      req.flash("error", "You do not have permission to access this profile!");
      req.session.save((err) => {
        if (err) return next(err);
        res.redirect('/');
      })
    }
  }
};
