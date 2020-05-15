const express = require('express');
const router = express.Router();
const db = require('../config/dbconfig');
const {hashpassword,isPasswordCorrect, generateAuthToken } = require('../config/bycrptconfig');
const isUserLoggedIn = require('../config/checkauth');
router.post('/register', (req, res) => {
    //console.log(req);
    var pass =hashpassword(req.body.password);
    console.log(req.body.password);
    console.log(pass);
    let sql = "Insert into users values(null,'" + req.body.username + "','" + req.body.dob + "','" + pass + "',null,'" + req.body.email + "','" + req.body.phoneno + "','" + req.body.address + "')";
    let query = db.query(sql, (err, result) => {
        if (err)
            throw err;
        //console.log(result);
        res.redirect('/auth/login');
    });
});
router.get('/register', (req, res) => {
    res.render('register');
})
router.get('/login', (req, res) => {
    res.render('login');
});
router.post("/login", (req, res) => {
    console.log(req.body.password);
    let date = Date.now();
    let sql = "Select userId,password from users where username='" + req.body.username + "';";
    db.query(sql, (err, check) => {
        if (err)
            throw err;
        //console.log(check);
        var rows = JSON.parse(JSON.stringify(check[0]));
        //console.log(rows);
        console.log(rows.password);
        var re = isPasswordCorrect(req.body.password, rows.password);
        if (!re) {
            return res.redirect('/auth/login');
        }
        console.log(re);
        let userid = rows.userId.toString();
         console.log(rows.userId);
        var token = generateAuthToken(userid);
        console.log(token);
        let tokensql = `Update users set authtoken=? where userId=?`;
        let tokenquery = db.query(tokensql, [token, rows.userId], (err, data) => {
            if (err){
                console.log("error");
                throw err;
            }
            console.log(rows.userId);
            res.cookie("userId", token, {
                expire: date + 1000 * 60 * 60 * 24
            });
            res.redirect('/');
        })
    });
})
router.get('/logout', isUserLoggedIn, (req, res) => {
    let sql = `Update users set authtoken=NULL where userId="${req.user.authtoken}"`;
    let query = db.query(sql, (err, result) => {
        if (err)
            throw err;
        res.clearCookie("UserId");
        res.redirect("/auth/login");
    });
})

module.exports=router;