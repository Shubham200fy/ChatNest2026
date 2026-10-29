const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String },
    userName: { type: String, required: true, unique:true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default:'' }
}, 
{
    timestamps:true
}
)

module.exports = mongoose.model('User', userSchema)