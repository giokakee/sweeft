/** @format */
const { DataTypes, Model } = require('sequelize');
const { Employee } = require('./employee.model');

class Company extends Model {
	static defineSchema(sequelize) {
		Company.init(
			{
				id: {
					type: DataTypes.INTEGER.UNSIGNED,
					autoIncrement: true,
					primaryKey: true,
				},
				companyName: {
					field: 'company_name',
					type: new DataTypes.STRING(128),
					allowNull: false,
					validate: {
						len: [3, 30],
					},
				},
				country: {
					type: new DataTypes.STRING(128),
					allowNull: false,
					validate: {
						len: [3, 30],
					},
				},
				industry: {
					type: new DataTypes.STRING(256),
					allowNull: false,
				},
				email: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true,
					validate: {
						isEmail: true,
					},
				},
				activationToken: {
					type: DataTypes.STRING,
					field: 'activation_token',
				},
				activated: {
					type: DataTypes.BOOLEAN,
					defaultValue: false,
				},
				password: {
					type: DataTypes.STRING,
					allowNull: true,
				},
			},
			{
				tableName: 'companies',
				underscored: true,
				sequelize,
			}
		);
	}

	static associate(models) {
		Company.hasMany(models.employee);
	}
}

module.exports = { Company };
