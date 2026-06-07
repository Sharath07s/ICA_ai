import axios from 'axios';

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const authService = {
  /**
   * Logs in a user using badge number and password
   * @param badge_number 
   * @param password 
   * @returns 
   */
  async login(badge_number: string, password: string): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append('username', badge_number);
    formData.append('password', password);

    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/auth/login`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  }
};
