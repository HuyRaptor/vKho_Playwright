import { test, expect } from '@playwright/test';
import { AuthHelper } from '../helpers/auth.helper';

test.describe('Products API - Staff Role', () => {
  let authToken: string;
  let productId: number;

  test.beforeAll(async ({ request }) => {
    authToken = await AuthHelper.loginStaffCredential(request);
  });

  test('should get all products', async ({ request }) => {
    const response = await request.get('/products/get-all', {
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
    
    // Store a product ID for later tests
    if (responseBody.length > 0) {
      productId = responseBody[0].id;
    }
  });

  test('should get product inventory', async ({ request }) => {
    const response = await request.get('/products/get-inventory', {
      headers: await AuthHelper.getAuthHeader(authToken),
      params: {
        page: 1,
        limit: 10
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBeTruthy();
  });

  test('should get a specific product', async ({ request }) => {
    // First get all products to find an existing one if we don't have one
    if (!productId) {
      const getAllResponse = await request.get('/products/get-all', {
        headers: await AuthHelper.getAuthHeader(authToken),
        params: {
          page: 1,
          limit: 1
        }
      });

      const products = await getAllResponse.json();
      expect(products.length).toBeGreaterThan(0);
      productId = products[0].id;
    }

    const response = await request.get(`/products/get-one/${productId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.id).toBe(productId);
  });

  // Staff should not be able to create products
  test('should not be able to create a product', async ({ request }) => {
    const productData = {
      name: 'Test Product',
      totalQuantity: 100,
      expectedQuantity: 100,
      importDate: new Date().toISOString(),
      cost: 10.99,
      salePrice: 19.99,
      warehouseId: 1,
      inboundKind: 'NEW',
      expireDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      productCode: 'TEST-' + Date.now(),
      idRackReallocate: 1,
      imageProduct: 'product.jpg',
      imageQRCode: 'qrcode.jpg',
      imageBarcode: 'barcode.jpg',
      blockId: 1,
      supplierId: 1,
      productCategoryId: 1,
      rackId: 1,
      receiptId: 1,
      zoneId: 1,
      orderId: 1,
      packageId: 1,
      masterProductId: 1,
      note: 'Test product',
      barCode: 'BAR-' + Date.now()
    };

    const response = await request.post('/products/create', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: productData
    });

    expect(response.status()).toBe(403);
  });

  // Staff should not be able to update products
  test('should not be able to update a product', async ({ request }) => {
    expect(productId).toBeDefined();
    const updateData = {
      id: productId,
      name: 'Updated Product',
      totalQuantity: 150,
      expectedQuantity: 150,
      importDate: new Date().toISOString(),
      cost: 15.99,
      salePrice: 25.99,
      warehouseId: 1,
      inboundKind: 'NEW',
      expireDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      productCode: 'UPD-' + Date.now(),
      idRackReallocate: 1,
      imageProduct: 'updated-product.jpg',
      imageQRCode: 'updated-qrcode.jpg',
      imageBarcode: 'updated-barcode.jpg',
      blockId: 1,
      supplierId: 1,
      productCategoryId: 1,
      rackId: 1,
      receiptId: 1,
      zoneId: 1,
      orderId: 1,
      packageId: 1,
      masterProductId: 1,
      note: 'Updated test product',
      barCode: 'UPD-BAR-' + Date.now(),
      description: 'Updated description',
      lostDate: new Date().toISOString(),
      status: 'ENABLE',
      lostNumber: 0
    };

    const response = await request.put('/products/update', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: updateData
    });

    expect(response.status()).toBe(403);
  });

  // Staff should not be able to delete products
  test('should not be able to delete a product', async ({ request }) => {
    expect(productId).toBeDefined();
    const response = await request.delete(`/products/delete/${productId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(403);
  });
}); 