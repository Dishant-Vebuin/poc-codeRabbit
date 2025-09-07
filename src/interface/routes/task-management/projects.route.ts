import express from "express";
import { validateSchema } from '../../../infrastructure/helper/middleware/validateSchema';
import { addProjectsSchema } from "../../../domain/schemas/projects/addProjects.schema";
import { addProjectsController } from "../../controllers/projects/addProjects.Controller";
import { projectsRepository } from "../../../infrastructure/repositories/projects.repository";
import { userRepository } from "../../../infrastructure/repositories/user.repository";
import { authMiddleware } from "../../../infrastructure/config/env/middleware/authMiddleware";
import { updateProjectsSchema } from "../../../domain/schemas/projects/updateProjects.schema";
import { updateProjectsController } from "../../controllers/projects/updateProjects.Controller";
import { getProjectsController } from "../../controllers/projects/getProjects.Controller";

const projectsRouter = express.Router();

projectsRouter.post("/add-projects", authMiddleware(),validateSchema(addProjectsSchema), addProjectsController(projectsRepository, userRepository))
projectsRouter.put("/update-projects/:projectId", authMiddleware(), validateSchema(updateProjectsSchema), updateProjectsController(projectsRepository))
projectsRouter.get("/get-projects", authMiddleware(), getProjectsController(projectsRepository, userRepository))
export { projectsRouter };