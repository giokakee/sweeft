/** @format */
/** @format */

const { Umzug, SequelizeStorage } = require('umzug');

const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize({
	dialect: 'mysql',
	...config.db,
});

const migrator = new Umzug({
	migrations: {
		glob: ['./migrations/*.js', { cwd: __dirname }],
	},
	context: sequelize,
	storage: new SequelizeStorage({
		sequelize,
	}),
	logger: console,
});

module.exports = migrator;
