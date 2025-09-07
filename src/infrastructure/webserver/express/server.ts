import cors from 'cors';
import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../../../api-docs/_openApi.json';
import { connectDB } from '../../config/dbConnection';
import { employeeRouter } from '../../../interface/routes/employee.route';
import { userRouter } from '../../../interface/routes/task-management/user.route';
import { CONFIG, sequelize } from '../../orm/config/sequelize.connection';
import { projectsRouter } from '../../../interface/routes/task-management/projects.route';
import { tasksRouter } from '../../../interface/routes/task-management/tasks.route';
const app: Application = express();

const PORT = CONFIG.SERVER_PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/v1/employee', employeeRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/projects', projectsRouter)
app.use('/api/v1/tasks', tasksRouter)

app.listen(PORT, async () => {
    await connectDB().then(() => {
        sequelize.sync().catch((error: Error) => console.error('Error syncing models:', error));
    });
    console.log(`Server running on http://localhost:${PORT}`);
});
