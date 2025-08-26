import { DataTypes } from "sequelize";
import Projects from "./project.entity.js";
import Users from "./user.entity.js";
import { sequelize } from "../../config/sequelize.connection.js";

const Tasks = sequelize.define("t_tasks", {
    "id": {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    "title": {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    "description": {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    "status": {
        type: DataTypes.ENUM("pending", "in-progress", "completed", "archived"),
        allowNull: false,
        defaultValue: "pending",
    },
    "deadline": {
        type: DataTypes.DATE,
        allowNull: true,
    },
    "assigneeId": {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "assignee_id",
        onDelete: "SET NULL",
        references: {
            model: "m_users",
            key: "id",
        }
    },
    "projectId": {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "project_id",
        references: {
            model: "m_projects",
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
    },
    "createdBy": {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "created_by",
        references: {
            model: "m_users",
            key: "id",
        },
        onDelete: "SET NULL",
    },
    "updatedBy": {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "updated_by",
        references: {
            model: "m_users",
            key: "id",
        },
        onDelete: "SET NULL",
    },
    "createdAt": {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "created_at",
    },
    "updatedAt": {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "updated_at",
    },
}, {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
});

Tasks.belongsTo(Users, { foreignKey: "assigneeId", as: "assignee" });
Users.hasMany(Tasks, { foreignKey: "assigneeId", as: "tasks" });

Tasks.belongsTo(Projects, { foreignKey: "projectId", as: "project" });
Projects.hasMany(Tasks, { foreignKey: "projectId", as: "tasks" });

export default Tasks;
