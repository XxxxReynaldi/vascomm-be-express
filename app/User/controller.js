const path = require('path');
const fs = require('fs');
const config = require('../../config/config');

const User = require('./model');

module.exports = {
	getUsers: async (req, res, next) => {
		try {
			const users = await User.findAll({
				attributes: ['id', 'name', 'email'],
			});

			res.status(200).json({ msg: 'User Updated', users });
		} catch (err) {
			next(err);
		}
	},

	approve: async (req, res, next) => {
		try {
			const { id } = req.params;

			await User.update({ status: 'active' }, { where: { id } });
			const user = await User.findOne({ attributes: ['id', 'name', 'email', 'status'], where: { id } });

			res.status(200).json({ msg: 'User Updated', user });
		} catch (err) {
			next(err);
		}
	},

	destroy: async (req, res, next) => {
		try {
			const { id } = req.params;

			const user = await User.findOne({ attributes: ['id', 'name', 'email', 'status'], where: { id } });
			await User.destroy({ where: { id } });

			res.status(200).json({ msg: 'User Deleted', user });
		} catch (err) {
			next(err);
		}
	},
};
