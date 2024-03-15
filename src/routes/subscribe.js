/** @format */
require('dotenv').config();
const uuid = require('uuid');
const express = require('express');
const { sendEmail } = require('../services/mail.sender');
const path = require('path');
const passport = require('passport');
const {
	validateEmployeeCompletion,
	validateEmployeeRegister,
	validateSubscription,
} = require('../middlewares/validations');

const activationLink = process.env.ACTIVATION_LINK;

exports.makeSubscriptionRouter = context => {
	const router = express.Router();
	const { subscriptionService } = context.services;

	router.post(
		'/changePlan',
		passport.authenticate('jwt', { session: false }),
		validateSubscription,
		async (req, res, next) => {
			try {
				console.log(req.validationErrors);

				if (req.validationErrors) throw new Error(req.validationErrors[0].msg);

				const subscribe = await subscriptionService.changePlan(
					req.user.companyId,
					req.body.planName
				);
				res.json(subscribe);
			} catch (error) {
				next(error);
			}
		}
	);

	return router;
};
