const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const createSendToken = (user,statusCode,res)=>{
  const token = signToken(user._id);
const cookieOptions =  {
  expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
  httpOnly: true
};

if(process.env.NODE_ENV === 'production') {
  cookieOptions.secure = true
}
  res.cookie('jwt',token, cookieOptions);
  user.password = undefined
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    },
  });
}

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser,201,res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please Provide Email and Password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email Or Password', 401));
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
  
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in!, please login to get access', 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(new AppError('The User does no longer exist', 401));
  }

  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently chnaged password, please login again', 401)
    );
  }

  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetpassword/${resetToken}`;

  const message = `Forgot your password? Submit a patch request with your new password and passwordConform to: ${resetUrl}.\n If you didn't forget your password , please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token(valid for 10 mins)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (e) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Please try again',500))
  }
});

exports.resetPassword =  catchAsync(async (req, res, next) => {

  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: {
    $gt: Date.now()
  }  })
  
  if(!user){
  return  next(new AppError("Token is invalid or expired",400))
  }
  
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined

  await user.save();

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
