import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';

test.describe('Replenishments API', () => {
  let authToken: string;
  let replenishmentId: number;

  test.beforeAll(async ({ request }) => {
    authToken = await AuthHelper.loginManagerCredential(request);
  });

  test('should create a new replenishment', async ({ request }) => {
    const replenishmentData = {
      code: 'REP-' + Date.now(),
      warehouseId: 1,
      status: 'NEW',
      productId: 1,
      quantity: 10
    };

    const response = await request.post('/replenishments/create', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: replenishmentData
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    replenishmentId = responseBody.id;
    expect(responseBody.code).toBe(replenishmentData.code);
  });

  test('should get all replenishments', async ({ request }) => {
    const response = await request.get('/replenishments/get-all', {
      headers: await AuthHelper.getAuthHeader(authToken),
      params: {
        page: 1,
        limit: 10,
        sortBy: 'id',
        sortDirection: 'desc',
        warehouseId: 1
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBeTruthy();
  });

  test('should get a specific replenishment', async ({ request }) => {
    const response = await request.get(`/replenishments/get-one/${replenishmentId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.id).toBe(replenishmentId);
  });

  test('should update a replenishment', async ({ request }) => {
    const updateData = {
      id: replenishmentId,
      code: 'REP-UPDATE-' + Date.now(),
      warehouseId: 1,
      status: 'COMPLETED',
      productId: 1,
      quantity: 15
    };

    const response = await request.put('/replenishments/update', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: updateData
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.code).toBe(updateData.code);
  });

  test('should delete a replenishment', async ({ request }) => {
    const response = await request.delete(`/replenishments/delete/${replenishmentId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
  });
}); 