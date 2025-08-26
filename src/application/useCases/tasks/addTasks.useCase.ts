import { Transaction } from "sequelize";
import { constants } from "../../../infrastructure/config/constants";
import { userPort } from "../../port/user/userRepo.port";
import { tasksPort } from "../../port/tasks/tasksRepo.port";
import { projectsPort } from "../../port/projects/projectsRepo.port";

export const addTasksUseCase = async (title: string, description: string, status: string, assigneeId: number, projectId: number, deadline: Date, ownerId: number, projectsRepo: projectsPort, tasksRepo: tasksPort, userRepo: userPort, transaction: Transaction) => {
    const checkProjectId = await projectsRepo.getProjectById(projectId, ownerId, transaction);

    const checkAssigneeId = await userRepo.getUserById(assigneeId, transaction);
    if (!checkAssigneeId) {
        throw new Error(constants.ERROR_MESSAGE.ASSIGNEE_NOT_FOUND);
    }
    if (!checkProjectId) {
        throw new Error(constants.ERROR_MESSAGE.PROJECTS_NOT_FOUND);
    }

    await tasksRepo.addTasks(title, description, status, deadline, assigneeId, projectId, transaction);
}
