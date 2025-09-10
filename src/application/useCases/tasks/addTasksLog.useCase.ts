import { Transaction } from "sequelize";
import { constants } from "../../../infrastructure/config/constants";
import { tasksPort } from "../../port/tasks/tasksRepo.port";
import { userPort } from "../../port/user/userRepo.port";

export const addTasksLogUseCase = async (
    taskId: number,
    status: string,
    loggedBy: string | null,
    userRepo: userPort,
    tasksRepo: tasksPort,
    transaction: Transaction
) => {
    const checkTask = await tasksRepo.getTasksById(taskId, transaction);
    if (!checkTask) {
        throw new Error(constants.ERROR_MESSAGE.TASKS_NOT_FOUND);
    }

    if (loggedBy) {
        const checkUser = await userRepo.getUserById(Number(loggedBy), transaction);
        if (!checkUser) {
            throw new Error(constants.ERROR_MESSAGE.USER_NOT_FOUND);
        }
    }

    await tasksRepo.addTasksLog(
        {
            taskId,
            status,
            loggedBy,
        },
        transaction
    );
};
