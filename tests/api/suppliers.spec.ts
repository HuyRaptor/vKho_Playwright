import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';

test.describe('Suppliers API', () => {
  let authToken: string;
  let supplierId: number;

  test.beforeAll(async ({ request }) => {
    authToken = await AuthHelper.login(request);
  });

  test('should create a new supplier', async ({ request }) => {
    const supplierData = {
      name: 'Test Supplier',
      code: 'SUP-' + Date.now(),
      warehouseId: 1,
      status: 'ENABLE'
    };

    const response = await request.post('/suppliers/create', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: supplierData
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    supplierId = responseBody.id;
    expect(responseBody.name).toBe(supplierData.name);
  });

  test('should get all suppliers', async ({ request }) => {
    const response = await request.get('/suppliers/get-all', {
      headers: await AuthHelper.getAuthHeader(authToken),
      params: {
        page: 1,
        limit: 10,
        sortBy: 'id',
        sortDirection: 'desc',
        warehouseId: 1,
        supplierName: 'Test Supplier',
        status: 'ENABLE'
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBeTruthy();
  });

  test('should get a specific supplier', async ({ request }) => {
    const response = await request.get(`/suppliers/get-one/${supplierId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.id).toBe(supplierId);
  });

  test('should update a supplier', async ({ request }) => {
    const updateData = {
      id: supplierId,
      name: 'Updated Supplier',
      code: 'SUP-UPDATE-' + Date.now(),
      warehouseId: 1,
      status: 'ENABLE'
    };

    const response = await request.put('/suppliers/update', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: updateData
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.name).toBe(updateData.name);
  });

  test('should delete a supplier', async ({ request }) => {
    const response = await request.delete(`/suppliers/delete/${supplierId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
  });
}); 