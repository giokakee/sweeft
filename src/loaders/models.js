/** @format */

const { Company } = require('../models/company.model');
const { Employee } = require('../models/employee.model');
const { Subscription } = require('../models/subscription.model');
const { File } = require('../models/file.model');

exports.loadModels = sequelize => {
	const models = {
		company: Company,
		employee: Employee,
		subscription: Subscription,
		file: File,
	};

	Object.values(models).forEach(model => {
		model.defineSchema(sequelize);
	});

	Object.values(models).forEach(model => {
		model.associate(models, sequelize);
	});

	return models;
};
