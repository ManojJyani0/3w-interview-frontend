/**
 * API Service Layer
 * Centralized HTTP client for all API calls
 * Supports cookie-based authentication
 * Follows backend-api-integration.md guidelines
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

interface RequestConfig extends RequestInit {
  data?: any
}

class ApiService {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  /**
   * Get headers for request
   * Note: Cookies are automatically sent by the browser
   * No need to manually add Authorization header
   */
  private getHeaders(customHeaders?: HeadersInit): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders,
    }

    return headers
  }

  /**
   * Generic request handler
   * Cookies are automatically included with credentials: 'include'
   * Follows backend API integration guidelines
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { data, headers: customHeaders, ...restConfig } = config

    const headers = this.getHeaders(customHeaders)

    // Ensure endpoint starts with /api
    const normalizedEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`

    const response = await fetch(`${this.baseURL}${normalizedEndpoint}`, {
      ...restConfig,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include', // Important: Include cookies as per backend guidelines
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.error || error.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * HTTP Methods
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'POST', data })
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', data })
  }

  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', data })
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' })
  }
}

// Export singleton instance
export const api = new ApiService(API_BASE_URL)
export default api
