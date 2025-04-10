import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';

test.describe('Product History API', () => {
  let authToken: string;
  let historyId: number;

  test.beforeAll(async ({ request }) => {
    authToken = await AuthHelper.loginManagerCredential(request);
  });

  test('should create a new product history', async ({ request }) => {
    const historyData = {
      productId: 1,
      warehouseId: 1,
      type: 'INVENTORY',
      quantity: 10,
      note: 'Test history entry'
    };

    const response = await request.post('/product-historys/create', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: historyData
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    historyId = responseBody.id;
    expect(responseBody.productId).toBe(historyData.productId);
  });

  test('should get all product histories', async ({ request }) => {
    const response = await request.get('/product-historys/get-all', {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBeTruthy();
  });

  test('should get a specific product history', async ({ request }) => {
    const response = await request.get(`/product-historys/get-one/${historyId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.id).toBe(historyId);
  });

  test('should update a product history', async ({ request }) => {
    const updateData = {
      id: historyId,
      productId: 1,
      warehouseId: 1,
      type: 'INVENTORY',
      quantity: 15,
      note: 'Updated history entry'
    };

    const response = await request.put('/product-historys/update', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: updateData
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.quantity).toBe(updateData.quantity);
  });

  test('should delete a product history', async ({ request }) => {
    const response = await request.delete(`/product-historys/delete/${historyId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
  });
}); 