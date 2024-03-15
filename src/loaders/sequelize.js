/** @format */

const { Sequelize } = require('sequelize');
const config = require('../config');

exports.loadSequelize = config => {
	return new Sequelize({
		dialect: 'mysql',
		...config.db,
	});
};
