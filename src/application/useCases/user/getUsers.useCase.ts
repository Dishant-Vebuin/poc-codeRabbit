import { Transaction } from "sequelize";
import { constants } from "../../../infrastructure/config/constants";
import { userPort } from "../../port/user/userRepo.port";
import { UserDetails } from "../../../domain/models/user.type";

export const getUsersUseCase = async (
    userRepo: userPort,
    transaction: Transaction,
    role: string,
    tokenId: number,
    userId: number
): Promise<UserDetails[]> => {
    if (role === constants.ROLES.ADMIN) {
        const users = await userRepo.getUserById(userId, transaction);
        if (!users) {
            throw new Error(constants.ERROR_MESSAGE.USER_NOT_FOUND);
        }
        return Array.isArray(users) ? users : [users];
    }
    if (userId !== tokenId) {
        throw new Error(constants.ERROR_MESSAGE.UNAUTHORIZED_ACCESS);
    } else {
        const user = await userRepo.getUserById(userId, transaction);
        if (!user) {
            throw new Error(constants.ERROR_MESSAGE.USER_NOT_FOUND);
        }
        return [user];
    }
};