import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';

test.describe('Divisions API', () => {
  let authToken: string;
  let divisionId: number;

  test.beforeAll(async ({ request }) => {
    authToken = await AuthHelper.loginManagerCredential(request);
  });

  test('should create a new division', async ({ request }) => {
    const divisionData = {
      name: 'Test Division',
      code: 'DIV-' + Date.now(),
      status: 'ENABLE'
    };

    const response = await request.post('/divison/create', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: divisionData
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    divisionId = responseBody.id;
    expect(responseBody.name).toBe(divisionData.name);
  });

  test('should get all divisions', async ({ request }) => {
    const response = await request.get('/divison/get-all', {
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

  test('should get a specific division', async ({ request }) => {
    const response = await request.get(`/divison/get-one/${divisionId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.id).toBe(divisionId);
  });

  test('should update a division', async ({ request }) => {
    const updateData = {
      id: divisionId,
      name: 'Updated Division',
      code: 'DIV-UPDATE-' + Date.now(),
      status: 'ENABLE'
    };

    const response = await request.put('/divison/update', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: updateData
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.name).toBe(updateData.name);
  });

  test('should delete a division', async ({ request }) => {
    const response = await request.delete(`/divison/delete/${divisionId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
  });
}); 