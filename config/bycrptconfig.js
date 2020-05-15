const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const hashpassword = (pass) => {
    return bcrypt.hashSync(pass, 10);
}

const isPasswordCorrect = (pass, hashpass) => {
    return bcrypt.compareSync(pass, hashpass);
}

const generateAuthToken = (username) => {
    return bcrypt.hashSync(username, 10);
}
module.exports={
    hashpassword,
    isPasswordCorrect,
    generateAuthToken
}