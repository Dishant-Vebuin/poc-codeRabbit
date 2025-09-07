import { Transaction } from "sequelize";
import { constants } from "../../../infrastructure/config/constants";
import { tasksPort } from "../../port/tasks/tasksRepo.port";

export const deleteTasksUseCase = async (taskId: number, tasksRepo: tasksPort, transaction: Transaction) => {
    const checkTaskId = await tasksRepo.getTasksById(taskId, transaction);
    if (!checkTaskId) {
        throw new Error(constants.ERROR_MESSAGE.TASKS_NOT_FOUND);
    }

    await tasksRepo.deleteTasks(taskId, transaction);
}
