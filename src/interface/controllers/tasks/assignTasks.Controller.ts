import { Request, Response } from "express";
import { tasksPort } from "../../../application/port/tasks/tasksRepo.port";
import { assignTasksUseCase } from "../../../application/useCases/tasks/assignTasks.useCase";
import { constants } from "../../../infrastructure/config/constants";
import { displayMessage } from "../../../infrastructure/helper/response";

export const assignTasksController = (tasksRepo: tasksPort) => async (req: Request, res: Response) => {
    try {
        const { taskId } = req.params
        const { assigneeId, status } = req.body;
        await tasksRepo.wrapTransaction(async (transaction) => {
            return await assignTasksUseCase(
                Number(taskId),
                Number(assigneeId),
                status,
                tasksRepo,
                transaction,
            )
        })
        displayMessage(
            constants.SUCCESS_STATUS.OK,
            constants.SUCCESS_MESSAGE.TASKS_UPDATED,
            true,
            res
        );
    } catch (error) {
        console.log("Error ", error);
        if (!(error instanceof Error)) return;

        if (error.message === constants.ERROR_MESSAGE.TASKS_NOT_FOUND) {
            displayMessage(
                constants.ERROR_STATUS.NOT_FOUND,
                constants.ERROR_MESSAGE.TASKS_NOT_FOUND,
                false,
                res
            );
        }
        else if (error.message === constants.ERROR_MESSAGE.CANNOT_REOPEN_COMPLETED_TASK) {
            displayMessage(
                constants.ERROR_STATUS.CONFLICT,
                constants.ERROR_MESSAGE.CANNOT_REOPEN_COMPLETED_TASK,
                false,
                res
            );
        }
        else {
            displayMessage(
                constants.ERROR_STATUS.INTERNAL_SERVER_ERROR,
                constants.ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
                false,
                res
            );
        }
    }
}