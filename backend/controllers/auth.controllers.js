const genToken = require('../config/token');
const User = require('../models/user.model')
const bcrypt = require('bcryptjs');
const signUp = async(req, res) => {
    try {
        console.log(req.body)
        const { userName, email, password } = req.body;
        const checkUserByUserName = await User.findOne({ userName });
        if(checkUserByUserName) {
            return res.status(400).json({ message: 'userName is already exists'});
        }
        const checkUserByEmail = await User.findOne({email});
        if(checkUserByEmail) {
            return res.status(400).json({ message: 'email already exist'});
        }

        if(password.length < 6) {
            return res.status(400).json({ message: 'password must be at least 6 characters'});
        }
        const hashedPassword = await bcrypt.hash(password,10)

        const user = await User.create({ userName, email, password:hashedPassword});
        const token = await genToken(user._id);
        res.cookie('token',token,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"lax",
            secure:false
        })
        return res.status(201).json({user})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const login = async(req, res) => {
    try {
        console.log(req.body)
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if(!user) {
            return res.status(400).json({ message: "user does not exist"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: 'incorrect password'})
        }
        const token = await genToken(user._id);
        res.cookie('token',token,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"lax",
            secure:false
        })
        return res.status(201).json({user})
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

 const logOut = async(req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ message: 'user logout successfully'})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = {
    signUp,
    login,
    logOut
}