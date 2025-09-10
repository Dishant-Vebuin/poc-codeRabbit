// src/models/taskAudit.entity.ts
import { DataTypes } from "sequelize";
import Users from "./user.entity";
import { sequelize } from "../../config/sequelize.connection";
import Tasks from "./tasks.entity";

const TasksLog = sequelize.define("t_tasks_audit", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    taskId: { type: DataTypes.INTEGER, allowNull: false, field: "task_id", references: { model: "t_tasks", key: "id" }, onDelete: "CASCADE" },
    status: { type: DataTypes.ENUM("completed", "archived"), allowNull: false },
    loggedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: "logged_at" },
    loggedBy: { type: DataTypes.INTEGER, allowNull: true, field: "logged_by", references: { model: "m_users", key: "id" }, onDelete: "SET NULL" },
},
    {
        freezeTableName: true,
        timestamps: false,
        underscored: true,
    }
);

TasksLog.belongsTo(Tasks, { foreignKey: "taskId", as: "task" });
TasksLog.belongsTo(Users, { foreignKey: "loggedBy", as: "logger" });

export default TasksLog;