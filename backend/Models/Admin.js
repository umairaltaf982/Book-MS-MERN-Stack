const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    password:{
        type: String,
        require: true,
        minlength: 8,
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character']
    },
    contacts: [{
        name: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true,
            match: [/^\d{11}$/, 'Phone number must be exactly 11 digits']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Admin', AdminSchema);