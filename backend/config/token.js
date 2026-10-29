const jwt = require('jsonwebtoken')
const genToken = async (userId) => {
    try {
        const token = await jwt.sign({userId},process.env.JWT_SECRET, {expiresIn:"7d"})
        
        return token;
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = genToken;