import React, { createContext, useState, ReactNode } from 'react';

export interface Treatment { id: string; description: string; date: string; crop?: string; product?: string; dose?: number; area?: number; }
export interface Fertilizer { id: string; name: string; amount: number; date?: string; }
export interface Product { id: string; name: string; quantity: number; unit?: string; supplier?: string; expiryDate?: string; barcode?: string; batchNumber?: string; cost?: number; location?: string; lastUpdated: string}

export interface AppContextValue {
  treatments: Treatment[];
  fertilizers: Fertilizer[];
  products: Product[];
  addTreatment: (t: Treatment) => void;
  addFertilizer: (f: Fertilizer) => void;
  addProduct: (p: Product) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [fertilizers, setFertilizers] = useState<Fertilizer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const addTreatment = (t: Treatment) => setTreatments(prev => [t, ...prev]);
  const addFertilizer = (f: Fertilizer) => setFertilizers(prev => [f, ...prev]);
  const addProduct = (p: Product) => setProducts(prev => [p, ...prev]);
  const updateProduct = (id: string, patch: Partial<Product>) =>
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...patch } : p)));
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

  return (
    <AppContext.Provider value={{ treatments, fertilizers, products, addTreatment, addFertilizer, addProduct, updateProduct, deleteProduct }}>
      {children}
    </AppContext.Provider>
  );
};
