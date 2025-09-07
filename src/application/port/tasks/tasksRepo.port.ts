import { Transaction } from "sequelize";
import { taskDetails } from "../../../domain/models/tasks.type";

export type tasksPort = {
    addTasks: (title: string, description: string, status: string, deadline: Date, assigneeId: number | null, projectId: number, transaction: Transaction) => Promise<void>;
    getTasksById: (id: number, transaction: Transaction) => Promise<taskDetails | null>;
    updateTasks: (id: number, status: string, assigneeId: number | null, transaction: Transaction) => Promise<boolean>;
    deleteTasks: (id: number, transaction: Transaction) => Promise<boolean>;
    wrapTransaction: <T>(fun: (transaction: Transaction) => Promise<T>) => Promise<T>;
}