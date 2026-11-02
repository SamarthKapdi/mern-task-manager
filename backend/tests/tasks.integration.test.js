import mongoose from 'mongoose';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import { connectDatabase } from '../config/db.js';
import Task from '../models/Task.js';

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongo.getUri();
  await connectDatabase();
});

afterEach(async () => {
  await Task.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('Task API', () => {
  it('creates and retrieves a task through the required /tasks paths', async () => {
    const createResponse = await request(app).post('/tasks').send({
      title: 'Ship assessment',
      description: 'Run the final checks',
      priority: 'high',
      status: 'todo',
      dueDate: '2026-12-01'
    });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.success).toBe(true);
    const id = createResponse.body.data._id;

    const listResponse = await request(app).get('/tasks/');
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data).toHaveLength(1);

    const singleResponse = await request(app).get(`/tasks/${id}`);
    expect(singleResponse.status).toBe(200);
    expect(singleResponse.body.data.title).toBe('Ship assessment');
  });

  it('updates and deletes a task through the API aliases', async () => {
    const task = await Task.create({ title: 'Initial task' });

    const updateResponse = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({ title: 'Updated task', status: 'done' });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data).toMatchObject({ title: 'Updated task', status: 'done' });

    const deleteResponse = await request(app).delete(`/api/tasks/${task.id}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.success).toBe(true);
    expect(await Task.findById(task.id)).toBeNull();
  });

  it('filters by status and sorts by due date and priority', async () => {
    await Task.create([
      { title: 'Late high', status: 'todo', priority: 'high', dueDate: '2026-12-20' },
      { title: 'Early low', status: 'todo', priority: 'low', dueDate: '2026-12-01' },
      { title: 'Completed', status: 'done', priority: 'medium', dueDate: '2026-11-01' }
    ]);

    const filtered = await request(app).get('/tasks?status=todo');
    expect(filtered.status).toBe(200);
    expect(filtered.body.data).toHaveLength(2);
    expect(filtered.body.data.every((task) => task.status === 'todo')).toBe(true);

    const byDate = await request(app).get('/tasks?sortBy=dueDate&sortOrder=asc');
    expect(byDate.body.data.map((task) => task.title)).toEqual(['Completed', 'Early low', 'Late high']);

    const byPriority = await request(app).get('/tasks?sortBy=priority&sortOrder=desc');
    expect(byPriority.body.data.map((task) => task.title)).toEqual(['Late high', 'Completed', 'Early low']);
  });

  it('rejects invalid input with 400 JSON responses', async () => {
    const cases = [
      { title: '   ' },
      { title: 'Valid', priority: 'urgent' },
      { title: 'Valid', status: 'blocked' }
    ];

    for (const payload of cases) {
      const response = await request(app).post('/tasks').send(payload);
      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ success: false });
      expect(response.body.message).toEqual(expect.any(String));
    }
  });

  it('handles malformed and nonexistent IDs with correct JSON errors', async () => {
    const malformed = await request(app).get('/tasks/not-an-object-id');
    expect(malformed.status).toBe(400);
    expect(malformed.body).toEqual({ success: false, message: 'Invalid task ID' });

    const nonexistent = await request(app).get('/tasks/507f1f77bcf86cd799439011');
    expect(nonexistent.status).toBe(404);
    expect(nonexistent.body).toEqual({ success: false, message: 'Task not found' });
  });
});
