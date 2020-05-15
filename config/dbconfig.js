const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'mydb'
});
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Mysql Connected');
})
module.exports=db;