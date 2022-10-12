const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
	participants: {
		type: [
			{
				type: 'Object',
				required: true,
			},
		],
		required: true,
	},
	date: {
		type: 'String',
		required: true,
	},
	start_time: {
		type: 'String',
		required: true,
	},
	end_time: {
		type: 'String',
		required: true,
	},
});

const Interview = mongoose.model('interview', InterviewSchema);

module.exports = Interview;
