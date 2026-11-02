const priorities = new Set(['low', 'medium', 'high']);
const statuses = new Set(['todo', 'in_progress', 'done']);

export function validateTaskInput(req, res, next) {
  const { title, priority, status, dueDate } = req.body;
  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    return res.status(400).json({ success: false, message: 'Title cannot be empty' });
  }
  if (priority !== undefined && !priorities.has(priority)) {
    return res.status(400).json({ success: false, message: 'Priority must be low, medium, or high' });
  }
  if (status !== undefined && !statuses.has(status)) {
    return res.status(400).json({ success: false, message: 'Status must be todo, in_progress, or done' });
  }
  if (dueDate !== undefined && dueDate !== null && (typeof dueDate !== 'string' || Number.isNaN(Date.parse(dueDate)))) {
    return res.status(400).json({ success: false, message: 'Due date must be a valid date' });
  }
  next();
}

export function validateQuery(req, res, next) {
  const { status, sortBy, sortOrder } = req.query;
  if (status && !statuses.has(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status filter' });
  }
  if (sortBy && !['dueDate', 'priority'].includes(sortBy)) {
    return res.status(400).json({ success: false, message: 'sortBy must be dueDate or priority' });
  }
  if (sortOrder && !['asc', 'desc'].includes(sortOrder)) {
    return res.status(400).json({ success: false, message: 'sortOrder must be asc or desc' });
  }
  next();
}
