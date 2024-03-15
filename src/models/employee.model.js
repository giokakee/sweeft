/** @format */
const { DataTypes, Model } = require('sequelize');

class Employee extends Model {
	static defineSchema(sequelize) {
		Employee.init(
			{
				id: {
					type: DataTypes.INTEGER.UNSIGNED,
					autoIncrement: true,
					primaryKey: true,
				},
				companyId: {
					field: 'company_id',
					type: new DataTypes.STRING(128),
					allowNull: false,
				},
				email: {
					type: DataTypes.STRING,
					allowNull: true,
					unique: true,
					validate: {
						isEmail: true,
					},
				},
				password: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				activationToken: {
					type: DataTypes.STRING,
					field: 'activation_token',
				},
				activated: {
					type: DataTypes.BOOLEAN,
					defaultValue: false,
				},
				completed: {
					type: DataTypes.BOOLEAN,
					defaultValue: false,
				},
			},
			{
				tableName: 'employees',
				underscored: true,
				sequelize,
			}
		);
	}

	static associate(models) {
		Employee.belongsTo(models.company, { foreignKey: 'company_id' });
	}
}

module.exports = { Employee };
