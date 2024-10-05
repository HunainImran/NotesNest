const jwt = require('jsonwebtoken')
function authenticateToken(req, res, next){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.TOKEN, (error, user) =>  {
        if(error){
                return res.sendStatus(401);
        }
        req.user = user;
        next(); 

    })
}

module.exports = {
    authenticateToken,
};