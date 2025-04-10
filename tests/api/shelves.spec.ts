import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';

test.describe('Shelves API', () => {
  let authToken: string;
  let shelfId: number;

  test.beforeAll(async ({ request }) => {
    authToken = await AuthHelper.loginManagerCredential(request);
  });

  test('should create a new shelf', async ({ request }) => {
    const shelfData = {
      name: 'Test Shelf',
      code: 'SHLF-' + Date.now(),
      warehouseId: 1,
      status: 'ENABLE'
    };

    const response = await request.post('/shelves/create', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: shelfData
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    shelfId = responseBody.id;
    expect(responseBody.name).toBe(shelfData.name);
  });

  test('should create shelves from Excel', async ({ request }) => {
    const formData = new FormData();
    formData.append('excel', new Blob(['test data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'test.xlsx');

    const response = await request.post('/shelves/create/excel/1', {
      headers: await AuthHelper.getAuthHeader(authToken),
      multipart: formData
    });

    expect(response.status()).toBe(201);
  });

  test('should get all shelves', async ({ request }) => {
    const response = await request.get('/shelves/get-all', {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBeTruthy();
  });

  test('should get a specific shelf', async ({ request }) => {
    const response = await request.get(`/shelves/get-one/${shelfId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.id).toBe(shelfId);
  });

  test('should update a shelf', async ({ request }) => {
    const updateData = {
      id: shelfId,
      name: 'Updated Shelf',
      code: 'SHLF-UPDATE-' + Date.now(),
      warehouseId: 1,
      status: 'ENABLE'
    };

    const response = await request.put('/shelves/update', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: updateData
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.name).toBe(updateData.name);
  });

  test('should delete a shelf', async ({ request }) => {
    const response = await request.delete(`/shelves/delete/${shelfId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
  });
}); 