import { Transaction } from "sequelize";
import { tasksPort } from "../../port/tasks/tasksRepo.port";
import { constants } from "../../../infrastructure/config/constants";

export const assignTasksUseCase = async (tasksId:number, assigneeId: number, status: string, tasksRepo: tasksPort, transaction: Transaction) => {
    const tasksDetails = await tasksRepo.getTasksById(tasksId, transaction);
    console.log("Task Details", tasksId);
    if(!tasksDetails) {
        throw new Error(constants.ERROR_MESSAGE.TASKS_NOT_FOUND);
    }

    if(tasksDetails.status === 'completed' && status === 'pending') {
        throw new Error(constants.ERROR_MESSAGE.CANNOT_REOPEN_COMPLETED_TASK);
    }
    const result = await tasksRepo.updateTasks(tasksId, status, assigneeId, transaction);
    if(!result) {
        throw new Error(constants.ERROR_MESSAGE.TASKS_NOT_FOUND);
    }
}