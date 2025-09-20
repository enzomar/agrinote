// src/context/DataContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { dataStore, AppState } from '../store/DataStore';
import { Treatment, Product, Fertilization, Report, WeatherCondition } from '../services/api';

interface DataContextType {
  // State
  state: AppState;
  
  // Treatment Operations
  treatments: Treatment[];
  createTreatment: (treatment: Omit<Treatment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateTreatment: (id: string, updates: Partial<Treatment>) => Promise<boolean>;
  deleteTreatment: (id: string) => Promise<boolean>;
  getTreatmentById: (id: string) => Treatment | undefined;
  getTodaysTreatments: () => Treatment[];
  getOverdueTreatments: () => Treatment[];
  
  // Product Operations
  products: Product[];
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  getProductById: (id: string) => Product | undefined;
  getLowStockProducts: () => Product[];
  getExpiringProducts: (days?: number) => Product[];
  scanBarcode: (barcode: string) => Promise<Partial<Product> | null>;
  
  // Weather Operations
  weather: WeatherCondition | null;
  refreshWeather: () => Promise<void>;
  
  // Report Operations
  reports: Report[];
  generateReport: (templateId: string, parameters: any) => Promise<string | null>;
  
  // AI Operations
  parseVoiceInput: (transcript: string) => Promise<Partial<Treatment> | null>;
  validateTreatment: (treatment: Partial<Treatment>) => Promise<any>;
  
  // Sync Operations
  syncAll: () => Promise<void>;
  isOffline: boolean;
  lastSync: AppState['lastSync'];
  
  // Loading States
  loading: AppState['loading'];
  errors: AppState['errors'];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>(dataStore.getState());

  useEffect(() => {
    // Initialize data store
    const initializeStore = async () => {
      await dataStore.loadFromStorage();
      await dataStore.syncAll();
    };

    initializeStore();

    // Subscribe to state changes
    const unsubscribe = dataStore.subscribe((newState) => {
      setState(newState);
    });

    // Cleanup
    return () => {
      unsubscribe();
    };
  }, []);

  // Treatment Operations
  const createTreatment = async (treatment: Omit<Treatment, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    return await dataStore.createTreatment(treatment);
  };

  const updateTreatment = async (id: string, updates: Partial<Treatment>): Promise<boolean> => {
    return await dataStore.updateTreatment(id, updates);
  };

  const deleteTreatment = async (id: string): Promise<boolean> => {
    return await dataStore.deleteTreatment(id);
  };

  const getTreatmentById = (id: string): Treatment | undefined => {
    return dataStore.getTreatmentById(id);
  };

  const getTodaysTreatments = (): Treatment[] => {
    return dataStore.getTodaysTreatments();
  };

  const getOverdueTreatments = (): Treatment[] => {
    return dataStore.getOverdueTreatments();
  };

  // Product Operations
  const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    return await dataStore.createProduct(product);
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
    return await dataStore.updateProduct(id, updates);
  };

  const getProductById = (id: string): Product | undefined => {
    return dataStore.getProductById(id);
  };

  const getLowStockProducts = (): Product[] => {
    return dataStore.getLowStockProducts();
  };

  const getExpiringProducts = (days = 90): Product[] => {
    return dataStore.getExpiringProducts(days);
  };

  const scanBarcode = async (barcode: string): Promise<Partial<Product> | null> => {
    return await dataStore.scanBarcode(barcode);
  };

  // Weather Operations
  const refreshWeather = async (): Promise<void> => {
    await dataStore.syncWeather();
  };

  // Report Operations
  const generateReport = async (templateId: string, parameters: any): Promise<string | null> => {
    return await dataStore.generateReport(templateId, parameters);
  };

  // AI Operations
  const parseVoiceInput = async (transcript: string): Promise<Partial<Treatment> | null> => {
    return await dataStore.parseVoiceInput(transcript);
  };

  const validateTreatment = async (treatment: Partial<Treatment>): Promise<any> => {
    return await dataStore.validateTreatment(treatment);
  };

  // Sync Operations
  const syncAll = async (): Promise<void> => {
    await dataStore.syncAll();
  };

  const contextValue: DataContextType = {
    state,
    
    // Treatment Operations
    treatments: state.treatments,
    createTreatment,
    updateTreatment,
    deleteTreatment,
    getTreatmentById,
    getTodaysTreatments,
    getOverdueTreatments,
    
    // Product Operations
    products: state.products,
    createProduct,
    updateProduct,
    getProductById,
    getLowStockProducts,
    getExpiringProducts,
    scanBarcode,
    
    // Weather Operations
    weather: state.weather,
    refreshWeather,
    
    // Report Operations
    reports: state.reports,
    generateReport,
    
    // AI Operations
    parseVoiceInput,
    validateTreatment,
    
    // Sync Operations
    syncAll,
    isOffline: state.offline,
    lastSync: state.lastSync,
    
    // Loading States
    loading: state.loading,
    errors: state.errors,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};