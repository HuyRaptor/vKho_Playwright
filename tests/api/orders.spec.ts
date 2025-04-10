import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';

test.describe('Orders API', () => {
  let authToken: string;
  let orderId: number;

  test.beforeAll(async ({ request }) => {
    authToken = await AuthHelper.loginManagerCredential(request);
  });

  test('should create a new order', async ({ request }) => {
    const orderData = {
      nameCustomer: 'Test Customer',
      code: 'ORD-' + Date.now(),
      boothCode: 'BOOTH-001',
      deliveryAdress: '123 Test Street',
      deliveryTime: new Date().toISOString(),
      driverName: 'Test Driver',
      warehouseId: 1,
      productOrders: [
        {
          total: 10,
          boothCode: 'BOOTH-001',
          sku: 'SKU-001'
        }
      ]
    };

    const response = await request.post('/orders/create', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: orderData
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    orderId = responseBody.id;
    expect(responseBody.code).toBe(orderData.code);
  });

  test('should get all orders', async ({ request }) => {
    const response = await request.get('/orders/get-all', {
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

  test('should get a specific order', async ({ request }) => {
    const response = await request.get(`/orders/get-one/${orderId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.id).toBe(orderId);
  });

  test('should update an order', async ({ request }) => {
    const updateData = {
      id: orderId,
      boothCode: 'BOOTH-002',
      deliveryAdress: '456 Updated Street',
      deliveryTime: new Date().toISOString(),
      driverName: 'Updated Driver',
      status: 'PICKING',
      updateProductOrder: [
        {
          id: 1,
          pickingQuantity: 5
        }
      ]
    };

    const response = await request.put('/orders/update', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: updateData
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.boothCode).toBe(updateData.boothCode);
  });

  test('should delete an order', async ({ request }) => {
    const response = await request.delete(`/orders/delete/${orderId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
  });
}); 