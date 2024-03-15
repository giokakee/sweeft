/** @format */

const express = require('express');
const config = require('../config');
const bodyParser = require('body-parser');
const { loadSequelize } = require('./sequelize');
const { loadContext } = require('./context');
const { loadRoutes } = require('./router');
const { loadModels } = require('./models');
const { setCorrelationId, errorHandler } = require('../middlewares/logger');
const { loadPassport } = require('../middlewares/passport');

exports.loadApp = async () => {
	try {
		const app = express();

		app.use(express.json());
		app.use(express.urlencoded({ extended: true }));
		app.use(bodyParser.json());
		app.use(setCorrelationId);

		const sequelize = loadSequelize(config);

		await sequelize.authenticate();

		const context = await loadContext(sequelize, config.redis);
		process.stdout.write('\nConnected to Sequelize\n');

		loadModels(sequelize);
		loadPassport(app);
		loadRoutes(app, context);

		app.get('/', (req, res) => {
			res.send('Hello world');
		});

		app.use(errorHandler);

		app.use((req, res) => {
			res.status(404).json({ error: 'Not Found' });
		});

		return app;
	} catch (error) {
		console.log(error);

		process.exit(1);
	}
};
