/** @format */
require('dotenv').config();
const uuid = require('uuid');
const express = require('express');
const {
	validateCompanyLogin,
	validateCompanyRegister,
	validateId,
} = require('../middlewares/validations');
const { sendEmail } = require('../services/mail.sender');
const passport = require('passport');

const activationLink = process.env.ACTIVATION_LINK;

exports.makeAuthCompanyRouter = context => {
	const router = express.Router();
	const { authCompanyService } = context.services;

	router.post('/register', validateCompanyRegister, async (req, res, next) => {
		try {
			if (req.validationErrors) throw new Error('Validation errors');

			const activationToken = uuid.v4();
			const newCompany = await authCompanyService.registerCompany({
				...req.body,
				activationToken,
			});
			const { password, activationToken: hidingToken, ...rest } = newCompany.dataValues;

			await sendEmail(
				req.body.email,
				'Complete Your Registration',
				`${activationLink}/company/activate/${newCompany.dataValues.activationToken}`
			);
			res.status(201).json(rest);
		} catch (error) {
			if (req.validationErrors) return res.status(400).send('Fields are not valid');
			next(error);
		}
	});

	router.get('/activate/:activationToken', async (req, res, next) => {
		try {
			const companyIsActivated = await authCompanyService.activateCompany(
				req.params.activationToken
			);

			res.json(companyIsActivated);
		} catch (error) {
			next(error);
		}
	});

	router.post('/login', validateCompanyLogin, async function (req, res, next) {
		try {
			if (req.validationErrors) throw new Error('Validation errors');
			const token = await authCompanyService.loginCompany(req.body.email, req.body.password);

			res.status(200).json(token);
		} catch (error) {
			if (req.validationErrors) return res.status(400).send('Fields are not valid');

			next(error);
		}
	});

	router.delete(
		'/:id',
		validateId,
		passport.authenticate('jwt', { session: false }),
		async (req, res, next) => {
			try {
				if (req.validationErrors) throw new Error(req.validationErrors[0].msg);

				const employeeDeleted = await authCompanyService.deleteEmployee(
					req.user.companyId,
					req.params.id
				);
				res.json({ message: employeeDeleted });
			} catch (error) {
				next(error);
			}
		}
	);

	return router;
};
