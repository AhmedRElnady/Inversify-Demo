import * as jwt from "jsonwebtoken";


function generateToken(userId, tokenSecret, expiresIn) {
    return jwt.sign(
        {sub: userId, iat: new Date().getTime()}
        , tokenSecret, 
        {expiresIn: expiresIn}) 
}

function verifyToken(token, tokenSecret) {
    return new Promise((resolve, reject)=> {
        jwt.verify(token, tokenSecret, (err, decoded)=> {
            if(err) {
                reject({msg: 'Invalid Token'});
            }
            resolve(decoded);
        })
    })
}

export { generateToken, verifyToken }