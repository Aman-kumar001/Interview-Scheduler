const express = require('express');
const router = express.Router();

const { getAllUsers } = require('../controllers/user');

/**
 * @route GET api/getAllUsers
 * @description fetch all the available users
 * @access public
 */
router.get('/', getAllUsers);

module.exports = router;
