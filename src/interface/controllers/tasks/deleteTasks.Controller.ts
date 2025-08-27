import { Request, Response } from "express";
import { tasksPort } from "../../../application/port/tasks/tasksRepo.port";
import { displayMessage } from "../../../infrastructure/helper/response";
import { constants } from "../../../infrastructure/config/constants";
import { deleteTasksUseCase } from "../../../application/useCases/tasks/deleteTasks.useCase";

export const deleteTasksController = (tasksRepo: tasksPort) => async (req: Request, res: Response) => {
    try {
        const { taskId } = req.params;

        const { id } = res.locals.user;
        await tasksRepo.wrapTransaction(async (transaction) => {
            return await deleteTasksUseCase(
                Number(taskId),
                id,
                tasksRepo,
                transaction
            )
        })
        displayMessage(
            constants.SUCCESS_STATUS.OK,
            constants.SUCCESS_MESSAGE.TASKS_DELETED,
            true,
            res
        )
    } catch (error) {
        if (!(error instanceof Error)) {
            displayMessage(
                constants.ERROR_STATUS.INTERNAL_SERVER_ERROR,
                constants.ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
                false,
                res
            );
            return;
        }
        if (error.message === constants.ERROR_MESSAGE.TASKS_NOT_FOUND) {
            displayMessage(
                constants.ERROR_STATUS.CONFLICT,
                constants.ERROR_MESSAGE.TASKS_NOT_FOUND,
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