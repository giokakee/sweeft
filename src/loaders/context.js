/** @format */

const AuthCompanyService = require('../services/auth.company.service');
const AuthEmployeeService = require('../services/auth.employee.service');
const SubscriptionService = require('../services/subscription.service');

exports.loadContext = async (sequelize, redisConfig) => ({
	services: {
		authCompanyService: new AuthCompanyService(sequelize),
		authEmployeeService: new AuthEmployeeService(sequelize),
		subscriptionService: new SubscriptionService(sequelize),
	},
});
