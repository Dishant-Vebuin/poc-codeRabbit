import { Request, Response } from "express";
import { displayMessage } from "../../../infrastructure/helper/response";
import { constants } from "../../../infrastructure/config/constants";
import { projectsPort } from "../../../application/port/projects/projectsRepo.port";
import { getProjectsUseCase } from "../../../application/useCases/projects/getProject.useCase";
import { userPort } from "../../../application/port/user/userRepo.port";

export const getProjectsController = (projectsRepo: projectsPort, userRepo: userPort) => async (req: Request, res: Response) => {
    try {
        const { id } = res.locals.user
        const limit = parseInt(req.query.limit as string, 10);
        const offset = parseInt(req.query.offset as string, 10);

        const data = await projectsRepo.wrapTransaction(async (transaction) => {
            return await getProjectsUseCase(
                Number(id),
                limit,
                offset,
                projectsRepo,
                userRepo,
                transaction
            )
        })
        displayMessage(
            constants.SUCCESS_STATUS.OK,
            constants.SUCCESS_MESSAGE.PROJECTS_FETCHED,
            true,
            res,
            data
        )
    } catch (error) {
        if (!(error instanceof Error)) return;

        if (error.message === constants.ERROR_MESSAGE.USER_NOT_FOUND || error.message === constants.ERROR_MESSAGE.PROJECTS_NOT_FOUND) {
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