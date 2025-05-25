const Admin = require('../Models/Admin');
const Book = require('../Models/Book');
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const admin = await Admin.create({ email, password: hashedPassword });
        res.status(201).json({
            success: true,
            message: 'Admin created',
            admin
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email }).select('+password');
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }
        // const isMatch = await admin.matchPassword(password);
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        // Generate JWT token
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'fallbacksecretkey', {
            expiresIn: process.env.JWT_EXPIRE || '30d'
        });
        
        // Send single response with token
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            admin
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}


const createBook = async (req, res) => {
    try {
        const { title, author, price, description, category, inStock, ratings } = req.body;
        const book = await Book.create({ title, author, price, description, category, inStock, ratings });
        res.status(201).json({
            success: true,
            message: 'Book created',
            book
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Book updated',
            book
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Book deleted'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json({
            success: true,
            message: 'Books found',
            books
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            message: 'Users found',
            users
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'User deleted'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'User updated',
            user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const addContact = async (req, res) => {
    try {
        const { name, phoneNumber } = req.body;
        
        if (!name || !phoneNumber) {
            return res.status(400).json({
                success: false,
                message: 'Name and phone number are required'
            });
        }
        
        // Validate phone number format (11 digits)
        if (!/^\d{11}$/.test(phoneNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Phone number must be exactly 11 digits'
            });
        }
        
        // Find the admin (assuming there's only one admin or using the first one)
        const admin = await Admin.findOne();
        
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }
        
        // Check if phone number already exists
        const existingContact = admin.contacts.find(contact => 
            contact.phoneNumber === phoneNumber
        );
        
        if (existingContact) {
            return res.status(400).json({
                success: false,
                message: 'Phone number already registered'
            });
        }
        
        // Add new contact
        admin.contacts.push({ name, phoneNumber });
        await admin.save();
        
        res.status(201).json({
            success: true,
            message: 'Contact added successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    registerAdmin,
    loginAdmin,
    createBook,
    updateBook,
    deleteBook,
    getAllBooks,
    getAllUsers,
    deleteUser,
    updateUser,
    addContact
}
