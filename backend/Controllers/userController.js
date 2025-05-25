const User = require('../Models/User');
const Book = require('../Models/Book');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({
            success: true,
            message: 'User created',
            user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // const isMatch = await user.matchPassword(password);
        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const addToCart = async (req, res) => {
    try {
        const { bookId } = req.body;
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        const user = await User.findById(req.user._id);
        user.cart.push(book);
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Book added to cart',
            user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const removeFromCart = async (req, res) => {
    try {
        const { bookId } = req.body;
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        const user = await User.findById(req.user._id);
        user.cart.pull(book);
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Book removed from cart',
            user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const addToWishlist = async (req, res) => {
    try {
        const { bookId } = req.body;
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        const user = await User.findById(req.user._id);
        user.wishlist.push(book);
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Book added to wishlist',
            user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const removeFromWishlist = async (req, res) => {
    try {
        const { bookId } = req.body;
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        const user = await User.findById(req.user._id);
        user.wishlist.pull(book);
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Book removed from wishlist',
            user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const buyBook = async (req, res) => {
    try {
        const { bookId } = req.body;
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        const user = await User.findById(req.user._id);
        user.booksBought.push(book);
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Book bought',
            user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

// the otp is gona be sent to the user in MONGODB

// const forgotPassword = async (req, res) => {
//     try {
//         const { email } = req.body;
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'User not found'
//             });
//         }

//         // Generate a 6-digit OTP
//         const otp = Math.floor(100000 + Math.random() * 900000).toString();

//         // Store OTP in user document with expiry (15 minutes)
//         user.resetPasswordOtp = otp;
//         user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
//         await user.save();

//         // In a real application, you would send an email with the OTP
//         // For now, we'll just return it in the response (for testing)
//         res.status(200).json({
//             success: true,
//             message: 'Password reset OTP sent to your email',
//             otp // Remove this in production
//         });
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: error.message
//         });
//     }
// }

// The OTP is sent to user in his email
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP in user document with expiry (15 minutes)
        user.resetPasswordOtp = otp;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        // Send email with OTP
        const nodemailer = require('nodemailer');

        // Create a transporter using Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}. This OTP will expire in 15 minutes.`
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'Password reset OTP sent to your email'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const verifyOtpAndResetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({
            email,
            resetPasswordOtp: otp,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear reset fields
        user.password = hashedPassword;
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart');
        res.status(200).json({
            success: true,
            message: 'Cart fetched successfully',
            cart: user.cart
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');
        res.status(200).json({
            success: true,
            message: 'Wishlist fetched successfully',
            wishlist: user.wishlist
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    registerUser,
    loginUser,
    addToCart,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
    buyBook,
    forgotPassword,
    verifyOtpAndResetPassword,
    getCart,
    getWishlist
}
