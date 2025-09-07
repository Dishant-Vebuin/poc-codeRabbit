import { Transaction } from "sequelize";
import { constants } from "../../../infrastructure/config/constants";
import { projectsPort } from "../../port/projects/projectsRepo.port";

export const updateProjectsUseCase = async (projectId: number, name: string, description: string, ownerId: number, projectsRepo: projectsPort, transaction: Transaction) => {
    const existingProjectById = await projectsRepo.getProjectById(projectId, ownerId, transaction);
    if (!existingProjectById) {
        throw new Error(constants.ERROR_MESSAGE.PROJECTS_NOT_FOUND);
    }
    // Only check for conflicts if the name is changing
    if (existingProjectById.name !== name) {
        const conflictingProject = await projectsRepo.getProjectByName(name, transaction);
        if (conflictingProject && conflictingProject.id !== projectId) {
            throw new Error(constants.ERROR_MESSAGE.PROJECT_ALREADY_EXISTS);
        }
    }
    await projectsRepo.updateProject(projectId, name, description, ownerId, transaction);
}
