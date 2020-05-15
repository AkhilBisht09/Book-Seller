const express = require('express');
const router = express.Router();
var fs = require('fs');
const db = require('../config/dbconfig');
const isUserLoggedIn = require('../config/checkauth');

var multer = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'F:/bookphotos')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, file.fieldname + '-' + Date.now() + '.' + extension)
    }
});
var upload = multer({ storage: storage });
router.get('/sellbook', isUserLoggedIn, (req, res) => {
    res.render('sellbook', { req });
});
router.post('/profile', isUserLoggedIn, upload.single('avatar'), (req, res) => {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    console.log(req.cookies.userId);
    let sql = "Insert into product values(null,'" + req.body.name + "'," + req.body.price + ",'" + req.body.authorname + "','" + req.file.filename + "','" + req.user.userId + "','" + req.body.description + "')";
    let query = db.query(sql, (err, result) => {
        if (err)
            throw err;
        console.log(result);
        res.redirect('/');
    });
    console.log(req.body);
    console.log(req.file);
})
router.get('/:id', isUserLoggedIn, (req, res) => {
    var sql = `SELECT * FROM product WHERE prodId = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if (err)
            throw err;
        //console.log(result);
        var u = `Select * from users WHERE UserID=${result[0].seller}`;
        let q = db.query(u, (er, val) => {
            if (er)
                throw er;
            res.render('product', { prod: result[0], user: val[0], req });
        });

    });
});
router.get('/purchase/:id', isUserLoggedIn, (req, res) => {
    var sql = `SELECT * FROM product WHERE prodId = ${req.params.id};`;
    let query = db.query(sql, (err, result) => {
        if (err)
            throw err;
        //console.log(result);
        var q = `Insert into purchase values(${result[0].prodid},"${result[0].prod_name}",${result[0].cost},"${result[0].author}","${result[0].photo}",${result[0].seller},${req.user.userId});`;
        let w = db.query(q, (er, re) => {
            if (er)
                throw er;
            var d = `Delete from product Where prodId=${req.params.id};`;
            let r = db.query(d, (error, ans) => {
                if (error)
                    throw error;
                res.redirect('/');
            })
        })
    });
});
router.get('/deleteproduct/:id/:photo', isUserLoggedIn, (req, res) => {
    var sql = `Delete FROM product WHERE prodId = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if (err)
            throw err;
        //console.log(result);
        fs.unlink(`../../bookphotos/${req.params.photo}`, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            res.redirect('/');
        });

    });
});
module.exports=router;