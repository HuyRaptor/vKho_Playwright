import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';

test.describe('Receipts API', () => {
  let authToken: string;
  let receiptId: number;

  test.beforeAll(async ({ request }) => {
    authToken = await AuthHelper.loginManagerCredential(request);
  });

  test('should create a new receipt', async ({ request }) => {
    const receiptData = {
      code: 'REC-' + Date.now(),
      warehouseId: 1,
      status: 'NEW',
      supplierId: 1
    };

    const response = await request.post('/receipts/create', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: receiptData
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    receiptId = responseBody.id;
    expect(responseBody.code).toBe(receiptData.code);
  });

  test('should get all receipts', async ({ request }) => {
    const response = await request.get('/receipts/get-all', {
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

  test('should get a specific receipt', async ({ request }) => {
    const response = await request.get(`/receipts/get-one/${receiptId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.id).toBe(receiptId);
  });

  test('should update a receipt', async ({ request }) => {
    const updateData = {
      id: receiptId,
      code: 'REC-UPDATE-' + Date.now(),
      warehouseId: 1,
      status: 'CONFIRMED',
      supplierId: 1
    };

    const response = await request.put('/receipts/update', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: updateData
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.code).toBe(updateData.code);
  });

  test('should confirm a receipt', async ({ request }) => {
    const confirmData = {
      id: receiptId,
      status: 'CONFIRMED'
    };

    const response = await request.put('/receipts/confirm', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: confirmData
    });

    expect(response.status()).toBe(200);
  });

  test('should delete a receipt', async ({ request }) => {
    const response = await request.delete(`/receipts/delete/${receiptId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
  });

  test('should delete multiple receipts', async ({ request }) => {
    const deleteData = {
      ids: [receiptId]
    };

    const response = await request.post('/receipts/deletes', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: deleteData
    });

    expect(response.status()).toBe(201);
  });
}); 