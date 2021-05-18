module.exports.isALoggedIn = function(req,res,next){
    console.log(req.session.user_id)
    if(!req.session.user_id){
        req.session.returnto = req.originalUrl;
        req.flash('error', 'You must be signed in first')
        return res.redirect('/admin/login')
    }
    next();
}
module.exports.isVLoggedIn = function(req,res,next){
    console.log(req.session.user_id)
    if(!req.session.user_id){
        req.session.returnto = req.originalUrl;
        req.flash('error', 'You must be signed in first')
        return res.redirect('/vendor/login')
    }
    next();
}