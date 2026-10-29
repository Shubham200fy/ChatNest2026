const jwt = require('jsonwebtoken')
const isAuth = async (req, res, next) => {
    try {
        let token = req.cookies.token;
        if(!token) {
            return res.status(400).json({message: 'token is not found'})
        }
        let verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verifyToken.userId
        next()
    } catch (err) {
        return res.status(500).json({ message: err.messasge })
    }
}

module.exports = isAuth;