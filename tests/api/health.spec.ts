import { test, expect } from '@playwright/test';

test.describe('API Health Check', () => {
  test('should return 200 OK for health endpoint', async ({ request }) => {
    // Make a GET request to the health endpoint
    const response = await request.get('/health');
    
    // Assert the response status is 200
    expect(response.status()).toBe(200);
    
    // Assert the response body contains expected data
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('status', 'ok');
  });
}); 