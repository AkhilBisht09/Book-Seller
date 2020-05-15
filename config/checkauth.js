db=require('./dbconfig');
const isUserLoggedIn = (req, res, next) => {
    if (!req.cookies.userId) {
        console.log("HI");
        return res.redirect('/login');
    }
    const searchUser = `SELECT * FROM users WHERE authToken = "${req.cookies.userId}"`;
    db.query(searchUser, (err, result) => {
        if (err)
            throw err;
        if (result.length === 0) {
            console.log("I don't know");
            return res.redirect('/login');
        }
        //console.log(result[0]);
        req.user = result[0];
        next();
    });
}
module.exports=isUserLoggedIn;