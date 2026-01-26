import {Router} from 'express';
import { IssueController } from '../controllers/issueController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateCreateIssue, validateCreateComment, validateUpdateIssue, validateCommentId, validateProjectIdParam,validateIssueId} from '../middlewares/validation';

const router=Router();

router.use(authMiddleware);

//Issues
router.post('/projects/:projectId/issues',validateProjectIdParam, validateCreateIssue,IssueController.createIssue);

router.get('/projects/:projectId/issues',validateProjectIdParam,IssueController.getProjectIssues);

router.get('/issues/:id',validateIssueId,IssueController.getIssueById);

router.put('/issues/:id',validateIssueId, validateUpdateIssue,IssueController.updateIssue);

router.delete('/issues/:id',validateIssueId,IssueController.deleteIssue);


//Comments
router.post('/issues/:id/comments',validateIssueId, validateCreateComment, IssueController.addComment);

router.get('/issues/:id/comments',validateIssueId,IssueController.getIssueComments);

router.delete('/comments/:commentId',validateCommentId,IssueController.deleteComment);

export default router;