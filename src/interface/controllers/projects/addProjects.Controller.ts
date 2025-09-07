import { Request, Response } from "express";
import { displayMessage } from "../../../infrastructure/helper/response";
import { constants } from "../../../infrastructure/config/constants";
import { addProjectsUseCase } from "../../../application/useCases/projects/addProjects.useCase";
import { projectsPort } from "../../../application/port/projects/projectsRepo.port";
import { userPort } from "../../../application/port/user/userRepo.port";


export const addProjectsController = (projectsRepo: projectsPort, userRepo: userPort) => async (req: Request, res: Response) => {
    try {
        const { id } = res.locals.user
        const { name, description, status } = req.body;
        await projectsRepo.wrapTransaction(async (transaction) => {
            return await addProjectsUseCase(
                name,
                description,
                status,
                id,
                projectsRepo,
                userRepo,
                transaction
            )
        })
        displayMessage(
            constants.SUCCESS_STATUS.CREATED,
            constants.SUCCESS_MESSAGE.PROJECTS_ADDED,
            true,
            res
        )
    } catch (error) {
        if (!(error instanceof Error)) return;
        console.log("Error ", error.message);

        if (error.message === constants.ERROR_MESSAGE.PROJECT_ALREADY_EXISTS) {
            displayMessage(
                constants.ERROR_STATUS.CONFLICT,
                error.message,
                false,
                res
            );
        }
        else if (error.message === constants.ERROR_MESSAGE.OWNER_NOT_FOUND) {
            displayMessage(
                constants.ERROR_STATUS.NOT_FOUND,
                error.message,
                false,
                res
            );
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