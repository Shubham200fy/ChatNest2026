const uploadOnCloudinary = require('../config/cloudinary');
const User = require('../models/user.model')
const getCurrentUser = async(req, res) => {
    try {
        let userId = req.userId;
        let user = await User.findById(userId).select("-password");
        if(!user) {
            return res.status(400).json({ message: 'user not found'})
        }
        return res.status(200).json({ user })
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const editProfile = async(req, res) => {
    try {
        console.log("userbody",req.body);
        console.log("file",req.file)
        let {name} = req.body;
        let image;
        if(req.file) {
            image = await uploadOnCloudinary(req.file.path)
        }
        let user = await User.findByIdAndUpdate(req.userId, { name, image },{new:true})

        if(!user) {
            return res.status(400).json({message: "user not found"})
        }
        return res.status(200).json({ user })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getOtherUsers = async(req, res) => {
    try {
        let users = await User.find({ _id:{$ne:req.userId}}).select("-password")
        return res.status(200).json(users)
    } catch (err) {
        return res.status(500).json({ message:err.message })
    }
}

const search = async(req, res) => {
    try {
        let {query} = req.query;
        if(!query) {
            return res.status(400).json({message:'query is required'})
        }
        let users = await User.find({
            $or:[
                {name:{$regex:query,$options:"i"}},
                {userName:{$regex:query,$options:"i"}}    
            ]
        })
        return res.status(200).json(users)
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
}

module.exports = {
    getCurrentUser,
    editProfile,
    getOtherUsers,
    search
}