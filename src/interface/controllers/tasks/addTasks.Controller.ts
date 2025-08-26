import { Request, Response } from "express";
import { tasksPort } from "../../../application/port/tasks/tasksRepo.port";
import { displayMessage } from "../../../infrastructure/helper/response";
import { constants } from "../../../infrastructure/config/constants";
import { userPort } from "../../../application/port/user/userRepo.port";
import { addTasksUseCase } from "../../../application/useCases/tasks/addTasks.useCase";
import { projectsPort } from "../../../application/port/projects/projectsRepo.port";

export const addTasksController = (projectsRepo: projectsPort, tasksRepo: tasksPort, userRepo: userPort) => async (req: Request, res: Response) => {
    try {
        const { title, description, status, assigneeId, projectId, deadline } = req.body;

        const { id } = res.locals.user;
        await tasksRepo.wrapTransaction(async (transaction) => {
            return await addTasksUseCase(
                title,
                description,
                status,
                assigneeId,
                projectId,
                deadline,
                id,
                projectsRepo,
                tasksRepo,
                userRepo,
                transaction
            )
        })
        displayMessage(
            constants.SUCCESS_STATUS.CREATED,
            constants.SUCCESS_MESSAGE.TASKS_ADDED,
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
        if (error.message === constants.ERROR_MESSAGE.ASSIGNEE_NOT_FOUND) {
            displayMessage(
                constants.ERROR_STATUS.CONFLICT,
                constants.ERROR_MESSAGE.ASSIGNEE_NOT_FOUND,
                false,
                res
            );
        }
        else if (error.message === constants.ERROR_MESSAGE.PROJECTS_NOT_FOUND) {
            displayMessage(
                constants.ERROR_STATUS.NOT_FOUND,
                constants.ERROR_MESSAGE.PROJECTS_NOT_FOUND,
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