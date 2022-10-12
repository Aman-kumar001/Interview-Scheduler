const express = require('express');
const router = express.Router();

const {
	getAllInterview,
	createInterview,
	updateInterview,
	deleteInterview,
	getInterviewByEmail,
} = require('../controllers/interview');

/**
 * @route GET api/getAllInterview
 * @description fetch all the upcoming interview
 * @access public
 */
router.get('/', getAllInterview);

/**
 * @route GET api/getInterviewByEmail
 * @description fetch all the upcoming interview
 * @access public
 */
router.get('/validateSlots', getInterviewByEmail);

/**
 * @route post api/createInterview
 * @description create a new interview
 * @access public
 */
router.post('/', createInterview);

/**
 * @route GET api/updateInterview
 * @description UPdate an existing interview
 * @access public
 */
router.put('/:id', updateInterview);

/**
 * @route GET api/deleteInterview
 * @description Delete the upcoming interview
 * @access public
 */
router.delete('/:id', deleteInterview);

module.exports = router;
