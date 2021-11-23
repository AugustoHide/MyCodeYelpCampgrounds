
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //console.log(req.path, req.originalUrl);
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be sign in');
        return res.redirect('/login');
    }
    next();
}
module.exports = isLoggedIn;