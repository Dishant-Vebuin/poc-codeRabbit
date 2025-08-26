import { Transaction } from "sequelize";
import { ProjectDetails } from "../../../domain/models/projects.type";

export type projectsPort = {
    addProjects: (name: string, description: string, status: string, ownerId: number, transaction: Transaction) => Promise<void>;
    getProjectById: (id: number, ownerId: number, transaction: Transaction) => Promise<ProjectDetails | null>;
    getProjectByName: (name: string, transaction: Transaction) => Promise<ProjectDetails | null>;
    updateProject: (projectId: number, name: string, description: string, ownerId: number, transaction: Transaction) => Promise<void>;
    getListOfProjects: (ownerId: number, limit:number, offset:number ,transaction: Transaction) => Promise<ProjectDetails[] | null>;
    wrapTransaction: <T>(fun: (transaction: Transaction) => Promise<T>) => Promise<T>;
}