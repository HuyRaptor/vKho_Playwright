import { APIRequestContext } from '@playwright/test';

export class AuthHelper {
  private static token: string;

  static async login(request: APIRequestContext): Promise<string> {
    if (this.token) {
      return this.token;
    }

    const response = await request.post('/auth/login', {
      data: {
        username: 'huynh22.manager',
        password: 'Snowfox1991'
      }
    });

    const responseBody = await response.json();
    this.token = responseBody.access_token;
    return this.token;
  }

  static async getAuthHeader(token: string) {
    return {
      Authorization: `Bearer ${token}`
    };
  }
} 