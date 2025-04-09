import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';

test.describe('Products API', () => {
  let authToken: string;
  let productId: number;

  test.beforeAll(async ({ request }) => {
    authToken = await AuthHelper.login(request);
  });

  test('should create a new product', async ({ request }) => {
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
      productCode: 'PROD-' + Date.now(),
      idRackReallocate: 1,
      imageProduct: 'base64_image_string',
      imageQRCode: 'base64_qr_string',
      imageBarcode: 'base64_barcode_string',
      blockId: 1,
      supplierId: 1,
      productCategoryId: 1,
      rackId: 1,
      receiptId: 1,
      zoneId: 1,
      orderId: 1,
      packageId: 1,
      masterProductId: 1,
      note: 'Test product note',
      barCode: 'BAR-' + Date.now()
    };

    const response = await request.post('/products/create', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: productData
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    productId = responseBody.id;
    expect(responseBody.name).toBe(productData.name);
  });

  test('should get all products', async ({ request }) => {
    const response = await request.get('/products/get-all', {
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

  test('should get product inventory', async ({ request }) => {
    const response = await request.get('/products/get-inventory', {
      headers: await AuthHelper.getAuthHeader(authToken),
      params: {
        page: 1,
        limit: 10,
        warehouseId: 1
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBeTruthy();
  });

  test('should update a product', async ({ request }) => {
    const updateData = {
      id: productId,
      name: 'Updated Product',
      totalQuantity: 150,
      expectedQuantity: 150,
      importDate: new Date().toISOString(),
      cost: 11.99,
      salePrice: 21.99,
      warehouseId: 1,
      inboundKind: 'NEW',
      expireDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      productCode: 'PROD-' + Date.now(),
      idRackReallocate: 1,
      imageProduct: 'base64_image_string',
      imageQRCode: 'base64_qr_string',
      imageBarcode: 'base64_barcode_string',
      blockId: 1,
      supplierId: 1,
      productCategoryId: 1,
      rackId: 1,
      receiptId: 1,
      zoneId: 1,
      orderId: 1,
      packageId: 1,
      masterProductId: 1,
      note: 'Updated product note',
      barCode: 'BAR-' + Date.now(),
      status: 'STORED'
    };

    const response = await request.put('/products/update', {
      headers: await AuthHelper.getAuthHeader(authToken),
      data: updateData
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.name).toBe(updateData.name);
  });

  test('should delete a product', async ({ request }) => {
    const response = await request.delete(`/products/delete/${productId}`, {
      headers: await AuthHelper.getAuthHeader(authToken)
    });

    expect(response.status()).toBe(200);
  });
}); 