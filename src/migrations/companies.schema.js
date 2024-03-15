/** @format */

const { DataTypes } = require('sequelize');

module.exports = {
	up: async ({ context }) => {
		const q = context.getQueryInterface();

		await q.createTable('companies', {
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			company_name: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			country: {
				type: new DataTypes.STRING(256),
				allowNull: false,
			},
			industry: {
				type: new DataTypes.STRING(256),
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			activation_token: {
				type: DataTypes.STRING,
			},
			activated: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			created_at: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
			updated_at: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
		});
	},

	down: async ({ context }) => {
		const q = context.getQueryInterface();
		await q.dropTable('companies');
	},
};
