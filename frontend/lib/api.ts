const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return {
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers = {
      ...this.getAuthHeaders(),
      ...(options.headers as Record<string, string>),
    };

    // Don't set Content-Type for FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      throw new Error('Server did not return valid JSON');
    }

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  }

  // Media API methods
  async getMedia(params?: Record<string, string>): Promise<ApiResponse> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/media${queryString}`);
  }

  async getMediaById(id: number): Promise<ApiResponse> {
    return this.request(`/media/${id}`);
  }

  async uploadMedia(formData: FormData): Promise<ApiResponse> {
    return this.request('/media', {
      method: 'POST',
      body: formData,
    });
  }

  async deleteMedia(id: number): Promise<ApiResponse> {
    return this.request(`/media/${id}`, {
      method: 'DELETE',
    });
  }

  async retryOptimization(id: number): Promise<ApiResponse> {
    return this.request(`/media/${id}/retry-optimization`, {
      method: 'POST',
    });
  }

  async getUploadUrl(params: {
    filename: string;
    mime_type: string;
    size: number;
  }): Promise<ApiResponse> {
    return this.request('/media/upload-url', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Product API methods
  async getProducts(params?: Record<string, string>): Promise<ApiResponse> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/products${queryString}`);
  }

  async getProductBySlug(slug: string): Promise<ApiResponse> {
    return this.request(`/products/${slug}`);
  }

  async getProductFilters(): Promise<ApiResponse> {
    return this.request('/products/filters');
  }

  async getFeaturedProducts(): Promise<ApiResponse> {
    return this.request('/products/featured');
  }

  async getRelatedProducts(productId: number): Promise<ApiResponse> {
    return this.request(`/products/${productId}/related`);
  }

  async getProductsByCategory(category: string): Promise<ApiResponse> {
    return this.request(`/products/category/${category}`);
  }
}

export const apiService = new ApiService();

