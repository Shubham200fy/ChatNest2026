const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model')
const uploadOnCloudinary = require('../config/cloudinary');
const { getReceiverSocketId, io } = require('../socket/socket');
 
const sendMessage = async(req, res) => {
    try {
        let sender = req.userId
        let {receiver} = req.params
        let {message} = req.body;
        let image;
        if(req.file) {
            image = await uploadOnCloudinary(req.file.path)
        }

        let conversation = await Conversation.findOne({
            participants:{$all:[sender, receiver]}
        })

        let newMessage = await Message.create({
            sender,receiver,message,image
        })    

        if(!conversation) {
            conversation = await Conversation.create({
                participants:[sender,receiver],
                messages:[newMessage._id]
            })
        } else {
            conversation.messages.push(newMessage._id)
            await conversation.save()
        }
        const receiverSocketId = getReceiverSocketId(receiver)
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }
        return res.status(201).json(newMessage)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const getMessages = async (req, res) => {
    try {
        let sender = req.userId
        let {receiver} = req.params
        let conversation = await Conversation.findOne({
            participants:{$all:[sender,receiver]}
        }).populate("messages")
        if(!conversation) {
            return res.status(400).json({message:"conversation not found"})
        }
        return res.status(200).json(conversation?.messages)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

module.exports = {
    sendMessage,
    getMessages
}