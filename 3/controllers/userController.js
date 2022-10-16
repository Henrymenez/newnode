const User = require("../models/userModel")
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");


exports.getAllUsers = catchAsync(async(req, res,next) => {
    const users = await User.find();
    if(!users) return next(new AppError("No users found",404));
    res.status(500).json({
        status: 'success',
        message: 'All users',
        data: {
            users
        }
    })
    })
    
    exports.getUser = (req, res) => {

        res.status(500).json({
            status: 'error',
            message: 'route not yet defined'
        })
        }
        exports.createUser = (req, res) => {
            res.status(500).json({
                status: 'error',
                message: 'route not yet defined'
            })
            }
            exports.updateUser = (req, res) => {
                res.status(500).json({
                    status: 'error',
                    message: 'route not yet defined'
                })
                }
                exports.deleteUser = (req, res) => {
                    res.status(500).json({
                        status: 'error',
                        message: 'route not yet defined'
                    })
                    }
