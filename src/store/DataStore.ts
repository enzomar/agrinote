// src/store/DataStore.ts
import { Preferences } from '@capacitor/preferences';
import { 
  Treatment, 
  Product, 
  Fertilization, 
  Report, 
  WeatherCondition, 
  Farm, 
  treatmentService,
  productService,
  fertilizationService,
  reportService,
  weatherService,
  farmService,
  notificationService
} from '../services/api';

export interface AppState {
  // Data
  treatments: Treatment[];
  products: Product[];
  fertilizations: Fertilization[];
  reports: Report[];
  weather: WeatherCondition | null;
  farm: Farm | null;
  notifications: any[];
  
  // UI State
  loading: {
    treatments: boolean;
    products: boolean;
    fertilizations: boolean;
    reports: boolean;
    weather: boolean;
    farm: boolean;
  };
  
  // Error State
  errors: {
    treatments: string | null;
    products: string | null;
    fertilizations: string | null;
    reports: string | null;
    weather: string | null;
    farm: string | null;
  };
  
  // Sync State
  lastSync: {
    treatments: string | null;
    products: string | null;
    fertilizations: string | null;
    reports: string | null;
    weather: string | null;
  };
  
  // Offline State
  offline: boolean;
  pendingSync: {
    treatments: Array<{ action: 'create' | 'update' | 'delete', data: any, id?: string }>;
    products: Array<{ action: 'create' | 'update' | 'delete', data: any, id?: string }>;
    fertilizations: Array<{ action: 'create' | 'update' | 'delete', data: any, id?: string }>;
  };
}

type DataStoreListener = (state: AppState) => void;

export class DataStore {
  private state: AppState;
  private listeners: DataStoreListener[] = [];
  private syncIntervals: { [key: string]: NodeJS.Timeout } = {};

  constructor() {
    this.state = this.getInitialState();
    this.setupNetworkListener();
    this.startPeriodicSync();
  }

  private getInitialState(): AppState {
    return {
      treatments: [],
      products: [],
      fertilizations: [],
      reports: [],
      weather: null,
      farm: null,
      notifications: [],
      loading: {
        treatments: false,
        products: false,
        fertilizations: false,
        reports: false,
        weather: false,
        farm: false,
      },
      errors: {
        treatments: null,
        products: null,
        fertilizations: null,
        reports: null,
        weather: null,
        farm: null,
      },
      lastSync: {
        treatments: null,
        products: null,
        fertilizations: null,
        reports: null,
        weather: null,
      },
      offline: !navigator.onLine,
      pendingSync: {
        treatments: [],
        products: [],
        fertilizations: [],
      },
    };
  }

  // State Management
  getState(): AppState {
    return { ...this.state };
  }

  setState(updates: Partial<AppState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
    this.saveToStorage();
  }

  subscribe(listener: DataStoreListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Persistence
  private async saveToStorage(): Promise<void> {
    try {
      await Preferences.set({
        key: 'app_state',
        value: JSON.stringify({
          treatments: this.state.treatments,
          products: this.state.products,
          fertilizations: this.state.fertilizations,
          reports: this.state.reports,
          weather: this.state.weather,
          farm: this.state.farm,
          notifications: this.state.notifications,
          lastSync: this.state.lastSync,
          pendingSync: this.state.pendingSync,
        }),
      });
    } catch (error) {
      console.error('Failed to save state to storage:', error);
    }
  }

  async loadFromStorage(): Promise<void> {
    try {
      const result = await Preferences.get({ key: 'app_state' });
      if (result.value) {
        const savedState = JSON.parse(result.value);
        this.setState({
          ...this.state,
          ...savedState,
          loading: this.getInitialState().loading,
          errors: this.getInitialState().errors,
        });
      }
    } catch (error) {
      console.error('Failed to load state from storage:', error);
    }
  }

  // Network and Sync
  private setupNetworkListener(): void {
    window.addEventListener('online', () => {
      this.setState({ offline: false });
      this.syncPendingChanges();
    });

    window.addEventListener('offline', () => {
      this.setState({ offline: true });
    });
  }

  private startPeriodicSync(): void {
    // Sync treatments every 5 minutes
    this.syncIntervals.treatments = setInterval(() => {
      if (!this.state.offline) {
        this.syncTreatments();
      }
    }, 5 * 60 * 1000);

    // Sync products every 10 minutes
    this.syncIntervals.products = setInterval(() => {
      if (!this.state.offline) {
        this.syncProducts();
      }
    }, 10 * 60 * 1000);

    // Sync weather every 30 minutes
    this.syncIntervals.weather = setInterval(() => {
      if (!this.state.offline) {
        this.syncWeather();
      }
    }, 30 * 60 * 1000);
  }

  // Data Operations - Treatments
  async syncTreatments(): Promise<void> {
    if (this.state.loading.treatments) return;

    this.setState({
      loading: { ...this.state.loading, treatments: true },
      errors: { ...this.state.errors, treatments: null },
    });

    try {
      const response = await treatmentService.getTreatments();
      if (response.success && response.data) {
        this.setState({
          treatments: response.data.items,
          lastSync: { ...this.state.lastSync, treatments: new Date().toISOString() },
        });
      } else {
        throw new Error(response.error || 'Failed to fetch treatments');
      }
    } catch (error) {
      this.setState({
        errors: { ...this.state.errors, treatments: error instanceof Error ? error.message : 'Unknown error' },
      });
    } finally {
      this.setState({
        loading: { ...this.state.loading, treatments: false },
      });
    }
  }

  async createTreatment(treatment: Omit<Treatment, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> {
    if (this.state.offline) {
      // Queue for later sync
      this.setState({
        pendingSync: {
          ...this.state.pendingSync,
          treatments: [...this.state.pendingSync.treatments, { action: 'create', data: treatment }],
        },
        treatments: [
          ...this.state.treatments,
          { ...treatment, id: `temp_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Treatment,
        ],
      });
      return true;
    }

    try {
      const response = await treatmentService.createTreatment(treatment);
      if (response.success && response.data) {
        this.setState({
          treatments: [...this.state.treatments, response.data],
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to create treatment:', error);
      return false;
    }
  }

  async updateTreatment(id: string, updates: Partial<Treatment>): Promise<boolean> {
    if (this.state.offline) {
      // Update locally and queue for sync
      this.setState({
        treatments: this.state.treatments.map(t => t.id === id ? { ...t, ...updates } : t),
        pendingSync: {
          ...this.state.pendingSync,
          treatments: [...this.state.pendingSync.treatments, { action: 'update', id, data: updates }],
        },
      });
      return true;
    }

    try {
      const response = await treatmentService.updateTreatment(id, updates);
      if (response.success && response.data) {
        this.setState({
          treatments: this.state.treatments.map(t => t.id === id ? response.data! : t),
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update treatment:', error);
      return false;
    }
  }

  async deleteTreatment(id: string): Promise<boolean> {
    if (this.state.offline) {
      // Remove locally and queue for sync
      this.setState({
        treatments: this.state.treatments.filter(t => t.id !== id),
        pendingSync: {
          ...this.state.pendingSync,
          treatments: [...this.state.pendingSync.treatments, { action: 'delete', id, data: {} }],
        },
      });
      return true;
    }

    try {
      const response = await treatmentService.deleteTreatment(id);
      if (response.success) {
        this.setState({
          treatments: this.state.treatments.filter(t => t.id !== id),
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete treatment:', error);
      return false;
    }
  }

  // Data Operations - Products
  async syncProducts(): Promise<void> {
    if (this.state.loading.products) return;

    this.setState({
      loading: { ...this.state.loading, products: true },
      errors: { ...this.state.errors, products: null },
    });

    try {
      const response = await productService.getProducts();
      if (response.success && response.data) {
        this.setState({
          products: response.data,
          lastSync: { ...this.state.lastSync, products: new Date().toISOString() },
        });
      } else {
        throw new Error(response.error || 'Failed to fetch products');
      }
    } catch (error) {
      this.setState({
        errors: { ...this.state.errors, products: error instanceof Error ? error.message : 'Unknown error' },
      });
    } finally {
      this.setState({
        loading: { ...this.state.loading, products: false },
      });
    }
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> {
    if (this.state.offline) {
      this.setState({
        pendingSync: {
          ...this.state.pendingSync,
          products: [...this.state.pendingSync.products, { action: 'create', data: product }],
        },
        products: [
          ...this.state.products,
          { ...product, id: `temp_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Product,
        ],
      });
      return true;
    }

    try {
      const response = await productService.createProduct(product);
      if (response.success && response.data) {
        this.setState({
          products: [...this.state.products, response.data],
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to create product:', error);
      return false;
    }
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
    if (this.state.offline) {
      this.setState({
        products: this.state.products.map(p => p.id === id ? { ...p, ...updates } : p),
        pendingSync: {
          ...this.state.pendingSync,
          products: [...this.state.pendingSync.products, { action: 'update', id, data: updates }],
        },
      });
      return true;
    }

    try {
      const response = await productService.updateProduct(id, updates);
      if (response.success && response.data) {
        this.setState({
          products: this.state.products.map(p => p.id === id ? response.data! : p),
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update product:', error);
      return false;
    }
  }

  // Data Operations - Weather
  async syncWeather(): Promise<void> {
    if (this.state.loading.weather) return;

    this.setState({
      loading: { ...this.state.loading, weather: true },
      errors: { ...this.state.errors, weather: null },
    });

    try {
      const response = await weatherService.getCurrentWeather();
      if (response.success && response.data) {
        this.setState({
          weather: response.data,
          lastSync: { ...this.state.lastSync, weather: new Date().toISOString() },
        });
      } else {
        throw new Error(response.error || 'Failed to fetch weather');
      }
    } catch (error) {
      this.setState({
        errors: { ...this.state.errors, weather: error instanceof Error ? error.message : 'Unknown error' },
      });
    } finally {
      this.setState({
        loading: { ...this.state.loading, weather: false },
      });
    }
  }

  // Data Operations - Reports
  async generateReport(templateId: string, parameters: any): Promise<string | null> {
    try {
      const response = await reportService.generateReport(templateId, parameters);
      if (response.success && response.data) {
        this.setState({
          reports: [...this.state.reports, response.data],
        });
        return response.data.id;
      }
      return null;
    } catch (error) {
      console.error('Failed to generate report:', error);
      return null;
    }
  }

  async syncReports(): Promise<void> {
    if (this.state.loading.reports) return;

    this.setState({
      loading: { ...this.state.loading, reports: true },
    });

    try {
      const response = await reportService.getReports();
      if (response.success && response.data) {
        this.setState({
          reports: response.data,
          lastSync: { ...this.state.lastSync, reports: new Date().toISOString() },
        });
      }
    } catch (error) {
      console.error('Failed to sync reports:', error);
    } finally {
      this.setState({
        loading: { ...this.state.loading, reports: false },
      });
    }
  }

  // Sync Operations
  async syncPendingChanges(): Promise<void> {
    if (this.state.offline) return;

    // Sync pending treatments
    for (const pending of this.state.pendingSync.treatments) {
      try {
        switch (pending.action) {
          case 'create':
            await treatmentService.createTreatment(pending.data);
            break;
          case 'update':
            if (pending.id) {
              await treatmentService.updateTreatment(pending.id, pending.data);
            }
            break;
          case 'delete':
            if (pending.id) {
              await treatmentService.deleteTreatment(pending.id);
            }
            break;
        }
      } catch (error) {
        console.error(`Failed to sync treatment ${pending.action}:`, error);
      }
    }

    // Clear pending treatments after successful sync
    this.setState({
      pendingSync: {
        ...this.state.pendingSync,
        treatments: [],
      },
    });

    // Refresh data after sync
    await this.syncTreatments();
    await this.syncProducts();
  }

  async syncAll(): Promise<void> {
    await Promise.all([
      this.syncTreatments(),
      this.syncProducts(),
      this.syncWeather(),
      this.syncReports(),
    ]);
  }

  // Voice Input and AI Operations
  async parseVoiceInput(transcript: string): Promise<Partial<Treatment> | null> {
    try {
      const response = await treatmentService.parseVoiceInput(transcript);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to parse voice input:', error);
      return null;
    }
  }

  async validateTreatment(treatment: Partial<Treatment>): Promise<any> {
    try {
      const response = await treatmentService.validateTreatment(treatment);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to validate treatment:', error);
      return null;
    }
  }

  // Barcode Scanning
  async scanBarcode(barcode: string): Promise<Partial<Product> | null> {
    try {
      const response = await productService.scanBarcode(barcode);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to scan barcode:', error);
      return null;
    }
  }

  // Utility Methods
  getTreatmentById(id: string): Treatment | undefined {
    return this.state.treatments.find(t => t.id === id);
  }

  getProductById(id: string): Product | undefined {
    return this.state.products.find(p => p.id === id);
  }

  getLowStockProducts(): Product[] {
    return this.state.products.filter(p => p.quantity <= p.minStock);
  }

  getExpiringProducts(days = 90): Product[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);
    
    return this.state.products.filter(p => {
      if (!p.expiryDate) return false;
      return new Date(p.expiryDate) <= cutoffDate;
    });
  }

  getTodaysTreatments(): Treatment[] {
    const today = new Date().toDateString();
    return this.state.treatments.filter(t => new Date(t.date).toDateString() === today);
  }

  getOverdueTreatments(): Treatment[] {
    const today = new Date();
    return this.state.treatments.filter(t => 
      t.status === 'planned' && new Date(t.date) < today
    );
  }

  // Cleanup
  destroy(): void {
    Object.values(this.syncIntervals).forEach(interval => clearInterval(interval));
    this.listeners = [];
  }
}

// Singleton instance
export const dataStore = new DataStore();