import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';

test.describe('Vans API', () => {
  let authToken: string;
  let vanId: number;

  test.beforeAll(async ({ request }) => {
    authToken = await AuthHelper.login(request);
  });

  test('should create a new van', async ({ request }) => {
    const vanData = {
      name: 'Test Van',
      code: 'VAN-' + Date.now(),
      status: 'ENABLE'
    };

    const response = await request.post('/vans/create', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: vanData
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('id');
    vanId = responseBody.id;
    expect(responseBody.name).toBe(vanData.name);
  });

  test('should get all vans', async ({ request }) => {
    const response = await request.get('/vans/get-all', {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBeTruthy();
  });

  test('should get a specific van', async ({ request }) => {
    expect(vanId).toBeDefined();
    const response = await request.get(`/vans/get-one/${vanId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.id).toBe(vanId);
  });

  test('should update a van', async ({ request }) => {
    expect(vanId).toBeDefined();
    const updateData = {
      id: vanId,
      name: 'Updated Van',
      code: 'VAN-UPDATE-' + Date.now(),
      status: 'ENABLE'
    };

    const response = await request.put('/vans/update', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: updateData
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.name).toBe(updateData.name);
  });

  test('should delete a van', async ({ request }) => {
    expect(vanId).toBeDefined();
    const response = await request.delete(`/vans/delete/${vanId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    if (response.status() !== 200) {
      const errorBody = await response.json();
      console.error('Delete van error:', errorBody);
    }

    expect(response.status()).toBe(200);
  });
}); 