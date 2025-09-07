import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.connection";

const Department = sequelize.define(
    "m_departments",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(80),
            allowNull: false,
            unique: true,
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        updated_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        timestamps: true,
        underscored: true,
    }
);

export default Department;
