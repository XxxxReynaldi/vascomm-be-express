const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

module.exports = {
	appName: process.env.APP_NAME,
	rootPath: path.resolve(__dirname, '..'),
	jwtKey: process.env.SECRET,
	accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
	refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
	development: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE_DEVELOPMENT,
		host: process.env.DB_HOST,
		dialect: process.env.DB_DIALECT,
	},
	test: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE_TEST,
		host: process.env.DB_HOST,
		dialect: process.env.DB_DIALECT,
	},
	production: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE_PRODUCTION,
		host: process.env.DB_HOST,
		dialect: process.env.DB_DIALECT,
	},
};
