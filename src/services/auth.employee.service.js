/** @format */

const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const { SECRET_TOKEN } = process.env;

class AuthEmployeeService {
	constructor(sequelize) {
		this.client = sequelize;
		this.models = this.client.models;
	}

	async getAll(companyId) {
		return new Promise(async (resolve, reject) => {
			try {
				console.log(companyId);

				const employees = await this.models.Employee.findAll({
					where: { companyId: 1 },
					attributes: ['id', 'email', 'activated', 'completed'],
				});

				resolve(employees);
			} catch (error) {
				reject(error);
			}
		});
	}

	async registerEmployee(employee) {
		return new Promise(async (resolve, reject) => {
			try {
				const newEmployee = await this.models.Employee.create(employee);

				resolve(newEmployee);
			} catch (error) {
				reject(error);
			}
		});
	}

	async activateEmployee(activationToken) {
		return new Promise(async (resolve, reject) => {
			try {
				const employee = await this.models.Employee.findOne({
					where: { activationToken },
				});

				if (!employee) {
					const error = new Error('Not authorized!');
					error.status = 404;
					throw error;
				}

				if (!employee) {
					const error = new Error('Employee not found');
					error.status = 404;
					throw error;
				}

				if (employee.activated) {
					const error = new Error('Employee is already activated');
					error.status = 400;
					throw error;
				}

				employee.activated = true;
				await employee.save();

				resolve(employee);
			} catch (error) {
				reject(error);
			}
		});
	}

	async completeRegistration({ email, password }) {
		const COST = 12;
		const hashedPassword = await bcrypt.hash(password, COST);
		return new Promise(async (resolve, reject) => {
			try {
				const employee = await this.models.Employee.findOne({
					where: { email },
				});

				if (!employee) {
					const error = new Error('Not authorized!');
					error.status = 404;
					throw error;
				}

				if (employee.completed) {
					const error = new Error('Registration is already completed');
					error.status = 404;
					throw error;
				}

				if (!employee.activated) {
					const error = new Error('Employee not found');
					error.status = 404;
					throw error;
				}

				const completedRegistration = await this.models.Employee.update(
					{ password: hashedPassword, completed: true },
					{
						where: {
							email: employee.email,
						},
					}
				);

				resolve('Registration completed');
			} catch (error) {
				reject(error);
			}
		});
	}

	async loginEmployee(email, candidatePassword) {
		return new Promise(async (resolve, reject) => {
			try {
				const employee = await this.models.Employee.findOne({
					where: {
						email,
					},
					attributes: ['completed', 'password', 'id', 'companyId'],
				});

				if (!employee.completed) reject('Registration is not completed');

				const passwordIsCorrect = employee
					? await bcrypt.compare(candidatePassword, employee.password)
					: false;

				if (passwordIsCorrect) {
					const token = jwt.sign(
						{ employeeId: employee.id, companyId: employee.companyId },
						SECRET_TOKEN,
						{ algorithm: 'HS256' },
						{
							expiresIn: '1d',
						}
					);

					resolve(token);
				} else {
					reject('Invalid email or password');
				}
			} catch (error) {
				reject(error.message);
			}
		});
	}

	async uploadFile(companyId, employeeId, fileName) {
		return new Promise(async (resolve, reject) => {
			try {
				const subscription = await this.models.Subscription.findOne({
					where: { companyId },
					attributes: ['maxFiles'],
				});
				const fileCount = await this.models.File.count({ whre: companyId });

				if (subscription.maxFiles > fileCount) {
					const uploadFile = await this.models.File.create({
						fileName,
						companyId,
						employeeId,
					});
					resolve(uploadFile);
				}

				reject('You have reached your limit. We recommend upgrading to our premium plan.');
			} catch (error) {
				reject(error);
			}
		});
	}

	async getFile(companyId, employeeId, id) {
		return new Promise(async (resolve, reject) => {
			try {
				const file = await this.models.File.findOne({
					where: {
						companyId,
						employeeId,
						id,
					},
					attributes: ['fileName'],
				});

				if (!file) {
					reject('Not Authorized!');
				}

				resolve(file.fileName);
			} catch (error) {
				reject(error);
			}
		});
	}

	async deleteFile(companyId, employeeId, id) {
		return new Promise(async (resolve, reject) => {
			try {
				const fileDeleted = await this.models.File.destroy({
					where: {
						companyId,
						employeeId,
						id,
					},
				});

				if (!fileDeleted) {
					reject('Not Authorized!');
				}

				resolve('File deletes succesfully!');
			} catch (error) {
				reject(error);
			}
		});
	}
}

module.exports = AuthEmployeeService;
