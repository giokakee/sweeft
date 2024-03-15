/** @format */

exports.plans = {
	['Free tier']: {
		maxFiles: 10,
		maxEmployees: 1,
		price: 0,
		price_per_extraFile: 0,
	},
	Basic: {
		maxFiles: 100,
		maxEmployees: 10,
		price: 300,
		price_per_extraFile: 0,
	},
	Premium: {
		maxFiles: 1000,
		maxEmployees: 999999,
		price: 0,
		price_per_extraFile: 0.05,
	},
};
