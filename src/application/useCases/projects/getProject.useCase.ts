import { Transaction } from "sequelize";
import { constants } from "../../../infrastructure/config/constants";
import { projectsPort } from "../../port/projects/projectsRepo.port";
import { userPort } from "../../port/user/userRepo.port";
import { ProjectDetails } from "../../../domain/models/projects.type";

export const getProjectsUseCase = async (ownerId: number, limit: number, offset: number, projectsRepo: projectsPort, userRepo: userPort, transaction: Transaction): Promise<ProjectDetails[] | null> => {
    const existingUser = await userRepo.getUserById(ownerId, transaction);
    if (!existingUser) {
        throw new Error(constants.ERROR_MESSAGE.USER_NOT_FOUND);
    }

    const result = await projectsRepo.getListOfProjects(ownerId, limit, offset, transaction);
    if (!result || result.length === 0) {
        throw new Error(constants.ERROR_MESSAGE.PROJECTS_NOT_FOUND);
    }
    return result;
}
