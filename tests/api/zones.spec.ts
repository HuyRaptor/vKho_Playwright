import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';

test.describe('Zones API', () => {
  let authToken: string;
  let zoneId: number;

  test.beforeAll(async ({ request }) => {
    authToken = await AuthHelper.login(request);
  });

  test('should create a new zone', async ({ request }) => {
    const zoneData = {
      name: 'Test Zone',
      code: 'ZONE-' + Date.now(),
      warehouseId: 1,
      status: 'ENABLE'
    };

    const response = await request.post('/zones/create', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: zoneData
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('id');
    zoneId = responseBody.id;
    expect(responseBody.name).toBe(zoneData.name);
  });

  test('should get all zones', async ({ request }) => {
    const response = await request.get('/zones/get-all', {
      headers: await AuthHelper.getAuthHeader(authToken),
      params: {
        page: 1,
        limit: 10,
        sortBy: 'id',
        sortDirection: 'desc',
        warehouseId: 1,
        zoneName: 'Test Zone'
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBeTruthy();
  });

  test('should get a specific zone', async ({ request }) => {
    expect(zoneId).toBeDefined();
    const response = await request.get(`/zones/get-one/${zoneId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.id).toBe(zoneId);
  });

  test('should update a zone', async ({ request }) => {
    expect(zoneId).toBeDefined();
    const updateData = {
      id: zoneId,
      name: 'Updated Zone',
      code: 'ZONE-UPDATE-' + Date.now(),
      warehouseId: 1,
      status: 'ENABLE'
    };

    const response = await request.put('/zones/update', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: updateData
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.name).toBe(updateData.name);
  });

  test('should delete a zone', async ({ request }) => {
    expect(zoneId).toBeDefined();
    const response = await request.delete(`/zones/delete/${zoneId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    if (response.status() !== 200) {
      const errorBody = await response.json();
      console.error('Delete zone error:', errorBody);
    }

    expect(response.status()).toBe(200);
  });
}); 