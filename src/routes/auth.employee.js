/** @format */
require('dotenv').config();
const fs = require('fs');
const uuid = require('uuid');
const express = require('express');
const { sendEmail } = require('../services/mail.sender');
const passport = require('passport');
const {
	validateEmployeeCompletion,
	validateEmployeeRegister,
} = require('../middlewares/validations');
const { upload } = require('../middlewares/upload-middlewares');
const path = require('path');

const activationLink = process.env.ACTIVATION_LINK;

exports.makeAuthEmployeeRouter = context => {
	const router = express.Router();
	const { authEmployeeService } = context.services;

	router.get('/all', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
		try {
			const employees = await authEmployeeService.getAll(req.user.companyId);
			res.json(employees);
		} catch (error) {
			next(error);
		}
	});

	router.post(
		'/register',
		validateEmployeeRegister,
		passport.authenticate('jwt', { session: false }),
		async (req, res, next) => {
			try {
				if (req.validationErrors) throw new Error('Validation errors');

				const activationToken = uuid.v4();
				const newEmployee = await authEmployeeService.registerEmployee({
					...req.body,
					companyId: req.user.companyId,
					activationToken,
				});
				const { activationToken: hidingToken, ...rest } = newEmployee.dataValues;

				await sendEmail(
					req.body.email,
					'Complete Your Registration',
					`${activationLink}/employee/activate/${newEmployee.dataValues.activationToken}`
				);
				res.status(201).json(rest);
			} catch (error) {
				if (req.validationErrors) return res.status(400).send('Fields are not valid');
				next(error);
			}
		}
	);

	router.get('/activate/:activationToken', async (req, res, next) => {
		try {
			const employeeIsActivated = await authEmployeeService.activateEmployee(
				req.params.activationToken
			);

			res.json(employeeIsActivated);
		} catch (error) {
			next(error);
		}
	});

	router.post('/register/complete', validateEmployeeCompletion, async (req, res, next) => {
		try {
			const registrationCompleted = await authEmployeeService.completeRegistration(req.body);

			res.json(registrationCompleted);
		} catch (error) {
			next(error);
		}
	});

	router.post('/login', async function (req, res, next) {
		try {
			if (req.validationErrors) throw new Error('Validation errors');
			const token = await authEmployeeService.loginEmployee(req.body.email, req.body.password);

			res.status(200).json(token);
		} catch (error) {
			if (req.validationErrors) return res.status(400).send('Fields are not valid');

			next(error);
		}
	});

	router.post(
		'/file',
		passport.authenticate('jwt', { session: false }),
		upload.single('file'),
		async (req, res, next) => {
			try {
				if (!req.file) throw new Error('File is not selected');
				const { companyId, employeeId } = req.user;

				const uploadFile = await authEmployeeService.uploadFile(
					companyId,
					employeeId,
					req.file.filename
				);

				res.json(uploadFile);
			} catch (error) {
				if (req.file) {
					fs.unlink(req.file.path, unlinkErr => {
						if (unlinkErr) {
							console.error('Error deleting file:', unlinkErr);
						}
					});
				}
				next(error);
			}
		}
	);

	router.delete(
		'/file/:id',
		passport.authenticate('jwt', { session: false }),
		async (req, res, next) => {
			try {
				const { companyId, employeeId } = req.user;

				const fileName = await authEmployeeService.getFile(
					companyId,
					employeeId,
					req.params.id
				);

				const fileDeleted = await authEmployeeService.deleteFile(
					companyId,
					employeeId,
					req.params.id
				);
				const filePath = path.join(__dirname, `../../public/${fileName}`);

				fs.unlink(filePath, err => {
					if (err) {
						console.error('Error deleting file:', err);
						return;
					}
					console.log('File deleted successfully');
				});

				res.json(fileDeleted);
			} catch (error) {
				next(error);
			}
		}
	);

	return router;
};
