import { test, expect } from '@playwright/test';
import { AuthHelper } from '../helpers/auth.helper';

test.describe('Orders API - Staff Role', () => {
  let authToken: string;
  let orderId: number;

  test.beforeAll(async ({ request }) => {
    authToken = await AuthHelper.loginStaffCredential(request);
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
    
    // Store an order ID for later tests
    if (responseBody.length > 0) {
      orderId = responseBody[0].id;
    }
  });

  test('should get a specific order', async ({ request }) => {
    // First get all orders to find an existing one if we don't have one
    if (!orderId) {
      const getAllResponse = await request.get('/orders/get-all', {
        headers: await AuthHelper.getAuthHeader(authToken),
        params: {
          page: 1,
          limit: 1
        }
      });

      const orders = await getAllResponse.json();
      expect(orders.length).toBeGreaterThan(0);
      orderId = orders[0].id;
    }

    const response = await request.get(`/orders/get-one/${orderId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.id).toBe(orderId);
  });

  // Staff should not be able to create orders
  test('should not be able to create an order', async ({ request }) => {
    const orderData = {
      nameCustomer: 'Test Customer',
      code: 'ORD-' + Date.now(),
      boothCode: 'BOOTH-' + Date.now(),
      deliveryAdress: '123 Test Street',
      deliveryTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      driverName: 'Test Driver',
      warehouseId: 1,
      productOrders: [
        {
          total: 10,
          boothCode: 'BOOTH-' + Date.now(),
          sku: 'SKU-' + Date.now()
        }
      ]
    };

    const response = await request.post('/orders/create', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: orderData
    });

    expect(response.status()).toBe(403);
  });

  // Staff should not be able to update orders
  test('should not be able to update an order', async ({ request }) => {
    expect(orderId).toBeDefined();
    const updateData = {
      id: orderId,
      boothCode: 'UPD-BOOTH-' + Date.now(),
      deliveryAdress: '456 Updated Street',
      deliveryTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      driverName: 'Updated Driver',
      status: 'ENABLE',
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

    expect(response.status()).toBe(403);
  });

  // Staff should not be able to delete orders
  test('should not be able to delete an order', async ({ request }) => {
    expect(orderId).toBeDefined();
    const response = await request.delete(`/orders/delete/${orderId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(403);
  });
}); 