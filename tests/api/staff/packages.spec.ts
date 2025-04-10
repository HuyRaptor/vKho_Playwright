import { test, expect } from '@playwright/test';
import { AuthHelper } from '../helpers/auth.helper';

test.describe('Packages API - Staff Role', () => {
  let authToken: string;
  let packageId: number;

  test.beforeAll(async ({ request }) => {
    authToken = await AuthHelper.loginStaffCredential(request);
  });

  test('should get all packages', async ({ request }) => {
    const response = await request.get('/packages/get-all', {
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
    
    // Store a package ID for later tests
    if (responseBody.length > 0) {
      packageId = responseBody[0].id;
    }
  });

  test('should get a specific package', async ({ request }) => {
    // First get all packages to find an existing one if we don't have one
    if (!packageId) {
      const getAllResponse = await request.get('/packages/get-all', {
        headers: await AuthHelper.getAuthHeader(authToken),
        params: {
          page: 1,
          limit: 1
        }
      });

      const packages = await getAllResponse.json();
      expect(packages.length).toBeGreaterThan(0);
      packageId = packages[0].id;
    }

    const response = await request.get(`/packages/get-one/${packageId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.id).toBe(packageId);
  });

  // Staff should not be able to create packages
  test('should not be able to create a package', async ({ request }) => {
    const packageData = {
      orderId: 1,
      warehouseId: 1,
      zoneId: 1
    };

    const response = await request.post('/packages/create', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: packageData
    });

    expect(response.status()).toBe(403);
  });

  // Staff should not be able to update packages
  test('should not be able to update a package', async ({ request }) => {
    expect(packageId).toBeDefined();
    const updateData = {
      orderId: 1,
      warehouseId: 1,
      zoneId: 1,
      id: packageId,
      status: 'ENABLE'
    };

    const response = await request.put('/packages/update', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: updateData
    });

    expect(response.status()).toBe(403);
  });

  // Staff should not be able to delete packages
  test('should not be able to delete a package', async ({ request }) => {
    expect(packageId).toBeDefined();
    const response = await request.delete(`/packages/delete/${packageId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(403);
  });
}); 