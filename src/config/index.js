/** @format */

const { Umzug, SequelizeStorage } = require('umzug');

const config = {
	db: {
		host: 'localhost',
		port: 3306,
		username: 'dev',
		password: 'dev',
		database: 'sweeft_project',
		logging: false,
	},
	redis: {
		host: 'localhost',
		port: 6379,
	},
	auth: {
		secret: 'some-dev-secret',
	},
};

module.exports = config;
