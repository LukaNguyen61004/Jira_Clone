import { Request, Response, NextFunction } from 'express';
import { body, validationResult, param } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validate falied",
      details: errors.array()
    });
  }
  next();
};

export const validateRegister = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 4 }).withMessage('Name must be at least 4 characters'),

  validate

];

export const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .trim()
    .notEmpty().withMessage('Password is required'),

  validate
];

//validate Project

export const validateCreateProject = [
  body('name')
    .trim()
    .notEmpty().withMessage('Project name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Project name must be 3-100 characters'),

  body('key')
    .trim()
    .notEmpty().withMessage('Project key is required')
    .matches(/^[A-Z0-9]{2,10}$/).withMessage('Project key must be 2-10 uppercase letters/numbers (e.g.,  PROJ, BLOG'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),

  validate,
]

export const validateUpdateProject = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Project name cannot be empty')
    .isLength({ min: 3, max: 100 }).withMessage('Project name must be 3-100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),

  body().custom((value, { req }) => {
    if (!req.body.name && !req.body.description) {
      throw new Error('At least one field (name or description) is required');
    }

    return true;
  }),

  validate
]

export const validateAddMember = [
  body('userId')
    .notEmpty().withMessage('User ID is required')
    .isInt({ min: 1 }).withMessage('User ID must be a positive integer'),

  body('role')
    .optional()
    .isIn(['admin', 'member']).withMessage('Role must be either "admin" or "member"'),

  validate
];

export const validateProjectId = [
  param('id')
    .isInt({ min: 1 }).withMessage('Project ID must be a positive integer'),

  validate
];

export const validateUserId = [
  param('userId')
    .isInt({ min: 1 }).withMessage('User ID must be a positive integer'),

  validate
];

//Issue
export const validateCreateIssue = [
  body('name')
    .trim()
    .notEmpty()
    .isLength({ min: 3, max: 200 }).withMessage('Issue name must be 3-200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description must not exceed 2000 characters'),

  body('type')
    .notEmpty().withMessage('Issue type is required')
    .isIn(['task', 'bug', 'story']).withMessage('Type must be one of: task, bug, story'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be one of: low, medium, high'),

  body('assigneeId')
    .optional()
    .isInt({ min: 1 }).withMessage('Assignee ID must be a positive integer'),

  body('epicId')
    .optional()
    .isInt({ min: 1 }).withMessage('Epic ID must be a positive integer'),

  body('sprintId')
    .optional()
    .isInt({ min: 1 }).withMessage('Sprint ID must be a positive integer'),

  validate
];

export const validateUpdateIssue = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Issue name cannot be empty')
    .isLength({ min: 3, max: 200 }).withMessage('Issue name must be 3-200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description must not exceed 2000 characters'),

  body('type')
    .optional()
    .isIn(['task', 'bug', 'story']).withMessage('Type must be one of: task, bug, story'),

  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'in_review', 'done']).withMessage('Status must be one of: todo, in_progress, in_review, done'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be one of: low, medium, high'),

  body('assigneeId')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null) return true; // Allow null for unassign
      if (typeof value === 'number' && value > 0) return true;
      throw new Error('Assignee ID must be a positive integer or null');
    }),

  body('epicId')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null) return true;
      if (typeof value === 'number' && value > 0) return true;
      throw new Error('Epic ID must be a positive integer or null');
    }),

  body('sprintId')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null) return true;
      if (typeof value === 'number' && value > 0) return true;
      throw new Error('Sprint ID must be a positive integer or null');
    }),


  // Phải có ít nhất 1 field để update
  body().custom((value, { req }) => {
    const fields = ['name', 'description', 'type', 'status', 'priority', 'assigneeId'];
    const hasField = fields.some(field => req.body[field] !== undefined);
    if (!hasField) {
      throw new Error('At least one field is required to update');
    }
    return true;
  }),

  validate
];


export const validateIssueId = [
  param('id')
    .isInt({ min: 1 }).withMessage('Issue ID must be a positive integer'),

  validate
];

// Validate Project ID param (for issue routes)
export const validateProjectIdParam = [
  param('projectId')
    .isInt({ min: 1 }).withMessage('Project ID must be a positive integer'),

  validate
];

//Comment

export const validateCreateComment = [
  body('content')
    .trim()
    .notEmpty().withMessage('Comment content is required')
    .isLength({ min: 1, max: 1000 }).withMessage('Comment must be 1-1000 characters'),

  validate
];

// Validate Comment ID param
export const validateCommentId = [
  param('commentId')
    .isInt({ min: 1 }).withMessage('Comment ID must be a positive integer'),

  validate
];

//Epic
export const validateCreateEpic = [
  body('name')
    .trim()
    .notEmpty().withMessage('Epic name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Epic name must be 3-100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),

  body('color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Color must be in hex format (e.g., #8B5CF6)'),

  validate
];

// Validate Update Epic
export const validateUpdateEpic = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Epic name cannot be empty')
    .isLength({ min: 3, max: 100 }).withMessage('Epic name must be 3-100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),

  body('color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Color must be in hex format (e.g., #8B5CF6)'),

  body().custom((value, { req }) => {
    if (!req.body.name && !req.body.description && !req.body.color) {
      throw new Error('At least one field (name, description, or color) is required');
    }
    return true;
  }),

  validate
];

// Validate Epic ID param
export const validateEpicId = [
  param('id')
    .isInt({ min: 1 }).withMessage('Epic ID must be a positive integer'),

  validate
];

//Sprint
export const validateCreateSprint = [
  body('name')
    .trim()
    .notEmpty().withMessage('Sprint name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Sprint name must be 3-100 characters'),

  body('goal')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Sprint goal must not exceed 500 characters'),

  body('startDate')
    .optional()
    .isISO8601().withMessage('Start date must be a valid ISO 8601 date'),

  body('endDate')
    .optional()
    .isISO8601().withMessage('End date must be a valid ISO 8601 date'),

  validate
];

// Validate Update Sprint
export const validateUpdateSprint = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Sprint name cannot be empty')
    .isLength({ min: 3, max: 100 }).withMessage('Sprint name must be 3-100 characters'),

  body('goal')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Sprint goal must not exceed 500 characters'),

  body('status')
    .optional()
    .isIn(['planned', 'active', 'completed']).withMessage('Status must be one of: planned, active, completed'),

  body('startDate')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null) return true;
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) return true;
      throw new Error('Start date must be a valid ISO 8601 date or null');
    }),

  body('endDate')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null) return true;
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) return true;
      throw new Error('End date must be a valid ISO 8601 date or null');
    }),

  body().custom((value, { req }) => {
    const fields = ['name', 'goal', 'status', 'startDate', 'endDate'];
    const hasField = fields.some(field => req.body[field] !== undefined);
    if (!hasField) {
      throw new Error('At least one field is required to update');
    }
    return true;
  }),

  validate
];

// Validate Complete Sprint
export const validateCompleteSprint = [
  body('moveToSprintId')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === undefined) return true;
      if (typeof value === 'number' && value > 0) return true;
      throw new Error('moveToSprintId must be a positive integer or null');
    }),

  validate
];

// Validate Sprint ID param
export const validateSprintId = [
  param('id')
    .isInt({ min: 1 }).withMessage('Sprint ID must be a positive integer'),

  validate
];

//SendInvitation
export const validateSendInvitation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('role')
        .optional()
        .isIn(['admin', 'member']).withMessage('Role must be admin or member'),

    validate
];