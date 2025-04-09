import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';

test.describe('Packages API', () => {
  let authToken: string;
  let packageId: number;

  test.beforeAll(async ({ request }) => {
    authToken = await AuthHelper.login(request);
  });

  test('should create a new package', async ({ request }) => {
    const packageData = {
      code: 'PKG-' + Date.now(),
      name: 'Test Package',
      warehouseId: 1,
      status: 'NEW',
      orderId: 1
    };

    const response = await request.post('/packages/create', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: packageData
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('id');
    packageId = responseBody.id;
    expect(responseBody.code).toBe(packageData.code);
  });

  test('should get all packages', async ({ request }) => {
    const response = await request.get('/packages/get-all', {
      headers: await AuthHelper.getAuthHeader(authToken),
      params: {
        page: 1,
        limit: 10,
        sortBy: 'id',
        sortDirection: 'desc',
        warehouseId: 1,
        packadeCode: 'PKG-',
        status: 'NEW',
        orderId: 1
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBeTruthy();
  });

  test('should get a specific package', async ({ request }) => {
    expect(packageId).toBeDefined();
    const response = await request.get(`/packages/get-one/${packageId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.id).toBe(packageId);
  });

  test('should update a package', async ({ request }) => {
    expect(packageId).toBeDefined();
    const updateData = {
      id: packageId,
      code: 'PKG-UPDATE-' + Date.now(),
      name: 'Updated Package',
      warehouseId: 1,
      status: 'SHIPPING',
      orderId: 1
    };

    const response = await request.put('/packages/update', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: updateData
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.name).toBe(updateData.name);
  });

  test('should update multiple packages', async ({ request }) => {
    expect(packageId).toBeDefined();
    const updateMultipleData = {
      ids: [packageId],
      status: 'SHIPPING'
    };

    const response = await request.put('/packages/update-multiple', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: updateMultipleData
    });

    expect(response.status()).toBe(200);
  });

  test('should delete a package', async ({ request }) => {
    expect(packageId).toBeDefined();
    const response = await request.delete(`/packages/delete/${packageId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
  });
}); 