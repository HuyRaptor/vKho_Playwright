import { test, expect } from '@playwright/test';
import { AuthHelper } from '../helpers/auth.helper';

test.describe('Blocks API - Manager Role', () => {
  let authToken: string;
  let blockId: number;

  test.beforeAll(async ({ request }) => {
    authToken = await AuthHelper.loginManagerCredential(request);
  });

  test('should create a new block', async ({ request }) => {
    const blockData = {
      name: 'Test Block',
      code: 'BLK-' + Date.now(),
      warehouseId: 1,
      status: 'ENABLE'
    };

    const response = await request.post('/blocks/create', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: blockData
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('id');
    blockId = responseBody.id;
    expect(responseBody.name).toBe(blockData.name);
  });

  test('should get all blocks', async ({ request }) => {
    const response = await request.get('/blocks/get-all', {
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

  test('should get a specific block', async ({ request }) => {
    expect(blockId).toBeDefined();
    const response = await request.get(`/blocks/get-one/${blockId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.id).toBe(blockId);
  });

  test('should update a block', async ({ request }) => {
    expect(blockId).toBeDefined();
    const updateData = {
      id: blockId,
      name: 'Updated Block',
      code: 'BLK-UPDATE-' + Date.now(),
      warehouseId: 1,
      status: 'ENABLE'
    };

    const response = await request.put('/blocks/update', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: updateData
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.name).toBe(updateData.name);
  });

  test('should delete a block', async ({ request }) => {
    expect(blockId).toBeDefined();
    const response = await request.delete(`/blocks/delete/${blockId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    if (response.status() !== 200) {
      const errorBody = await response.json();
      console.error('Delete block error:', errorBody);
    }

    expect(response.status()).toBe(200);
  });
}); 