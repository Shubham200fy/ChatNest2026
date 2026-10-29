const mongoose = require('mongoose');

const connectDb = async () => {
    try {
       await mongoose.connect(process.env.MONGODB_URI);
       console.log('Mongodb connected successfully') 
    } catch (err) {
        console.log(err.message);
    }
}

module.exports = connectDb;