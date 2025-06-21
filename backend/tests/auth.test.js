import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

const testUser = {
  username: 'testuser',
  password: 'testpass123',
  role: 'patient',
};

beforeAll((done) => {
  // Remove test user if exists
  db.run('DELETE FROM users WHERE username = ?', [testUser.username], done);
});

afterAll((done) => {
  // Clean up test user
  db.run('DELETE FROM users WHERE username = ?', [testUser.username], done);
});

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.username).toBe(testUser.username);
  });

  it('should not register duplicate user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.status).toBe(400);
  });

  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: testUser.username, password: testUser.password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.username).toBe(testUser.username);
  });

  it('should not login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: testUser.username, password: 'wrongpass' });
    expect(res.status).toBe(400);
  });
}); 