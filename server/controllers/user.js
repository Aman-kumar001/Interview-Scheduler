const User = require('../models/user_model');

exports.getAllUsers = (req, res) => {
	User.find()
		.then((user) => res.json(user))
		.catch((err) =>
			res.status(404).json({ message: 'User not found', error: err.message })
		);
};
