module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        req.flash("error", "Unauthorized!.");
        return res.redirect('/login');
    }
    next();
}