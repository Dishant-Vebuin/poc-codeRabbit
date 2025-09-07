import { Transaction } from "sequelize";
import { projectsPort } from "../../application/port/projects/projectsRepo.port";
import { wrapTransaction } from '../helper/middleware/transaction';
import Projects from "../orm/entities/task-management/project.entity";

export const projectsRepository: projectsPort = {
    wrapTransaction,
    addProjects: async (name: string, description: string, status: string, ownerId: number, transaction: Transaction) => {
        await Projects.create({
            name,
            description,
            status,
            ownerId
        }, {
            transaction
        })
    },
    getProjectById: async (id: number, ownerId: number, transaction: Transaction) => {
        const result = await Projects.findOne({ where: { id , ownerId}, transaction });
        return result ? result.dataValues : null;
    },
    getProjectByName: async (name, transaction) => {
        const result = await Projects.findOne({ where: { name }, transaction });
        return result ? result.dataValues : null;
    },
    updateProject: async (projectId: number, name: string, description: string, ownerId: number, transaction: Transaction) => {
        await Projects.update({
            name,
            description
        }, {
            where: { id: projectId, ownerId },
            transaction
        })
    },
    getListOfProjects: async (ownerId: number, limit: number, offset: number, transaction: Transaction) => {
        const result = await Projects.findAll({
            where: { ownerId },
            limit,
            offset,
            transaction
        });
        return result ? result.map(project => project.dataValues) : null;
    },
}