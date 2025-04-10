import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';

test.describe('Product Categories API', () => {
  let authToken: string;
  let categoryId: number;

  test.beforeAll(async ({ request }) => {
    authToken = await AuthHelper.loginManagerCredential(request);
  });

  test('should create a new product category', async ({ request }) => {
    const categoryData = {
      name: 'Test Category',
      code: 'CAT-' + Date.now(),
      parentProductCategoryId: 1,
      status: 'ENABLE'
    };

    const response = await request.post('/product-categorys/create', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: categoryData
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    categoryId = responseBody.id;
    expect(responseBody.name).toBe(categoryData.name);
  });

  test('should get all product categories', async ({ request }) => {
    const response = await request.get('/product-categorys/get-all', {
      headers: await AuthHelper.getAuthHeader(authToken),
      params: {
        page: 1,
        limit: 10,
        sortBy: 'id',
        sortDirection: 'desc',
        parentProductCategoryId: 1
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBeTruthy();
  });

  test('should get a specific product category', async ({ request }) => {
    const response = await request.get(`/product-categorys/get-one/${categoryId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.id).toBe(categoryId);
  });

  test('should update a product category', async ({ request }) => {
    const updateData = {
      id: categoryId,
      name: 'Updated Category',
      code: 'CAT-UPDATE-' + Date.now(),
      parentProductCategoryId: 1,
      status: 'ENABLE'
    };

    const response = await request.put('/product-categorys/update', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: updateData
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.name).toBe(updateData.name);
  });

  test('should delete a product category', async ({ request }) => {
    const response = await request.delete(`/product-categorys/delete/${categoryId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
  });
}); 