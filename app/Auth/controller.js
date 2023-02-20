const path = require('path');
const fs = require('fs');
const config = require('../../config/config');

const User = require('../User/model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
	signUp: async (req, res, next) => {
		try {
			const { password, confPassword } = req.body;
			const payload = req.body;

			if (password !== confPassword)
				return res.status(400).json({
					msg: 'Sign up failure',
					fields: {
						password: { msg: 'Password not match' },
						confPassword: { msg: 'Password not match' },
					},
				});
			const salt = await bcrypt.genSalt();
			const hashPassword = await bcrypt.hash(password, salt);

			if (req.file) {
				let filepath = req.file.path;
				let filename = `${new Date().getTime()}-${req.file.originalname}`;
				let target_path = path.resolve(config.rootPath, `public/images/user/${filename}`);

				const src = fs.createReadStream(filepath);
				const dest = fs.createWriteStream(target_path);

				src.pipe(dest);

				src.on('end', async () => {
					try {
						const user = new User({ ...payload, password: hashPassword, foto: filename });
						await user.save();
						user.password = undefined;

						res.status(201).json({ msg: 'Sign Up Success', data: user });
					} catch (err) {
						// if (err && err.name === 'ValidationError') {
						// 	return res.status(422).json({
						// 		error: true,
						// 		message: err.message,
						// 		fields: err.errors,
						// 	});
						// }
						next(err);
					}
				});
			} else {
				try {
					let user = new User({ ...payload, password: hashPassword, foto: 'default.jpg' });
					await user.save();
					user.password = undefined;
					res.status(201).json({ msg: 'Sign Up Success', data: user });
				} catch (err) {
					// if (err && err.name === 'ValidationError') {
					// 	return res.status(422).json({
					// 		error: true,
					// 		message: err.message,
					// 		fields: err.errors,
					// 	});
					// }
					next(err);
				}
			}
		} catch (err) {
			next(err);
		}
	},

	signIn: async (req, res, next) => {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({ where: { email } });
			if (!user)
				return res.status(401).json({ msg: 'Sign in failure', fields: { email: { msg: 'Email is not registered' } } });
			const match = await bcrypt.compare(password, user.password);
			if (!match)
				return res.status(401).json({ msg: 'Sign in failure', fields: { password: { msg: 'Wrong Password' } } });

			const { id, name, role, foto } = user;
			const userId = id;
			const mEmail = user.email;

			const accessToken = jwt.sign({ user: { userId, name, email: mEmail, role, foto } }, config.accessTokenSecret, {
				expiresIn: '20s',
			});
			const refreshToken = jwt.sign({ user: { userId, name, email: mEmail, role, foto } }, config.refreshTokenSecret, {
				expiresIn: '1d',
			});
			await User.update(
				{ refreshToken: refreshToken },
				{
					where: {
						id: userId,
					},
				}
			);
			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				maxAge: 24 * 60 * 60 * 1000,
			});
			res.json({ accessToken });
		} catch (error) {
			res.status(404).json({ msg: 'Error ', error });
		}
	},

	signOut: async (req, res, next) => {
		try {
			const refreshToken = req.cookies.refreshToken;
			if (!refreshToken) return res.sendStatus(204);
			const user = await User.findOne({
				where: {
					refreshToken: refreshToken,
				},
			});
			if (!user) return res.sendStatus(204);
			const userId = user.id;
			await User.update(
				{ refreshToken: null },
				{
					where: {
						id: userId,
					},
				}
			);
			res.clearCookie('refreshToken');
			return res.sendStatus(200);
		} catch (err) {
			next(err);
		}
	},

	refreshToken: async (req, res, next) => {
		try {
			const refreshToken = req.cookies.refreshToken;
			if (!refreshToken)
				return res.status(401).json({
					msg: 'Unauthorized',
				});
			const user = await User.findOne({
				where: {
					refreshToken,
				},
			});
			if (!user)
				return res.status(403).json({
					msg: 'Forbidden',
				});
			jwt.verify(refreshToken, config.refreshTokenSecret, (err, decoded) => {
				if (err)
					return res.status(403).json({
						msg: 'Forbidden',
					});
				const userId = user.id;
				const name = user.name;
				const email = user.email;
				const accessToken = jwt.sign({ userId, name, email }, config.accessTokenSecret, {
					expiresIn: '15s',
				});
				res.json({ accessToken });
			});
		} catch (err) {
			next(err);
		}
	},
};
