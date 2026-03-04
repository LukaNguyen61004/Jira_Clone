import { Router } from 'express';
import { EpicController } from '../controllers/epicController';
import { authMiddleware } from '../middlewares/authMiddleware';
import {validateCreateEpic, validateUpdateEpic, validateEpicId, validateProjectIdParam} from '../middlewares/validation';

const router = Router();
router.use(authMiddleware);

router.post('/projects/:projectId/epics', validateProjectIdParam, validateCreateEpic, EpicController.createEpic);

router.get('/projects/:projectId/epics', validateProjectIdParam, EpicController.getProjectEpics);

router.get('/epics/:id', validateEpicId, EpicController.getEpicById);

router.put('/epics/:id', validateEpicId, validateUpdateEpic, EpicController.updateEpic);

router.delete('/epics/:id', validateEpicId, EpicController.deleteEpic);

router.get('/epics/:id/issues', validateEpicId, EpicController.getEpicIssues);

export default router;