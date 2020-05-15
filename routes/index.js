const express = require('express');
const router = express.Router();

const db = require('../config/dbconfig');
const { isPasswordCorrect, hashPassword, generateAuthToken } = require('../config/bycrptconfig');
const isUserLoggedIn = require('../config/checkauth');

router.get('/dashboard', isUserLoggedIn, (req, res) => {

    res.render('dashboard', { req });

});
router.get('/', (req, res) => {
    let sql = "Select * from product";
    let query = db.query(sql, (err, check) => {
        if (err)
            throw err;
        //var rows = JSON.parse(JSON.stringify(check));
        console.log(req.user);
        return res.render('home', { rows: check, req });
    });

});

router.get('/delete', isUserLoggedIn, (req, res) => {
    let sql = `delete from users where userId=${req.user.userId}`;
    let query = db.query(sql, (err, result) => {
        if (err)
            throw err;
        console.log(result);
        res.redirect('/auth/login');
    });
});
router.get('/products', isUserLoggedIn, (req, res) => {
    let sql = "Select * from product where seller='" + req.user.userId + "';";
    let query = db.query(sql, (err, result) => {
        if (err)
            throw err;
        //console.log(result);
        let s = `Select * from purchase where seller=${req.user.userId};`;
        let q = db.query(s, (er, ans) => {
            if (er)
                throw er;
            res.render('products', { result, ans, req });
        })

    });
})
router.get('/orders', isUserLoggedIn, (req, res) => {
    let sql = "Select * from purchase where buyer='" + req.user.userId + "';";
    let query = db.query(sql, (err, result) => {
        if (err)
            throw err;
        //console.log(result);
        res.render('orders', { result, req });
    });
})
module.exports=router;