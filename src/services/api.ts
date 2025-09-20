// src/services/api.ts
import { Preferences } from '@capacitor/preferences';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.agrinote.com/v1';
const API_TIMEOUT = 10000;

// Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Treatment {
  id: string;
  description: string;
  date: string;
  crop: string;
  product: string;
  productId: string;
  dose: number;
  unit: string;
  area: number;
  method: string;
  weather?: WeatherCondition;
  notes?: string;
  status: 'planned' | 'completed' | 'overdue';
  createdBy: 'manual' | 'voice' | 'import';
  aiValidation?: AIValidation;
  coordinates?: GeoCoordinate;
  photos?: string[];
  cost?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'pesticide' | 'fertilizer' | 'seed' | 'equipment';
  quantity: number;
  unit: string;
  minStock: number;
  maxStock?: number;
  supplier: string;
  supplierId: string;
  expiryDate?: string;
  batchNumber?: string;
  barcode?: string;
  location?: string;
  cost?: number;
  notes?: string;
  activeIngredients?: string[];
  certifications?: string[];
  hazardLevel?: 'low' | 'medium' | 'high';
  storageRequirements?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Fertilization {
  id: string;
  description: string;
  date: string;
  crop: string;
  fertilizerType: string;
  productId: string;
  dose: number;
  unit: string;
  area: number;
  method: string;
  npkRatio?: string;
  organicContent?: number;
  soilTestResults?: SoilTest;
  notes?: string;
  status: 'planned' | 'completed' | 'overdue';
  cost?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  templateId: string;
  name: string;
  type: 'compliance' | 'operational' | 'inventory' | 'financial';
  parameters: ReportParameters;
  status: 'generating' | 'ready' | 'error' | 'expired';
  fileUrl?: string;
  fileSize?: string;
  format: 'pdf' | 'excel' | 'csv';
  createdAt: string;
  expiresAt?: string;
}

export interface Farm {
  id: string;
  name: string;
  owner: string;
  location: GeoCoordinate;
  totalArea: number;
  crops: CropArea[];
  certifications: string[];
  settings: FarmSettings;
}

export interface WeatherCondition {
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  condition: string;
  rainfall: number;
  suitable: boolean;
  warnings?: string[];
}

export interface AIValidation {
  status: 'valid' | 'warning' | 'error';
  message: string;
  confidence: number;
  suggestions?: string[];
}

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface SoilTest {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  testDate: string;
}

export interface CropArea {
  id: string;
  name: string;
  variety: string;
  area: number;
  plantingDate: string;
  expectedHarvest: string;
  coordinates: GeoCoordinate[];
}

export interface FarmSettings {
  units: 'metric' | 'imperial';
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  integrations: IntegrationSettings;
}

export interface NotificationSettings {
  treatments: boolean;
  weather: boolean;
  inventory: boolean;
  reports: boolean;
  email: boolean;
  push: boolean;
}

export interface IntegrationSettings {
  weather: {
    provider: string;
    apiKey?: string;
  };
  erp: {
    enabled: boolean;
    provider?: string;
    endpoint?: string;
  };
}

export interface ReportParameters {
  dateFrom?: string;
  dateTo?: string;
  crops?: string[];
  categories?: string[];
  includePhotos: boolean;
  includeWeather: boolean;
}

// API Client Class
class ApiClient {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  async setAuthToken(token: string): Promise<void> {
    this.headers = {
      ...this.headers,
      'Authorization': `Bearer ${token}`,
    };
    await Preferences.set({ key: 'auth_token', value: token });
  }

  async getAuthToken(): Promise<string | null> {
    const result = await Preferences.get({ key: 'auth_token' });
    return result.value;
  }

  async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await this.getAuthToken();
      if (token) {
        this.headers = {
          ...this.headers,
          'Authorization': `Bearer ${token}`,
        };
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: { ...this.headers, ...options.headers },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Service Classes
export class TreatmentService {
  constructor(private api: ApiClient) {}

  async getTreatments(page = 1, pageSize = 20): Promise<ApiResponse<PaginatedResponse<Treatment>>> {
    return this.api.get(`/treatments?page=${page}&pageSize=${pageSize}`);
  }

  async getTreatment(id: string): Promise<ApiResponse<Treatment>> {
    return this.api.get(`/treatments/${id}`);
  }

  async createTreatment(treatment: Omit<Treatment, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Treatment>> {
    return this.api.post('/treatments', treatment);
  }

  async updateTreatment(id: string, treatment: Partial<Treatment>): Promise<ApiResponse<Treatment>> {
    return this.api.put(`/treatments/${id}`, treatment);
  }

  async deleteTreatment(id: string): Promise<ApiResponse<void>> {
    return this.api.delete(`/treatments/${id}`);
  }

  async validateTreatment(treatment: Partial<Treatment>): Promise<ApiResponse<AIValidation>> {
    return this.api.post('/treatments/validate', treatment);
  }

  async parseVoiceInput(transcript: string): Promise<ApiResponse<Partial<Treatment>>> {
    return this.api.post('/treatments/parse-voice', { transcript });
  }
}

export class ProductService {
  constructor(private api: ApiClient) {}

  async getProducts(category?: string): Promise<ApiResponse<Product[]>> {
    const endpoint = category ? `/products?category=${category}` : '/products';
    return this.api.get(endpoint);
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return this.api.get(`/products/${id}`);
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Product>> {
    return this.api.post('/products', product);
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.api.put(`/products/${id}`, product);
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return this.api.delete(`/products/${id}`);
  }

  async scanBarcode(barcode: string): Promise<ApiResponse<Partial<Product>>> {
    return this.api.post('/products/scan-barcode', { barcode });
  }

  async getLowStockProducts(): Promise<ApiResponse<Product[]>> {
    return this.api.get('/products/low-stock');
  }

  async getExpiringProducts(days = 90): Promise<ApiResponse<Product[]>> {
    return this.api.get(`/products/expiring?days=${days}`);
  }
}

export class FertilizationService {
  constructor(private api: ApiClient) {}

  async getFertilizations(): Promise<ApiResponse<Fertilization[]>> {
    return this.api.get('/fertilizations');
  }

  async createFertilization(fertilization: Omit<Fertilization, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Fertilization>> {
    return this.api.post('/fertilizations', fertilization);
  }

  async updateFertilization(id: string, fertilization: Partial<Fertilization>): Promise<ApiResponse<Fertilization>> {
    return this.api.put(`/fertilizations/${id}`, fertilization);
  }

  async deleteFertilization(id: string): Promise<ApiResponse<void>> {
    return this.api.delete(`/fertilizations/${id}`);
  }
}

export class ReportService {
  constructor(private api: ApiClient) {}

  async getReports(): Promise<ApiResponse<Report[]>> {
    return this.api.get('/reports');
  }

  async generateReport(templateId: string, parameters: ReportParameters): Promise<ApiResponse<Report>> {
    return this.api.post('/reports/generate', { templateId, parameters });
  }

  async getReportStatus(id: string): Promise<ApiResponse<Report>> {
    return this.api.get(`/reports/${id}/status`);
  }

  async downloadReport(id: string): Promise<ApiResponse<{ url: string }>> {
    return this.api.get(`/reports/${id}/download`);
  }

  async deleteReport(id: string): Promise<ApiResponse<void>> {
    return this.api.delete(`/reports/${id}`);
  }

  async getReportTemplates(): Promise<ApiResponse<any[]>> {
    return this.api.get('/reports/templates');
  }
}

export class WeatherService {
  constructor(private api: ApiClient) {}

  async getCurrentWeather(): Promise<ApiResponse<WeatherCondition>> {
    return this.api.get('/weather/current');
  }

  async getWeatherForecast(days = 7): Promise<ApiResponse<WeatherCondition[]>> {
    return this.api.get(`/weather/forecast?days=${days}`);
  }

  async getWeatherAlerts(): Promise<ApiResponse<any[]>> {
    return this.api.get('/weather/alerts');
  }
}

export class FarmService {
  constructor(private api: ApiClient) {}

  async getFarm(): Promise<ApiResponse<Farm>> {
    return this.api.get('/farm');
  }

  async updateFarm(farm: Partial<Farm>): Promise<ApiResponse<Farm>> {
    return this.api.put('/farm', farm);
  }

  async getCrops(): Promise<ApiResponse<CropArea[]>> {
    return this.api.get('/farm/crops');
  }

  async addCrop(crop: Omit<CropArea, 'id'>): Promise<ApiResponse<CropArea>> {
    return this.api.post('/farm/crops', crop);
  }
}

export class NotificationService {
  constructor(private api: ApiClient) {}

  async getNotifications(): Promise<ApiResponse<any[]>> {
    return this.api.get('/notifications');
  }

  async markAsRead(id: string): Promise<ApiResponse<void>> {
    return this.api.put(`/notifications/${id}/read`, {});
  }

  async dismissNotification(id: string): Promise<ApiResponse<void>> {
    return this.api.delete(`/notifications/${id}`);
  }
}

// Export singleton instances
export const apiClient = new ApiClient();
export const treatmentService = new TreatmentService(apiClient);
export const productService = new ProductService(apiClient);
export const fertilizationService = new FertilizationService(apiClient);
export const reportService = new ReportService(apiClient);
export const weatherService = new WeatherService(apiClient);
export const farmService = new FarmService(apiClient);
export const notificationService = new NotificationService(apiClient);