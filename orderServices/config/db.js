const mongoose = require('mongoose');
const dotenv = require('dotenv');

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for Order Service');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;