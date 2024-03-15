/** @format */

const { DataTypes } = require('sequelize');

module.exports = {
	up: async ({ context }) => {
		const q = context.getQueryInterface();

		await q.createTable('files', {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},

			file_name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			employee_id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
			},
			company_id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
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

		await q.addConstraint('files', {
			fields: ['company_id'],
			type: 'foreign key',
			name: 'company foreign key for files',
			references: {
				table: 'companies',
				field: 'id',
			},
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
		});

		await q.addConstraint('files', {
			fields: ['employee_id'],
			type: 'foreign key',
			name: 'employee foreign key for files',
			references: {
				table: 'employees',
				field: 'id',
			},
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
		});
	},

	down: async ({ context }) => {
		const q = context.getQueryInterface();
		await q.dropTable('files');
	},
};
