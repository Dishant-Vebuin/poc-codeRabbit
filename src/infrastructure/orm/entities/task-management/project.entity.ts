import { DataTypes } from "sequelize";
import Users from "./user.entity";
import { sequelize } from "../../config/sequelize.connection";

const Projects = sequelize.define(
    "m_projects",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM("active", "archived", "empty"),
            allowNull: false,
            defaultValue: "active",
        },
        ownerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "owner_id",
            references: {
                model: "m_users",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
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
)

Projects.belongsTo(Users, { foreignKey: "ownerId", as: "owner" });
Users.hasMany(Projects, { foreignKey: "ownerId", as: "projects" });

export default Projects;