import { QueryTypes, Transaction } from "sequelize";
import { wrapTransaction } from '../helper/middleware/transaction';
import Tasks from "../orm/entities/task-management/tasks.entity";
import { tasksPort } from "../../application/port/tasks/tasksRepo.port";
import { sequelize } from "../config/dbConnection";
import fs from "fs"
import path from "path";
import Projects from "../orm/entities/task-management/project.entity";

export const tasksRepository: tasksPort = {
    wrapTransaction,
    addTasks: async (title: string, description: string, status: string, deadline: Date, assigneeId: number | null, projectId: number, transaction: Transaction) => {
        await Tasks.create({
            title,
            description,
            status,
            deadline,
            assigneeId: assigneeId ? assigneeId : null,
            projectId
        }, {
            transaction
        })
    },
    getTasksById: async (id: number, transaction: Transaction) => {
        const result = await Tasks.findOne({ where: { id }, transaction });
        return result ? result.dataValues : null;
    },
    updateTasks: async (taskId: number, status: string, assigneeId: number | null, transaction: Transaction) => {
        const [affectedRows] = await Tasks.update(
            { status, assigneeId },
            { where: { id: taskId }, transaction }
        );
        console.log("Rows updated:", affectedRows);

        return affectedRows > 0;
    },
    deleteTasks: async (taskId: number, ownerId: number, transaction: Transaction) => {
        const deletedCount = await sequelize.query(
            fs.readFileSync(path.join(__dirname, 'sql/deleteTasksById.sql'), 'utf-8'),
            {
                replacements: { taskId, ownerId },
                transaction,
                type: QueryTypes.BULKDELETE
            }
        ) as number;

        return deletedCount > 0;
    }
}