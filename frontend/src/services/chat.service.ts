import axios, { AxiosError } from 'axios';

// Interfaces mapping to Backend Models
export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  message: string;
  provider: string;
  timestamp: string;
  status: string;
  intent?: string;
  structured_data?: Record<string, any>[] | null;
  record_count?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const chatService = {
  /**
   * Sends a message to the backend AI chat endpoint.
   * @param message The user's query text
   * @returns The ChatResponse from the AI
   */
  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      // Retrieve token from zustand persisted storage
      const storageStr = localStorage.getItem('kcia-auth-storage');
      let token = '';
      if (storageStr) {
        try {
          const authData = JSON.parse(storageStr);
          token = authData?.state?.token || '';
        } catch (e) {
          console.error("Failed to parse auth storage");
        }
      }

      if (!token) {
        throw new Error("Authentication failed. Please log in again.");
      }

      const response = await axios.post<ChatResponse>(
        `${API_BASE_URL}/chat/`,
        { query: message },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 60000,
        }
      );
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.error('Chat API Error Data:', axiosError.response.data);
          
          if (axiosError.response.status === 401 || axiosError.response.status === 403) {
             throw new Error("Authentication failed. Please log in again.");
          }
          if (axiosError.response.status === 429) {
             throw new Error("Too many requests. Please try again later.");
          }
          if (axiosError.response.status >= 500) {
             throw new Error("Backend server encountered an error processing the AI response.");
          }
        } else if (axiosError.request) {
          console.error('Chat API Network/Timeout Error:', axiosError.request);
          throw new Error("Network error or timeout. The AI service took too long to respond.");
        }
      }
      throw new Error("An unexpected error occurred while communicating with the assistant.");
    }
  }
};
