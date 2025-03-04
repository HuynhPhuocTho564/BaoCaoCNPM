interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
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

  static async login(data: LoginData) {
    const response = await fetch('/api/auth/login', {
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

  static async updateUsername(newUsername: string) {
    const response = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: newUsername }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    return result;
  }

  static async updatePassword(currentPassword: string, newPassword: string) {
    const response = await fetch('/api/user/password', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    return result;
  }

  static async deleteAccount(password: string) {
    const response = await fetch('/api/user/account', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    return result;
  }

  static async updateAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch('/api/user/avatar', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    return result;
  }
} 