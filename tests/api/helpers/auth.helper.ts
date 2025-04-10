import { APIRequestContext } from '@playwright/test';

export class AuthHelper {
  private static managerToken: string;
  private static supervisorToken: string;
  private static staffToken: string;

  static async loginManagerCredential(request: APIRequestContext): Promise<string> {
    if (this.managerToken) {
      return this.managerToken;
    }

    const response = await request.post('/auth/login', {
      data: {
        username: 'huynh22.manager',
        password: 'Snowfox1991'
      }
    });

    const responseBody = await response.json();
    this.managerToken = responseBody.access_token;
    return this.managerToken;
  }

  static async loginSupervisorCredential(request: APIRequestContext): Promise<string> {
    if (this.supervisorToken) {
      return this.supervisorToken;
    }

    const response = await request.post('/auth/login', {
      data: {
        username: 'huynh22.supervisor',
        password: 'Snowfox1991'
      }
    });

    const responseBody = await response.json();
    this.supervisorToken = responseBody.access_token;
    return this.supervisorToken;
  }

  static async loginStaffCredential(request: APIRequestContext): Promise<string> {
    if (this.staffToken) {
      return this.staffToken;
    }

    const response = await request.post('/auth/login', {
      data: {
        username: 'huynh22.staff',
        password: 'Snowfox1991'
      }
    });

    const responseBody = await response.json();
    this.staffToken = responseBody.access_token;
    return this.staffToken;
  }

  static async getAuthHeader(token: string) {
    return {
      Authorization: `Bearer ${token}`
    };
  }
} 