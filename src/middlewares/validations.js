/** @format */

const { body, param, validationResult } = require('express-validator');

exports.validateCompanyRegister = [
	body('email').isEmail().withMessage('Invalid email format'),
	body('companyName').isLength({ min: 3 }).withMessage('length should be more than 3'),
	body('country').isLength({ min: 3 }).withMessage('length should be more than 3'),
	body('industry').isString().isLength({ min: 3 }).withMessage('length should be more than 3'),
	body('password').isString().isLength({ min: 3 }).withMessage('length should be more than 3'),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			req.validationErrors = errors.array();
		}
		next();
	},
];

exports.validateCompanyLogin = [
	body('email').isEmail().withMessage('Invalid email format'),
	body('password').isString().isLength({ min: 3 }).withMessage('length should be more than 3'),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			req.validationErrors = errors.array();
		}
		next();
	},
];

exports.validateEmployeeRegister = [
	body('email').isEmail().withMessage('Invalid email format'),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			req.validationErrors = errors.array();
		}
		next();
	},
];

exports.validateEmployeeCompletion = [
	body('email').isEmail().withMessage('Invalid email format'),
	body('password').isString().isLength({ min: 3 }).withMessage('length should be more than 3'),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			req.validationErrors = errors.array();
		}
		next();
	},
];

exports.validateSubscription = [
	body('planName').isIn(['Free tier', 'Basic', 'Premium']).withMessage('Invalid planName value'),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			req.validationErrors = errors.array();
		}
		next();
	},
];

exports.validateId = [
	param('id').isInt().withMessage('ID must be a valid integer'),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			req.validationErrors = errors.array();
		}
		next();
	},
];
