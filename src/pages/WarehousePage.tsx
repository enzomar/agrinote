import React, { useContext, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonList, IonToast, IonModal, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { scanOutline, barcodeOutline } from 'ionicons/icons';
import { AppContext } from '../context/AppContext';

// If you later install the Capacitor barcode plugin, you can import it:
// import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

const WarehousePage: React.FC = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('AppContext missing');

  const { products, addProduct, updateProduct, deleteProduct } = ctx;

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<string>('');
  const [unit, setUnit] = useState('kg');
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });

  const add = () => {
    const qty = parseFloat(quantity);
    if (!name || isNaN(qty)) {
      setToast({ show: true, msg: 'Please fill valid product and quantity' });
      return;
    }
    addProduct({ id: Date.now().toString(), name, quantity: qty, unit, lastUpdated: new Date().toISOString() });
    setName(''); setQuantity('');
    setToast({ show: true, msg: 'Product added' });
  };

  // Browser-friendly barcode scan simulation/fallback
  const startScan = async () => {
    // If using a real plugin, call it here. Fallback: prompt for barcode string.
    try {
      // Example: let result = await BarcodeScanner.startScan();
      // if (result.hasContent) handleBarcode(result.content);
      const code = prompt('Simulated scan (enter barcode)') || '';
      if (code) handleBarcode(code);
    } catch (e) {
      setToast({ show: true, msg: 'Barcode scanner not available in browser' });
    }
  };

  const handleBarcode = (code: string) => {
    // fake lookup DB
    const db: Record<string, Partial<typeof products[0]>> = {
      '8012345678902': { name: 'Zolfo Bagnabile WG', unit: 'kg', quantity: 0, supplier: 'Adama' },
      '8023456789012': { name: 'Concime Fosfatico', unit: 'kg', quantity: 0, supplier: 'Yara' },
    };
    const found = db[code];
    if (found) {
      setName(found.name || '');
      setUnit(found.unit || 'kg');
      setQuantity('0');
      setBarcodeModalOpen(true);
      setToast({ show: true, msg: `Product recognized: ${found.name}` });
    } else {
      setToast({ show: true, msg: `Unknown barcode: ${code}` });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Warehouse</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Product name</IonLabel>
          <IonInput value={name} onIonChange={e => setName(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Quantity ({unit})</IonLabel>
          <IonInput value={quantity} type="number" onIonChange={e => setQuantity(e.detail.value!)} />
        </IonItem>

        <div style={{ display: 'flex', gap: 8 }}>
          <IonButton expand="block" onClick={add}>Add</IonButton>
          <IonButton expand="block" color="tertiary" onClick={() => startScan()}>
            <IonIcon slot="start" icon={scanOutline} />
            Scan Barcode
          </IonButton>
        </div>

        <h3 style={{ marginTop: 18 }}>Products</h3>
        <IonList>
          {products.map(p => (
            <IonItem key={p.id}>
              <div style={{ flex: 1 }}>
                <strong>{p.name}</strong>
                <div style={{ fontSize: 13, color: 'var(--ion-color-medium)' }}>
                  {p.quantity} {p.unit} • {p.supplier || ''} • {p.location || ''}
                </div>
              </div>

              <IonButton size="small" onClick={() => updateProduct(p.id, { quantity: p.quantity + 1 })}>+1</IonButton>
              <IonButton size="small" color="warning" onClick={() => updateProduct(p.id, { quantity: Math.max(0, p.quantity - 1) })}>-1</IonButton>
              <IonButton size="small" color="danger" onClick={() => deleteProduct(p.id)}>Delete</IonButton>
            </IonItem>
          ))}
        </IonList>

        <IonModal isOpen={barcodeModalOpen} onDidDismiss={() => setBarcodeModalOpen(false)}>
          <div style={{ padding: 18 }}>
            <h3>Barcode result</h3>
            <p>Pre-filled product. Complete details and press Add.</p>
            <IonItem>
              <IonLabel position="stacked">Name</IonLabel>
              <IonInput value={name} onIonChange={e => setName(e.detail.value!)} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Quantity</IonLabel>
              <IonInput value={quantity} type="number" onIonChange={e => setQuantity(e.detail.value!)} />
            </IonItem>
            <IonButton expand="block" onClick={() => { add(); setBarcodeModalOpen(false); }}>Add product</IonButton>
            <IonButton expand="block" color="light" onClick={() => setBarcodeModalOpen(false)}>Close</IonButton>
          </div>
        </IonModal>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => startScan()}>
            <IonIcon icon={barcodeOutline} />
          </IonFabButton>
        </IonFab>

        <IonToast isOpen={toast.show} message={toast.msg} duration={2000} onDidDismiss={() => setToast({ show: false, msg: '' })} />
      </IonContent>
    </IonPage>
  );
};

export default WarehousePage;
