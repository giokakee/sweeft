/** @format */
const { DataTypes, Model } = require('sequelize');

class Subscription extends Model {
	static defineSchema(sequelize) {
		Subscription.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				planName: {
					field: 'plan_name',
					type: DataTypes.ENUM('Free tier', 'Basic', 'Premium'),
					allowNull: false,
					defaultValue: 'Free tier',
				},
				maxFiles: {
					field: 'max_files',
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				maxEmployees: {
					field: 'max_employees',
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				price: {
					type: DataTypes.DECIMAL(10, 2),
					allowNull: false,
				},
				pricePerExtraFile: {
					field: 'price_per_extraFile',
					type: DataTypes.DECIMAL(10, 2),
					allowNull: true,
				},
				companyId: {
					field: 'company_id',
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
			},
			{
				tableName: 'subscriptions',
				underscored: true,
				sequelize,
			}
		);
	}

	static associate(models) {
		Subscription.belongsTo(models.company, { foreignKey: 'company_id' });
	}
}

module.exports = { Subscription };
