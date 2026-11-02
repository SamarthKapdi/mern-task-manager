import mongoose from 'mongoose';
import Task from '../models/Task.js';

function assertValidId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Invalid task ID');
    error.statusCode = 400;
    throw error;
  }
}

export async function createTask(req, res, next) {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}

export async function getTasks(req, res, next) {
  try {
    const { status, sortBy, sortOrder = 'asc' } = req.query;
    const query = status ? { status } : {};
    const direction = sortOrder === 'desc' ? -1 : 1;
    let tasks;
    if (sortBy === 'priority' || sortBy === 'dueDate') {
      tasks = await Task.aggregate([
        { $match: query },
        { $addFields: sortBy === 'priority'
          ? { priorityOrder: { $switch: {
            branches: [
              { case: { $eq: ['$priority', 'low'] }, then: 1 },
              { case: { $eq: ['$priority', 'medium'] }, then: 2 },
              { case: { $eq: ['$priority', 'high'] }, then: 3 }
            ],
            default: 2
          } } }
          : { dueDateMissing: { $cond: [{ $eq: [{ $type: '$dueDate' }, 'date'] }, 0, 1] } } },
        { $sort: sortBy === 'priority'
          ? { priorityOrder: direction, createdAt: -1 }
          : { dueDateMissing: 1, dueDate: direction, createdAt: -1 } },
        { $project: { priorityOrder: 0, dueDateMissing: 0 } }
      ]);
    } else {
      const sort = sortBy ? { [sortBy]: direction } : { createdAt: -1 };
      tasks = await Task.find(query).sort(sort);
    }
    res.json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
}

export async function getTask(req, res, next) {
  try {
    assertValidId(req.params.id);
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req, res, next) {
  try {
    assertValidId(req.params.id);
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req, res, next) {
  try {
    assertValidId(req.params.id);
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
}
