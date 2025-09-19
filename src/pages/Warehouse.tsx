import React, { useState, useMemo } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonList,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonBadge,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonFab,
  IonFabButton,
  IonModal,
  IonButtons,
  IonGrid,
  IonRow,
  IonCol,
  IonNote,
  IonChip,
  IonAlert,
  IonMenuButton,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonToast,
  IonActionSheet,
  IonProgressBar,
  IonCheckbox,
  IonRange,
} from "@ionic/react";
import {
  add,
  create,
  trash,
  search,
  barcode,
  cube,
  warning,
  checkmark,
  close,
  document,
  cameraOutline,
  scanOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  timeOutline,
  calendarOutline,
  businessOutline,
  downloadOutline,
  filterOutline,
  refreshOutline,
} from "ionicons/icons";

interface Product {
  id: string;
  name: string;
  category: 'pesticide' | 'fertilizer' | 'seed' | 'equipment';
  quantity: number;
  unit: string;
  minStock: number;
  maxStock?: number;
  expiryDate?: string;
  supplier: string;
  notes?: string;
  barcode?: string;
  lastUpdated: string;
  cost?: number;
  location?: string;
  batchNumber?: string;
}

type CategoryFilter = 'all' | 'pesticide' | 'fertilizer' | 'seed' | 'equipment';
type StockFilter = 'all' | 'low' | 'normal' | 'expired' | 'expiring';

const Warehouse: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Glifosato 360 SL',
      category: 'pesticide',
      quantity: 25,
      unit: 'L',
      minStock: 10,
      maxStock: 50,
      expiryDate: '2025-12-31',
      supplier: 'Bayer CropScience',
      notes: 'Tenere in luogo fresco e asciutto',
      barcode: '8012345678901',
      lastUpdated: '2024-09-15',
      cost: 12.50,
      location: 'Scaffale A2',
      batchNumber: 'BC240915'
    },
    {
      id: '2',
      name: 'Concime NPK 20-10-10',
      category: 'fertilizer',
      quantity: 5,
      unit: 'kg',
      minStock: 20,
      maxStock: 100,
      supplier: 'Compo Expert',
      lastUpdated: '2024-09-10',
      cost: 2.30,
      location: 'Magazzino B',
      batchNumber: 'NPK240910'
    },
    {
      id: '3',
      name: 'Semi di Mais Pioneer P1547',
      category: 'seed',
      quantity: 150,
      unit: 'kg',
      minStock: 50,
      maxStock: 200,
      expiryDate: '2025-06-30',
      supplier: 'Pioneer Hi-Bred',
      lastUpdated: '2024-08-20',
      cost: 8.90,
      location: 'Cella frigorifera',
      batchNumber: 'P1547-24'
    },
    {
      id: '4',
      name: 'Ugello Teejet XR110015',
      category: 'equipment',
      quantity: 8,
      unit: 'pz',
      minStock: 5,
      maxStock: 20,
      supplier: 'Teejet Technologies',
      lastUpdated: '2024-09-01',
      cost: 15.60,
      location: 'Officina',
      notes: 'Compatibile con barra irroratrice principale'
    },
    {
      id: '5',
      name: 'Rame Ossicloruro WG',
      category: 'pesticide',
      quantity: 2,
      unit: 'kg',
      minStock: 10,
      maxStock: 30,
      expiryDate: '2024-11-15',
      supplier: 'Syngenta',
      lastUpdated: '2024-09-18',
      cost: 18.40,
      location: 'Scaffale A1',
      batchNumber: 'CU241115'
    },
  ]);

  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState<string | null>(null);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showActionSheet, setShowActionSheet] = useState(false);

  // Form state for adding/editing products
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'pesticide',
    quantity: 0,
    unit: 'L',
    minStock: 0,
    maxStock: 0,
    supplier: '',
    notes: '',
    expiryDate: '',
    cost: 0,
    location: '',
    batchNumber: '',
  });

  const categoryLabels = {
    all: 'Tutti',
    pesticide: 'Fitofarmaci',
    fertilizer: 'Fertilizzanti',
    seed: 'Semi',
    equipment: 'Attrezzature',
  };

  const stockLabels = {
    all: 'Tutti',
    low: 'Scorte basse',
    normal: 'Normali',
    expired: 'Scaduti',
    expiring: 'In scadenza',
  };

  const categoryIcons = {
    pesticide: warning,
    fertilizer: cube,
    seed: checkmark,
    equipment: document,
  };

  const categoryColors = {
    pesticide: 'danger',
    fertilizer: 'success',
    seed: 'primary',
    equipment: 'medium',
  };

  // Filter and search products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase()) ||
        product.supplier.toLowerCase().includes(searchText.toLowerCase()) ||
        (product.barcode && product.barcode.includes(searchText)) ||
        (product.batchNumber && product.batchNumber.toLowerCase().includes(searchText.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      
      let matchesStock = true;
      if (stockFilter === 'low') {
        matchesStock = product.quantity <= product.minStock;
      } else if (stockFilter === 'normal') {
        matchesStock = product.quantity > product.minStock && !isExpired(product) && !isExpiringSoon(product);
      } else if (stockFilter === 'expired') {
        matchesStock = isExpired(product);
      } else if (stockFilter === 'expiring') {
        matchesStock = isExpiringSoon(product) && !isExpired(product);
      }
      
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchText, categoryFilter, stockFilter]);

  // Calculate inventory statistics
  const inventoryStats = useMemo(() => {
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.quantity <= p.minStock).length;
    const expiredProducts = products.filter(p => isExpired(p)).length;
    const expiringProducts = products.filter(p => isExpiringSoon(p) && !isExpired(p)).length;
    const totalValue = products.reduce((sum, p) => sum + (p.quantity * (p.cost || 0)), 0);
    
    return {
      totalProducts,
      lowStockProducts,
      expiredProducts,
      expiringProducts,
      totalValue,
    };
  }, [products]);

  const isExpired = (product: Product) => {
    if (!product.expiryDate) return false;
    return new Date(product.expiryDate) < new Date();
  };

  const isExpiringSoon = (product: Product) => {
    if (!product.expiryDate) return false;
    const expiry = new Date(product.expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90 && diffDays > 0;
  };

  // Barcode scanning simulation
  const startBarcodeScanning = () => {
    setShowBarcodeScanner(true);
    setIsScanning(true);
    
    // Simulate barcode detection after 3 seconds
    setTimeout(() => {
      const mockBarcode = '8012345678902';
      processBarcodeResult(mockBarcode);
      setIsScanning(false);
      setShowBarcodeScanner(false);
    }, 3000);
  };

  const processBarcodeResult = (barcode: string) => {
    // Mock product database lookup
    const productDatabase: { [key: string]: Partial<Product> } = {
      '8012345678902': {
        name: 'Zolfo Bagnabile WG',
        category: 'pesticide',
        supplier: 'Adama Italia',
        unit: 'kg',
        cost: 8.30,
      },
      '8023456789012': {
        name: 'Concime Fosfatico',
        category: 'fertilizer',
        supplier: 'Yara Italia',
        unit: 'kg',
        cost: 1.80,
      }
    };

    const foundProduct = productDatabase[barcode];
    
    if (foundProduct) {
      setFormData({
        ...foundProduct,
        barcode,
        quantity: 0,
        minStock: 10,
        maxStock: 50,
        location: '',
        batchNumber: '',
        expiryDate: '',
      });
      setIsAddModalOpen(true);
      setToastMessage(`Prodotto riconosciuto: ${foundProduct.name}`);
    } else {
      setFormData(prev => ({ ...prev, barcode }));
      setIsAddModalOpen(true);
      setToastMessage(`Codice scansionato: ${barcode} - Compila i dettagli`);
    }
    setShowToast(true);
  };

  const getStockStatus = (product: Product) => {
    if (product.quantity === 0) return { color: 'danger', text: 'Esaurito', icon: alertCircleOutline };
    if (isExpired(product)) return { color: 'danger', text: 'Scaduto', icon: alertCircleOutline };
    if (isExpiringSoon(product)) return { color: 'warning', text: 'In scadenza', icon: timeOutline };
    if (product.quantity <= product.minStock) return { color: 'warning', text: 'Scorta bassa', icon: warning };
    return { color: 'success', text: 'Disponibile', icon: checkmarkCircleOutline };
  };

  const getStockPercentage = (product: Product) => {
    if (!product.maxStock) return 0;
    return (product.quantity / product.maxStock) * 100;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!formData.name || !formData.supplier || formData.quantity === undefined) {
      setToastMessage('Compila tutti i campi obbligatori');
      setShowToast(true);
      return;
    }

    const productData: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.name!,
      category: formData.category || 'pesticide',
      quantity: formData.quantity || 0,
      unit: formData.unit || 'L',
      minStock: formData.minStock || 0,
      maxStock: formData.maxStock,
      supplier: formData.supplier!,
      notes: formData.notes,
      expiryDate: formData.expiryDate,
      barcode: formData.barcode,
      cost: formData.cost,
      location: formData.location,
      batchNumber: formData.batchNumber,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? productData : p));
      setToastMessage('Prodotto aggiornato con successo');
    } else {
      setProducts(prev => [productData, ...prev]);
      setToastMessage('Prodotto aggiunto con successo');
    }
    
    setShowToast(true);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'pesticide',
      quantity: 0,
      unit: 'L',
      minStock: 0,
      maxStock: 0,
      supplier: '',
      notes: '',
      expiryDate: '',
      cost: 0,
      location: '',
      batchNumber: '',
    });
    setEditingProduct(null);
    setIsAddModalOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setShowDeleteAlert(null);
    setToastMessage('Prodotto eliminato');
    setShowToast(true);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    setProducts(prev => prev.map(p => 
      p.id === id 
        ? { ...p, quantity: Math.max(0, newQuantity), lastUpdated: new Date().toISOString().split('T')[0] }
        : p
    ));
    setToastMessage('Quantità aggiornata');
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>
            <div className="page-title">📦 Magazzino</div>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowActionSheet(true)}>
              <IonIcon icon={downloadOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Inventory Summary */}
        <IonCard className="stats-card">
          <IonCardHeader>
            <IonCardTitle>Riepilogo Inventario</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow className="ion-text-center">
                <IonCol>
                  <div className="stat-number">{inventoryStats.totalProducts}</div>
                  <div className="stat-label">Prodotti</div>
                </IonCol>
                <IonCol>
                  <div className="stat-number text-danger">{inventoryStats.lowStockProducts}</div>
                  <div className="stat-label">Scorte basse</div>
                </IonCol>
                <IonCol>
                  <div className="stat-number text-warning">{inventoryStats.expiringProducts}</div>
                  <div className="stat-label">In scadenza</div>
                </IonCol>
                <IonCol>
                  <div className="stat-number">€{inventoryStats.totalValue.toFixed(0)}</div>
                  <div className="stat-label">Valore totale</div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* Alert Summary */}
        {(inventoryStats.lowStockProducts > 0 || inventoryStats.expiredProducts > 0) && (
          <IonCard color="warning">
            <IonCardContent>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <IonIcon icon={warning} style={{ marginRight: '8px', fontSize: '24px' }} />
                <div>
                  <strong>⚠️ Attenzione richiesta</strong>
                  <p style={{ margin: '4px 0 0 0' }}>
                    {inventoryStats.lowStockProducts > 0 && `${inventoryStats.lowStockProducts} prodotti con scorte basse`}
                    {inventoryStats.lowStockProducts > 0 && inventoryStats.expiredProducts > 0 && ' • '}
                    {inventoryStats.expiredProducts > 0 && `${inventoryStats.expiredProducts} prodotti scaduti`}
                  </p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        )}

        {/* Search and Filter */}
        <IonSearchbar
          value={searchText}
          onIonInput={(e) => setSearchText(e.detail.value!)}
          placeholder="Cerca per nome, fornitore, codice..."
        />

        <IonSegment
          value={categoryFilter}
          onIonChange={(e) => setCategoryFilter(e.detail.value as CategoryFilter)}
        >
          {Object.entries(categoryLabels).map(([key, label]) => (
            <IonSegmentButton key={key} value={key}>
              <IonLabel>{label}</IonLabel>
            </IonSegmentButton>
          ))}
        </IonSegment>

        <IonSegment
          value={stockFilter}
          onIonChange={(e) => setStockFilter(e.detail.value as StockFilter)}
          style={{ marginTop: '8px' }}
        >
          {Object.entries(stockLabels).map(([key, label]) => (
            <IonSegmentButton key={key} value={key}>
              <IonLabel style={{ fontSize: '12px' }}>{label}</IonLabel>
            </IonSegmentButton>
          ))}
        </IonSegment>

        {/* Products List */}
        <IonList>
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product);
            const stockPercentage = getStockPercentage(product);

            return (
              <IonItemSliding key={product.id}>
                <IonItem>
                  <IonIcon 
                    icon={categoryIcons[product.category]} 
                    slot="start" 
                    color={categoryColors[product.category]}
                    style={{ fontSize: '24px' }}
                  />
                  
                  <IonLabel style={{ paddingLeft: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <h2 style={{ margin: 0, fontWeight: '600' }}>{product.name}</h2>
                      <IonBadge color={stockStatus.color}>
                        {stockStatus.text}
                      </IonBadge>
                    </div>
                    
                    <div style={{ marginBottom: '8px' }}>
                      <IonChip color="medium" style={{ fontSize: '12px' }}>
                        <IonIcon icon={businessOutline} />
                        <IonLabel>{product.supplier}</IonLabel>
                      </IonChip>
                      {product.location && (
                        <IonChip color="medium" style={{ fontSize: '12px' }}>
                          <IonLabel>📍 {product.location}</IonLabel>
                        </IonChip>
                      )}
                    </div>

                    <IonGrid style={{ padding: '0', marginBottom: '8px' }}>
                      <IonRow>
                        <IonCol size="4">
                          <IonNote style={{ fontSize: '12px' }}>Quantità</IonNote>
                          <div style={{ fontWeight: '600', fontSize: '14px' }}>
                            {product.quantity} {product.unit}
                          </div>
                        </IonCol>
                        <IonCol size="4">
                          <IonNote style={{ fontSize: '12px' }}>Min/Max</IonNote>
                          <div style={{ fontWeight: '600', fontSize: '14px' }}>
                            {product.minStock}{product.maxStock ? `/${product.maxStock}` : ''} {product.unit}
                          </div>
                        </IonCol>
                        <IonCol size="4">
                          {product.cost && (
                            <>
                              <IonNote style={{ fontSize: '12px' }}>Valore</IonNote>
                              <div style={{ fontWeight: '600', fontSize: '14px' }}>
                                €{(product.quantity * product.cost).toFixed(2)}
                              </div>
                            </>
                          )}
                        </IonCol>
                      </IonRow>
                    </IonGrid>

                    {/* Stock Level Bar */}
                    {product.maxStock && (
                      <div style={{ marginBottom: '8px' }}>
                        <div style={{ 
                          width: '100%', 
                          height: '4px', 
                          backgroundColor: 'var(--ion-color-light)', 
                          borderRadius: '2px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${Math.min(stockPercentage, 100)}%`,
                            height: '100%',
                            backgroundColor: stockPercentage > 70 ? 'var(--ion-color-success)' : 
                                           stockPercentage > 30 ? 'var(--ion-color-warning)' : 'var(--ion-color-danger)',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                        <IonNote style={{ fontSize: '11px' }}>{stockPercentage.toFixed(0)}% di capacità</IonNote>
                      </div>
                    )}

                    {product.expiryDate && (
                      <div style={{ marginBottom: '4px' }}>
                        <IonChip 
                          color={isExpired(product) ? 'danger' : isExpiringSoon(product) ? 'warning' : 'medium'}
                          style={{ fontSize: '11px' }}
                        >
                          <IonIcon icon={calendarOutline} />
                          <IonLabel>
                            Scad: {new Date(product.expiryDate).toLocaleDateString('it-IT')}
                          </IonLabel>
                        </IonChip>
                      </div>
                    )}

                    {product.batchNumber && (
                      <IonNote style={{ fontSize: '11px' }}>
                        Lotto: {product.batchNumber} • Agg: {new Date(product.lastUpdated).toLocaleDateString('it-IT')}
                      </IonNote>
                    )}
                  </IonLabel>
                </IonItem>

                <IonItemOptions side="start">
                  <IonItemOption color="success" onClick={() => updateQuantity(product.id, product.quantity + 1)}>
                    +1
                  </IonItemOption>
                  <IonItemOption color="warning" onClick={() => updateQuantity(product.id, product.quantity - 1)}>
                    -1
                  </IonItemOption>
                </IonItemOptions>

                <IonItemOptions side="end">
                  <IonItemOption 
                    color="primary" 
                    onClick={() => handleEdit(product)}
                  >
                    <IonIcon icon={create} />
                  </IonItemOption>
                  <IonItemOption 
                    color="danger" 
                    onClick={() => setShowDeleteAlert(product.id)}
                  >
                    <IonIcon icon={trash} />
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            );
          })}
        </IonList>

        {filteredProducts.length === 0 && (
          <IonCard>
            <IonCardContent style={{ textAlign: 'center', padding: '40px' }}>
              <IonIcon 
                icon={cube} 
                style={{ fontSize: '64px', color: 'var(--ion-color-medium)' }}
              />
              <h2>Nessun prodotto trovato</h2>
              <p>Modifica i filtri o aggiungi nuovi prodotti</p>
            </IonCardContent>
          </IonCard>
        )}

        {/* Add Product FAB */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setIsAddModalOpen(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        {/* Barcode Scanner FAB */}
        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton color="tertiary" onClick={startBarcodeScanning}>
            <IonIcon icon={scanOutline} />
          </IonFabButton>
        </IonFab>

        {/* Barcode Scanner Modal */}
        <IonModal isOpen={showBarcodeScanner} onDidDismiss={() => setShowBarcodeScanner(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Scanner Codice a Barre</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowBarcodeScanner(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              padding: '20px',
              textAlign: 'center'
            }}>
              <IonIcon 
                icon={cameraOutline} 
                style={{ 
                  fontSize: '120px', 
                  color: 'var(--ion-color-primary)',
                  marginBottom: '20px',
                  animation: isScanning ? 'pulse 1s infinite' : 'none'
                }}
              />
              <h2>{isScanning ? 'Scansione in corso...' : 'Inquadra il codice a barre'}</h2>
              <p style={{ color: 'var(--ion-color-medium)' }}>
                {isScanning 
                  ? 'Mantieni il dispositivo fermo e inquadra il codice'
                  : 'Posiziona il codice a barre al centro dello schermo'
                }
              </p>
              {isScanning && <IonProgressBar type="indeterminate" style={{ width: '200px', marginTop: '20px' }} />}
            </div>
          </IonContent>
        </IonModal>

        {/* Add/Edit Product Modal */}
        <IonModal isOpen={isAddModalOpen} onDidDismiss={resetForm}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>
                {editingProduct ? 'Modifica Prodotto' : 'Nuovo Prodotto'}
              </IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={resetForm}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            {formData.barcode && (
              <IonCard color="tertiary">
                <IonCardContent>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IonIcon icon={barcode} style={{ marginRight: '8px' }} />
                    <span><strong>Codice:</strong> {formData.barcode}</span>
                  </div>
                </IonCardContent>
              </IonCard>
            )}

            <IonItem>
              <IonLabel position="stacked">Nome Prodotto *</IonLabel>
              <IonInput
                value={formData.name}
                onIonInput={(e) => setFormData(prev => ({ ...prev, name: e.detail.value! }))}
                placeholder="es. Glifosato 360 SL"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Categoria *</IonLabel>
              <IonSelect
                value={formData.category}
                onSelectionChange={(e) => setFormData(prev => ({ ...prev, category: e.detail.value }))}
              >
                <IonSelectOption value="pesticide">Fitofarmaco</IonSelectOption>
                <IonSelectOption value="fertilizer">Fertilizzante</IonSelectOption>
                <IonSelectOption value="seed">Semi</IonSelectOption>
                <IonSelectOption value="equipment">Attrezzatura</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonItem>
                    <IonLabel position="stacked">Quantità *</IonLabel>
                    <IonInput
                      type="number"
                      value={formData.quantity}
                      onIonInput={(e) => setFormData(prev => ({ ...prev, quantity: parseFloat(e.detail.value!) || 0 }))}
                    />
                  </IonItem>
                </IonCol>
                <IonCol>
                  <IonItem>
                    <IonLabel position="stacked">Unità</IonLabel>
                    <IonSelect
                      value={formData.unit}
                      onSelectionChange={(e) => setFormData(prev => ({ ...prev, unit: e.detail.value }))}
                    >
                      <IonSelectOption value="L">Litri</IonSelectOption>
                      <IonSelectOption value="kg">Kg</IonSelectOption>
                      <IonSelectOption value="g">Grammi</IonSelectOption>
                      <IonSelectOption value="pz">Pezzi</IonSelectOption>
                      <IonSelectOption value="ml">mL</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonGrid>

            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonItem>
                    <IonLabel position="stacked">Scorta Minima *</IonLabel>
                    <IonInput
                      type="number"
                      value={formData.minStock}
                      onIonInput={(e) => setFormData(prev => ({ ...prev, minStock: parseFloat(e.detail.value!) || 0 }))}
                    />
                  </IonItem>
                </IonCol>
                <IonCol>
                  <IonItem>
                    <IonLabel position="stacked">Scorta Massima</IonLabel>
                    <IonInput
                      type="number"
                      value={formData.maxStock}
                      onIonInput={(e) => setFormData(prev => ({ ...prev, maxStock: parseFloat(e.detail.value!) || 0 }))}
                    />
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonGrid>

            <IonItem>
              <IonLabel position="stacked">Fornitore *</IonLabel>
              <IonInput
                value={formData.supplier}
                onIonInput={(e) => setFormData(prev => ({ ...prev, supplier: e.detail.value! }))}
                placeholder="es. Bayer CropScience"
              />
            </IonItem>

            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonItem>
                    <IonLabel position="stacked">Costo Unitario (€)</IonLabel>
                    <IonInput
                      type="number"
                      value={formData.cost}
                      onIonInput={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.detail.value!) || 0 }))}
                      placeholder="0.00"
                    />
                  </IonItem>
                </IonCol>
                <IonCol>
                  <IonItem>
                    <IonLabel position="stacked">Ubicazione</IonLabel>
                    <IonInput
                      value={formData.location}
                      onIonInput={(e) => setFormData(prev => ({ ...prev, location: e.detail.value! }))}
                      placeholder="es. Scaffale A2"
                    />
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonGrid>

            <IonItem>
              <IonLabel position="stacked">Numero Lotto</IonLabel>
              <IonInput
                value={formData.batchNumber}
                onIonInput={(e) => setFormData(prev => ({ ...prev, batchNumber: e.detail.value! }))}
                placeholder="es. BC240915"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Data di Scadenza</IonLabel>
              <IonInput
                type="date"
                value={formData.expiryDate}
                onIonInput={(e) => setFormData(prev => ({ ...prev, expiryDate: e.detail.value! }))}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Note</IonLabel>
              <IonTextarea
                value={formData.notes}
                onIonInput={(e) => setFormData(prev => ({ ...prev, notes: e.detail.value! }))}
                placeholder="Note aggiuntive, condizioni di stoccaggio..."
                rows={3}
              />
            </IonItem>

            <IonButton 
              expand="block" 
              onClick={handleSubmit}
              style={{ marginTop: '20px' }}
            >
              {editingProduct ? 'Aggiorna Prodotto' : 'Aggiungi Prodotto'}
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Delete Confirmation Alert */}
        <IonAlert
          isOpen={!!showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(null)}
          header="Conferma Eliminazione"
          message="Sei sicuro di voler eliminare questo prodotto?"
          buttons={[
            {
              text: 'Annulla',
              role: 'cancel',
            },
            {
              text: 'Elimina',
              role: 'destructive',
              handler: () => handleDelete(showDeleteAlert!),
            },
          ]}
        />

        {/* Action Sheet for Export Options */}
        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          header="Opzioni Export"
          buttons={[
            {
              text: 'Esporta Inventario PDF',
              icon: downloadOutline,
              handler: () => {
                setToastMessage('Export inventario in corso...');
                setShowToast(true);
              }
            },
            {
              text: 'Esporta Prodotti in Scadenza',
              icon: timeOutline,
              handler: () => {
                setToastMessage('Export scadenze in corso...');
                setShowToast(true);
              }
            },
            {
              text: 'Esporta Scorte Basse',
              icon: warning,
              handler: () => {
                setToastMessage('Export scorte basse in corso...');
                setShowToast(true);
              }
            },
            {
              text: 'Sincronizza con ERP',
              icon: refreshOutline,
              handler: () => {
                setToastMessage('Sincronizzazione in corso...');
                setShowToast(true);
              }
            },
            {
              text: 'Annulla',
              role: 'cancel'
            }
          ]}
        />

        {/* Toast for feedback */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="bottom"
          color={toastMessage.includes('successo') ? 'success' : 'primary'}
        />
      </IonContent>
    </IonPage>
  );
};

export default Warehouse;