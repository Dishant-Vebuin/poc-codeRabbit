import { userPort } from "../../../application/port/user/userRepo.port";
import { tasksPort } from "../../../application/port/tasks/tasksRepo.port";
import { constants } from "../../../infrastructure/config/constants";
import { displayMessage } from "../../../infrastructure/helper/response";
import { addTasksLogUseCase } from "../../../application/useCases/tasks/addTasksLog.useCase";

export const addTasksLogController =
    (userRepo: userPort, tasksRepo: tasksPort) =>
        async (req: any, res: any) => {
            try {
                const { id } = req.params;
                const { status, loggedBy } = req.body;

                await tasksRepo.wrapTransaction(async (transaction) => {
                    return await addTasksLogUseCase(
                        Number(id),
                        status,
                        loggedBy,
                        userRepo,
                        tasksRepo,
                        transaction
                    );
                });

                displayMessage(
                    constants.SUCCESS_STATUS.CREATED,
                    constants.SUCCESS_MESSAGE.TASK_LOG_ADDED,
                    true,
                    res
                );
            } catch (error) {
                console.log("error", error);
                if (!(error instanceof Error)) return;

                if (error.message === constants.ERROR_MESSAGE.TASKS_NOT_FOUND) {
                    displayMessage(
                        constants.ERROR_STATUS.NOT_FOUND,
                        constants.ERROR_MESSAGE.TASKS_NOT_FOUND,
                        false,
                        res
                    );
                } else if (error.message === constants.ERROR_MESSAGE.USER_NOT_FOUND) {
                    displayMessage(
                        constants.ERROR_STATUS.NOT_FOUND,
                        constants.ERROR_MESSAGE.USER_NOT_FOUND,
                        false,
                        res
                    );
                } else {
                    displayMessage(
                        constants.ERROR_STATUS.INTERNAL_SERVER_ERROR,
                        constants.ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
                        false,
                        res
                    );
                }
            }
        };
