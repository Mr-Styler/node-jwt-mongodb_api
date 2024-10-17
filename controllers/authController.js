const User = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const AppError = require('../utils/appError');
const catchAsyncHandler = require('../utils/catchAsyncHandler');
dotenv.config();

exports.register = catchAsyncHandler(async (req, res, next) => {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError('Username already exists', 400));
    }

    const user = await User.create({ username, email, password, role });
    res.status(201).json({message: 'User registered successfully'});
});

exports.login = catchAsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    console.log(req.body)

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    const isMatch = await user.matchPassword(password, user.password)

    console.log(isMatch)

    if (!isMatch) {
        return next(new AppError('Invalid credentials', 400));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    // Set the JWT in a cookie
    res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); // Use secure cookies in production
    res.json({ status: "success", token, message: "login successful", data: {document: user} });
});

exports.forgotPassword = catchAsyncHandler(async (req, res, next) => {
    const { email } = req.body
    // 1. find user using email
    const user = await User.findOne({email});

    if (!user) return next(new AppError(`No user found with this ID`, 404))

    // 2. generate reset-token
    const token = await user.generateResetToken();
    await user.save({validateBeforeSave: false});

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/reset/${token}`;

    return res.status(200).json({
        status: 'success',
        message: `Link has been sent to your email. Url: ${resetUrl}`
    })
});

exports.resetPassword = catchAsyncHandler(async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // 1. verify if user token is valid3
    const user = await User.findOne({resetToken: hashedToken, resetExpires: {$gt: Date.now() }})

    if (!user) return next(new AppError('Token is either invalid or expired'));

    // 2. set new password to user
    user.password = password;
    user.resetToken = undefined, user.resetExpires = undefined;
    await user.save();

    res.status(200).json({
        status: 'success',
        message: `password successfully resetted`
    })
})

exports.updatePassword = catchAsyncHandler(async (req, res, next) => {
    const { currentPassword, confirmPassword, password } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if(!user && !(await user.matchPassword(currentPassword, user.password))) {
        return next(new AppError(`passwords do not match`))
    }

    user.password = password;
    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'You have successfully changed your password'
    })
})

exports.logout = (req, res) => {
    res.clearCookie('jwt'); // This clears the session
    res.status(200).json({ message: 'Logged out successfully' });
};

