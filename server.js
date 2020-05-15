const express=require('express');
const cookieParser = require("cookie-parser");
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const setUserObject = require('./config/loginfunction');
//var ejs =require('ejs');
var app = express();
app.use(cookieParser());
app.use("/public",express.static('../../bookphotos'));
app.use("/public2", express.static(__dirname + "/Views/styles"));
app.use(express.json({
    limit: "50mb"
}));
app.use(
    express.urlencoded({
        extended: true,
        limit: "50mb",
        parameterLimit: 50000
    })
);
 app.set("view engine", "ejs");
 app.use(setUserObject);
 app.use('/',indexRoutes);
 app.use('/auth',authRoutes);
 app.use('/product',productRoutes);
app.listen(3000,(req,res)=>{
    console.log("Connection started at port 3000")});

