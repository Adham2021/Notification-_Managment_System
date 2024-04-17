const express = require('express');
const { getAllUsers,followUser } = require('../controllers/userController');
const router = express.Router(); 

router.route('/getAllUsers').get(getAllUsers);
router.route('/followUser').post(followUser);
module.exports= router;