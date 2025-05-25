/**
 * Module API cơ sở sử dụng Axios cho ChatStoryAI
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_BASE_URL, API_CONFIG, ENDPOINTS } from "./constants.js";
import { ENV } from "../config/config.js";

/**
 * Lớp API cơ sở sử dụng Axios cho ChatStoryAI
 */
export class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string = API_BASE_URL, apiKey?: string) {
    // Khởi tạo Axios instance với cấu hình cơ bản
    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    // Thêm Authorization header nếu có API key
    const finalApiKey = apiKey || ENV.CHATSTORYAI_API_KEY;
    if (finalApiKey) {
      headers["Authorization"] = `Bearer ${finalApiKey}`;
    }

    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout: API_CONFIG.TIMEOUT,
      headers,
    });

    // Thêm interceptor xử lý lỗi
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: any) => {
        if (error.response) {
          console.error(
            `Lỗi API: ${error.response.status} ${error.response.statusText}`
          );
        } else if (error.request) {
          console.error("Lỗi kết nối: Không nhận được phản hồi");
        } else {
          console.error(`Lỗi: ${error.message}`);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Thực hiện yêu cầu GET
   * @param endpoint Endpoint API
   * @param params Tham số truy vấn
   * @returns Dữ liệu phản hồi
   */
  async get<T>(
    endpoint: string,
    params: Record<string, string> = {}
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi gọi GET ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Thực hiện yêu cầu POST
   * @param endpoint Endpoint API
   * @param data Dữ liệu gửi đi
   * @returns Dữ liệu phản hồi
   */
  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi gọi POST ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Thực hiện yêu cầu PUT
   * @param endpoint Endpoint API
   * @param data Dữ liệu gửi đi
   * @returns Dữ liệu phản hồi
   */
  async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await this.axiosInstance.put<T>(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi gọi PUT ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Thực hiện yêu cầu DELETE
   * @param endpoint Endpoint API
   * @param params Tham số truy vấn (tùy chọn)
   * @returns Dữ liệu phản hồi
   */
  async delete<T>(
    endpoint: string,
    params: Record<string, string> = {}
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.delete<T>(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi gọi DELETE ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Thực hiện yêu cầu PATCH
   * @param endpoint Endpoint API
   * @param data Dữ liệu gửi đi
   * @returns Dữ liệu phản hồi
   */
  async patch<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await this.axiosInstance.patch<T>(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi gọi PATCH ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Thực hiện yêu cầu POST với multipart/form-data
   * @param endpoint Endpoint API
   * @param formData FormData object
   * @returns Dữ liệu phản hồi
   */
  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi gọi POST FormData ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Thực hiện yêu cầu PUT với multipart/form-data
   * @param endpoint Endpoint API
   * @param formData FormData object
   * @returns Dữ liệu phản hồi
   */
  async putFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    try {
      const response = await this.axiosInstance.put<T>(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi gọi PUT FormData ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Thực hiện yêu cầu GET với query parameters
   * @param endpoint Endpoint API
   * @param params Query parameters
   * @returns Dữ liệu phản hồi
   */
  async getWithParams<T>(
    endpoint: string,
    params: Record<string, any> = {}
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi gọi GET ${endpoint}:`, error);
      throw error;
    }
  }
}
