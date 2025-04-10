import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';

test.describe('Parent Product Categories API', () => {
  let authToken: string;
  let categoryId: number;

  test.beforeAll(async ({ request }) => {
    authToken = await AuthHelper.loginManagerCredential(request);
  });

  test('should create a new parent product category', async ({ request }) => {
    const categoryData = {
      name: 'Test Parent Category',
      code: 'PPC-' + Date.now(),
      status: 'ENABLE'
    };

    const response = await request.post('/parent-product-categorys/create', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: categoryData
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    categoryId = responseBody.id;
    expect(responseBody.name).toBe(categoryData.name);
  });

  test('should create parent product categories from Excel', async ({ request }) => {
    const formData = new FormData();
    formData.append('excel', new Blob(['test data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'test.xlsx');

    const response = await request.post('/parent-product-categorys/create/excel/1', {
      headers: await AuthHelper.getAuthHeader(authToken),
      multipart: formData
    });

    expect(response.status()).toBe(201);
  });

  test('should get all parent product categories', async ({ request }) => {
    const response = await request.get('/parent-product-categorys/get-all', {
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

  test('should get a specific parent product category', async ({ request }) => {
    const response = await request.get(`/parent-product-categorys/get-one/${categoryId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.id).toBe(categoryId);
  });

  test('should update a parent product category', async ({ request }) => {
    const updateData = {
      id: categoryId,
      name: 'Updated Parent Category',
      code: 'PPC-UPDATE-' + Date.now(),
      status: 'ENABLE'
    };

    const response = await request.put('/parent-product-categorys/update', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: updateData
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.name).toBe(updateData.name);
  });

  test('should delete a parent product category', async ({ request }) => {
    const response = await request.delete(`/parent-product-categorys/delete/${categoryId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
  });
}); 