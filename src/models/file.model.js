/** @format */
const { DataTypes, Model } = require('sequelize');

class File extends Model {
	static defineSchema(sequelize) {
		File.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				fileName: {
					field: 'file_name',
					type: new DataTypes.STRING(128),
					allowNull: false,
					unique: true,
				},
				employeeId: {
					field: 'employee_id',
					type: DataTypes.INTEGER.UNSIGNED,
					allowNull: false,
				},
				companyId: {
					field: 'company_id',
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
			},
			{
				tableName: 'files',
				underscored: true,
				sequelize,
			}
		);
	}

	static associate(models) {
		File.belongsTo(models.company, { foreignKey: 'company_id' });
	}

	static associate(models) {
		File.belongsTo(models.employee, { foreignKey: 'employee_id' });
	}
}

module.exports = { File };
