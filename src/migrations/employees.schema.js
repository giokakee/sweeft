/** @format */

const { DataTypes } = require('sequelize');

module.exports = {
	up: async ({ context }) => {
		const q = context.getQueryInterface();

		await q.createTable('employees', {
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			company_id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			activation_token: {
				type: DataTypes.STRING,
			},
			activated: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			completed: {
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

		await q.addConstraint('employees', {
			fields: ['company_id'],
			type: 'foreign key',
			name: 'employee foreign key for company',
			references: {
				table: 'companies',
				field: 'id',
			},
			onDelete: 'CASCADE', // Define the onDelete action if a user is deleted
			onUpdate: 'CASCADE', // Define the onUpdate action if a user's ID is updated
		});
	},

	down: async ({ context }) => {
		const q = context.getQueryInterface();
		await q.dropTable('employees');
	},
};
