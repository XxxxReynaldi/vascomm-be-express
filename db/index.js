const Sequelize = require('sequelize');

const { host, username, password, database, dialect } = require('../config/index');

// create the test connection to database
const db = new Sequelize(database, username, password, {
	host: host,
	dialect: dialect,
});

db.authenticate()
	.then(() => {
		console.log('Connected to the MySQL server');
	})
	.catch((error) => {
		console.error('Unable to connect to the database: ', error);
	});

module.exports = db;
