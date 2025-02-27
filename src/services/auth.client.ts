interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export class AuthClient {
  static async register(data: RegisterData) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    return result;
  }
} 