import { Router } from 'express';
import { SprintController } from '../controllers/sprintController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateCreateSprint, validateUpdateSprint, validateCompleteSprint, validateSprintId, validateProjectIdParam} from '../middlewares/validation';

const router = Router();
router.use(authMiddleware);

router.post('/projects/:projectId/sprints', validateProjectIdParam, validateCreateSprint, SprintController.createSprint);


router.get('/projects/:projectId/sprints', validateProjectIdParam, SprintController.getProjectSprints);


router.get('/sprints/:id', validateSprintId, SprintController.getSprintById);


router.put('/sprints/:id', validateSprintId, validateUpdateSprint, SprintController.updateSprint);


router.post('/sprints/:id/start', validateSprintId, SprintController.startSprint);

router.post('/sprints/:id/complete', validateSprintId, validateCompleteSprint, SprintController.completeSprint);


router.delete('/sprints/:id', validateSprintId, SprintController.deleteSprint);


router.get('/sprints/:id/issues', validateSprintId, SprintController.getSprintIssues);

export default router;