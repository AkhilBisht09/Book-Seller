db = require('./dbconfig');
const setUserObject = (req, res, next) => {
    const searchUser = `SELECT * FROM users WHERE authToken = "${req.cookies.userId}"`;
    let query = db.query(searchUser, (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            req.user = undefined;
        } else {
            req.user = result[0];
        }
        next();
    });
}
module.exports=setUserObject;