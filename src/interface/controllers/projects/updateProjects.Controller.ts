import { Request, Response } from "express";
import { displayMessage } from "../../../infrastructure/helper/response";
import { constants } from "../../../infrastructure/config/constants";
import { projectsPort } from "../../../application/port/projects/projectsRepo.port";
import { updateProjectsUseCase } from "../../../application/useCases/projects/updateProjects.useCase";


export const updateProjectsController = (projectsRepo: projectsPort) => async (req: Request, res: Response) => {
    try {
        const projectId = parseInt(req.params.projectId, 10);
        const { name, description } = req.body;

        const { id } = res.locals.user;
        await projectsRepo.wrapTransaction(async (transaction) => {
            return await updateProjectsUseCase(
                projectId,
                name,
                description,
                id,
                projectsRepo,
                transaction
            )
        })
        displayMessage(
            constants.SUCCESS_STATUS.CREATED,
            constants.SUCCESS_MESSAGE.PROJECTS_UPDATED,
            true,
            res
        )
    } catch (error) {
        if (!(error instanceof Error)) return;

        if (error.message === constants.ERROR_MESSAGE.PROJECT_ALREADY_EXISTS) {
            displayMessage(
                constants.ERROR_STATUS.CONFLICT,
                error.message,
                false,
                res
            );
        }
        else if (error.message === constants.ERROR_MESSAGE.PROJECTS_NOT_FOUND) {
            displayMessage(
                constants.ERROR_STATUS.NOT_FOUND,
                error.message,
                false,
                res
            )
        }
        else {
            displayMessage(
                constants.ERROR_STATUS.INTERNAL_SERVER_ERROR,
                error.message,
                false,
                res
            )
        }
    }
}