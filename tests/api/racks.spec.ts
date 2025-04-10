import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';

test.describe('Racks API', () => {
  let authToken: string;
  let rackId: number;

  test.beforeAll(async ({ request }) => {
    authToken = await AuthHelper.loginManagerCredential(request);
  });

  test('should create a new rack', async ({ request }) => {
    const rackData = {
      name: 'Test Rack',
      code: 'RACK-' + Date.now(),
      warehouseId: 1,
      status: 'ENABLE'
    };

    const response = await request.post('/racks/create', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: rackData
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    rackId = responseBody.id;
    expect(responseBody.name).toBe(rackData.name);
  });

  test('should get all racks', async ({ request }) => {
    const response = await request.get('/racks/get-all', {
      headers: await AuthHelper.getAuthHeader(authToken),
      params: {
        page: 1,
        limit: 10,
        sortBy: 'id',
        sortDirection: 'desc',
        warehouseId: 1,
        rackCode: 'RACK-'
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBeTruthy();
  });

  test('should get rack recommendations', async ({ request }) => {
    const response = await request.get('/racks/recommend', {
      headers: await AuthHelper.getAuthHeader(authToken),
      params: {
        totalCapacity: 100,
        parentProductCategoryId: 1
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBeTruthy();
  });

  test('should get a specific rack', async ({ request }) => {
    const response = await request.get(`/racks/get-one/${rackId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.id).toBe(rackId);
  });

  test('should update a rack', async ({ request }) => {
    const updateData = {
      id: rackId,
      name: 'Updated Rack',
      code: 'RACK-UPDATE-' + Date.now(),
      warehouseId: 1,
      status: 'ENABLE'
    };

    const response = await request.put('/racks/update', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: updateData
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.name).toBe(updateData.name);
  });

  test('should delete a rack', async ({ request }) => {
    const response = await request.delete(`/racks/delete/${rackId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
  });
}); 