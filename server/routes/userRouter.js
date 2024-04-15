const express = require('express');
const { getAllUsers } = require('../controllers/userController');
const router = express.Router(); 

router.route('/getAllUsers').get(getAllUsers);

module.exports= router;