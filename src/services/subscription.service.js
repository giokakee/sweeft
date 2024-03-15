/** @format */

const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const { SECRET_TOKEN } = process.env;

class SubscriptionService {
	constructor(sequelize) {
		this.client = sequelize;
		this.models = this.client.models;
		this.plans = {
			['Free tier']: {
				maxFiles: 10,
				maxEmployees: 1,
				price: 0,
				pricePerExtraFile: 0,
			},
			Basic: {
				maxFiles: 100,
				maxEmployees: 10,
				price: 300,
				pricePerExtraFile: 0,
			},
			Premium: {
				maxFiles: 1000,
				maxEmployees: 999999,
				price: 0,
				pricePerExtraFile: 0.05,
			},
		};
	}

	async subscribe(companyId, planName) {
		return new Promise(async (resolve, reject) => {
			try {
				const subscribe = await this.models.Subscription.create({
					planName,
					...this.plans[planName],
					companyId,
				});

				resolve(subscribe);
			} catch (error) {
				reject(error);
			}
		});
	}

	async changePlan(companyId, planName) {
		return new Promise(async (resolve, reject) => {
			try {
				const bill = 0;
				const company = await this.models.Company.findOne({
					where: {
						id: companyId,
					},
				});

				if (bill > 0) {
					reject('Pay the bill first');
				}

				await this.models.Subscription.destroy({ where: { companyId } });

				await this.subscribe(companyId, planName);

				resolve('Subscription plan updated succesfuly');
			} catch (error) {
				reject(error);
			}
		});
	}
}

module.exports = SubscriptionService;
