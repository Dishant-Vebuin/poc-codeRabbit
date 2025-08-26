import { Request, Response } from "express";
import { userPort } from "../../../application/port/user/userRepo.port";
import { displayMessage } from "../../../infrastructure/helper/response";
import { constants } from "../../../infrastructure/config/constants";
import { getUsersUseCase } from "../../../application/useCases/user/getUsers.useCase";

export const getUsersController = (userRepo: userPort) => async (req: Request, res: Response) => {
    try {
        const { role, id } = res.locals.user;
        const userId = parseInt(req.params.id)
        const users = await userRepo.wrapTransaction(async (transaction) => {
            return await getUsersUseCase(userRepo, transaction, role, id, userId)
        })

        displayMessage(
            constants.SUCCESS_STATUS.OK,
            constants.SUCCESS_MESSAGE.USER_FETCHED,
            true,
            res,
            users
        )
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        if (message === constants.ERROR_MESSAGE.USER_NOT_FOUND) {
            displayMessage(
                constants.ERROR_STATUS.NOT_FOUND,
                message,
                false,
                res
            )
        } else if (message === constants.ERROR_MESSAGE.UNAUTHORIZED_ACCESS) {
            displayMessage(
                constants.ERROR_STATUS.ACCESS_DENIED,
                message,
                false,
                res
            )
        } else {
            displayMessage(
                constants.ERROR_STATUS.INTERNAL_SERVER_ERROR,
                constants.ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
                false,
                res
            )
        }
    }
}