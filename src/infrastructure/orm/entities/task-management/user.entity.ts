import { DataTypes } from "sequelize";
import { sequelize } from "../../config/sequelize.connection";

const Users = sequelize
.define(
    "m_users",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(120),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("admin", "user"),
            allowNull: false,
            defaultValue: "user",
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "created_by",
            references: {
                model: "m_users",
                key: "id",
            },
            onDelete: "SET NULL",
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "updated_by",
            references: {
                model: "m_users",
                key: "id",
            },
            onDelete: "SET NULL",
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

export default Users
