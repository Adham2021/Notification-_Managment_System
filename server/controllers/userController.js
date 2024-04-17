const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/User");
const User1= require("../models/FollowedUsers");

// get all users to search=> /api/v1/getAllUsers
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    try {
      const users = await User.find(); // Assuming the "users" collection has a "username" field
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });


  exports.followUser = catchAsyncErrors(async (req, res, next) => {
    try {
      //let followedUsers = [];
      const { userId } = req.body;
      const followedUsers = await User1.findOne({ followedUsers: userId });
      if (!followedUsers) 
      { followedUsers.push(userId);
        await User1.save();
       res.json({ message: "User followed successfully" });
       
      } else {
        res.status(400).json({ message: "User is already followed" });
      }
    } catch (error) {
      // Handle any errors
      next(error);
    }
  });