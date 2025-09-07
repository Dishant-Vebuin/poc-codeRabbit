import { Transaction } from "sequelize";
import { constants } from "../../../infrastructure/config/constants";
import { projectsPort } from "../../port/projects/projectsRepo.port";
import { userPort } from "../../port/user/userRepo.port";

export const addProjectsUseCase = async (name: string, description: string, status: string, ownerId: number, projectsRepo: projectsPort, userRepo: userPort, transaction: Transaction) => {
    const existingProject = await projectsRepo.getProjectByName(name, transaction);

    const checkOwnerId = await userRepo.getUserById(ownerId, transaction);
    if (!checkOwnerId) {
        throw new Error(constants.ERROR_MESSAGE.OWNER_NOT_FOUND);
    }
    if (existingProject) {
        throw new Error(constants.ERROR_MESSAGE.PROJECT_ALREADY_EXISTS);
    }
    await projectsRepo.addProjects(name, description, status, ownerId, transaction);
}
