/** @format */

const dotenv = require('dotenv');
const pino = require('pino');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const logger = pino({
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
		},
	},
});

const errorHandler = (err, req, res, _next) => {
	logger.error({ requestId: req.id, error: err }, 'Error occurred in the request.');

	let statusCode = err.status || 500;

	let errorMessage = (err.message ? err.message : err) || 'Internal Server Error';

	res.status(statusCode).send(errorMessage);
};

const setCorrelationId = (req, res, next) => {
	req.id = req.id || uuidv4();
	req.logger = logger;
	logger.info({ requestId: req.requestId }, `Request received: ${req.method} ${req.url}`);

	next();
};

module.exports = { logger, errorHandler, setCorrelationId };
