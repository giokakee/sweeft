/** @format */

const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const { SECRET_TOKEN } = process.env;

class AuthCompanyService {
	constructor(sequelize) {
		this.client = sequelize;
		this.models = this.client.models;
	}

	async registerCompany(company) {
		const COST = 12;
		const hashedPassword = await bcrypt.hash(company.password, COST);
		return new Promise(async (resolve, reject) => {
			try {
				const newCompany = await this.models.Company.create({
					...company,
					password: hashedPassword,
				});

				resolve(newCompany);
			} catch (error) {
				reject(error);
			}
		});
	}

	async activateCompany(activationToken) {
		return new Promise(async (resolve, reject) => {
			try {
				const company = await this.models.Company.findOne({
					where: { activationToken },
				});

				if (!company) {
					const error = new Error('Company not found');
					error.status = 404;
					throw error;
				}

				if (company.activated) {
					const error = new Error('Company is already activated');
					error.status = 400;
					throw error;
				}
				company.activated = true;
				await company.save();

				resolve('Registration is Completed');
			} catch (error) {
				reject(error);
			}
		});
	}

	async loginCompany(email, candidatePassword) {
		return new Promise(async (resolve, reject) => {
			try {
				const company = await this.models.Company.findOne({
					where: {
						email,
					},
					attributes: ['companyName', 'activated', 'password', 'id'],
				});

				if (!company.activated) reject('Registration is not completed');

				const passwordIsCorrect = company
					? await bcrypt.compare(candidatePassword, company.password)
					: false;

				if (passwordIsCorrect) {
					const token = jwt.sign({ companyId: company.id }, SECRET_TOKEN, {
						expiresIn: '1d',
					});

					resolve(token);
				} else {
					reject('Invalid email or password');
				}
			} catch (error) {
				reject(error.message);
			}
		});
	}

	async deleteEmployee(companyId, employeeId) {
		return new Promise(async (resolve, reject) => {
			try {
				const where = { companyId, id: employeeId };

				const employeeDeleted = await this.models.Employee.destroy({ where });
				if (!employeeDeleted) {
					reject('Not Authorized!');
				}

				resolve('Employee Deleted!');
			} catch (error) {
				reject(error);
			}
		});
	}
}

module.exports = AuthCompanyService;
