import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';

test.describe('Master Products API', () => {
  let authToken: string;
  let masterProductId: number;

  test.beforeAll(async ({ request }) => {
    authToken = await AuthHelper.loginManagerCredential(request);
  });

  test('should create a new master product', async ({ request }) => {
    const masterProductData = {
      name: 'Test Master Product',
      code: 'MP-' + Date.now(),
      description: 'Test description',
      status: 'ENABLE'
    };

    const response = await request.post('/master-products/create', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: masterProductData
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    masterProductId = responseBody.id;
    expect(responseBody.name).toBe(masterProductData.name);
  });

  test('should get all master products', async ({ request }) => {
    const response = await request.get('/master-products/get-all', {
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

  test('should get a specific master product', async ({ request }) => {
    const response = await request.get(`/master-products/get-one/${masterProductId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.id).toBe(masterProductId);
  });

  test('should update a master product', async ({ request }) => {
    const updateData = {
      id: masterProductId,
      name: 'Updated Master Product',
      code: 'MP-UPDATE-' + Date.now(),
      description: 'Updated description',
      status: 'ENABLE'
    };

    const response = await request.put('/master-products/update', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: updateData
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.name).toBe(updateData.name);
  });

  test('should delete a master product', async ({ request }) => {
    const response = await request.delete(`/master-products/delete/${masterProductId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
  });
}); 