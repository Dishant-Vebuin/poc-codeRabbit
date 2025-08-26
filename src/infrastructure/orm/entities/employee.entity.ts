import { DataTypes } from "sequelize";
import Department from "./department.entity.js";
import { sequelize } from "../config/sequelize.connection.js";

const Employee = sequelize.define(
  "m_employees",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    deptId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "departments",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      field: "deptId",
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
    },
    position: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    salary: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    createdBy: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "created_by",
    },
    updatedBy: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "updated_by",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
  }
);

Employee.belongsTo(Department, { foreignKey: "deptId" });
Department.hasMany(Employee, { foreignKey: "deptId" });

export default Employee;
