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
  }

};

