import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';

test.describe('Warehouses API', () => {
  let authToken: string;
  let warehouseId: number;

  test.beforeAll(async ({ request }) => {
    authToken = await AuthHelper.loginAdminCredential(request);
  });

  test('should create a new warehouse', async ({ request }) => {
    const warehouseData = {
      name: 'Test Warehouse',
      address: '123 Warehouse Street',
      acreage: 1000
    };

    const response = await request.post('/warehouses/create', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: warehouseData
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    warehouseId = responseBody.id;
    expect(responseBody.name).toBe(warehouseData.name);
  });

  test('should get all warehouses', async ({ request }) => {
    const response = await request.get('/warehouses/get-all', {
      headers: await AuthHelper.getAuthHeader(authToken),
      params: {
        page: 1,
        limit: 10,
        sortBy: 'id',
        sortDirection: 'desc'
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBeTruthy();
  });

  test('should get a specific warehouse', async ({ request }) => {
    const response = await request.get(`/warehouses/get-one/${warehouseId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.id).toBe(warehouseId);
  });

  test('should update a warehouse', async ({ request }) => {
    const updateData = {
      id: warehouseId,
      name: 'Updated Warehouse',
      code: 'WH-' + Date.now(),
      acreage: 1500,
      address: '456 Updated Warehouse Street',
      createDate: new Date().toISOString(),
      status: 'ENABLE'
    };

    const response = await request.put('/warehouses/update', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: updateData
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.name).toBe(updateData.name);
  });

  test('should add user to warehouse', async ({ request }) => {
    const addUserData = {
      warehouseIds: [warehouseId],
      userId: 'test-user-id'
    };

    const response = await request.post('/warehouses/add-user', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: addUserData
    });

    expect(response.status()).toBe(201);
  });

  test('should delete a warehouse', async ({ request }) => {
    const response = await request.delete(`/warehouses/delete/${warehouseId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
  });
}); 