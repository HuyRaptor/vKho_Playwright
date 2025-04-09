import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';

test.describe('Product Orders API', () => {
  let authToken: string;
  let productOrderId: number;

  test.beforeAll(async ({ request }) => {
    authToken = await AuthHelper.login(request);
  });

  test('should create a new product order', async ({ request }) => {
    const productOrderData = {
      total: 10,
      boothCode: 'BOOTH-001',
      sku: 'SKU-001'
    };

    const response = await request.post('/product-orders/create', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: productOrderData
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    productOrderId = responseBody.id;
    expect(responseBody.total).toBe(productOrderData.total);
  });

  test('should get all product orders', async ({ request }) => {
    const response = await request.get('/product-orders/get-all', {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBeTruthy();
  });

  test('should get a specific product order', async ({ request }) => {
    const response = await request.get(`/product-orders/get-one/${productOrderId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.id).toBe(productOrderId);
  });

  test('should update a product order', async ({ request }) => {
    const updateData = {
      id: productOrderId,
      total: 15,
      boothCode: 'BOOTH-002',
      sku: 'SKU-002'
    };

    const response = await request.put('/product-orders/update', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: updateData
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.total).toBe(updateData.total);
  });

  test('should delete a product order', async ({ request }) => {
    const response = await request.delete(`/product-orders/delete/${productOrderId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
  });
}); 