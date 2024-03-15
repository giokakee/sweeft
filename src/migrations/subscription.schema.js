/** @format */

const { DataTypes } = require('sequelize');

module.exports = {
	up: async ({ context }) => {
		const q = context.getQueryInterface();

		await q.createTable('subscriptions', {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			plan_name: {
				type: DataTypes.ENUM('Free tier', 'Basic', 'Premium'),
				allowNull: false,
				defaultValue: 'Free tier',
			},
			max_files: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			max_employees: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			price: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: false,
			},
			price_per_extraFile: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: true,
			},
			company_id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				unique: true,
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
		});

		await q.addConstraint('subscriptions', {
			fields: ['company_id'],
			type: 'foreign key',
			name: 'Subscription plan foreign key for company',
			references: {
				table: 'companies',
				field: 'id',
			},
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
		});
	},

	down: async ({ context }) => {
		const q = context.getQueryInterface();
		await q.dropTable('subscriptions');
	},
};
