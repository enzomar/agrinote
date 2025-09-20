// src/pages/WarehousePage.tsx
import React, { useContext, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonToast,
  IonCard,
  IonCardContent,
  IonModal,
  IonButtons,
  IonIcon,
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { AppContext } from '../context/AppContext';
import '../pages/Home.css';

const WarehousePage: React.FC = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('AppContext not found');

  const [toast, setToast] = useState<{show: boolean; msg: string}>({ show: false, msg: '' });
  const [showScanModal, setShowScanModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Mock products data
  const products = [
    {
      name: 'Solfato di Rame',
      expiry: '12/2026',
      lot: 'ABC123',
      quantity: '45 kg',
      status: 'normal'
    },
    {
      name: 'Zolfo Micronizzato',
      expiry: '08/2025',
      lot: 'XYZ789',
      quantity: '28 kg',
      status: 'normal'
    },
    {
      name: 'Olio Minerale',
      expiry: '03/2026',
      lot: 'MIN456',
      quantity: '15 L',
      status: 'normal'
    },
    {
      name: 'Insetticida Bio',
      expiry: '01/2025',
      lot: 'BIO001',
      quantity: '3 L',
      status: 'low',
      warning: '⚠️ Scorte basse'
    }
  ];

  const scanProduct = () => {
    setShowScanModal(true);
    setIsScanning(true);
    
    // Simulate barcode scan
    setTimeout(() => {
      const simulatedProducts = [
        { name: 'Fungicida Sistemico', lot: 'FUN2024', exp: '06/2026', qty: '25 kg' },
        { name: 'Erbicida Selettivo', lot: 'ERB2024', exp: '09/2025', qty: '10 L' },
        { name: 'Concime NPK 20-10-10', lot: 'NPK2024', exp: '12/2026', qty: '50 kg' }
      ];
      
      const randomProduct = simulatedProducts[Math.floor(Math.random() * simulatedProducts.length)];
      setIsScanning(false);
      setShowScanModal(false);
      setToast({ 
        show: true, 
        msg: `Prodotto riconosciuto: ${randomProduct.name}\nLotto: ${randomProduct.lot}\nScad: ${randomProduct.exp}\nQuantità: ${randomProduct.qty}`
      });
    }, 3000);
  };

  const addProductManually = () => {
    setToast({ 
      show: true, 
      msg: 'In un\'app completa, qui si aprirebbe un form per l\'inserimento manuale del prodotto con tutti i dettagli (nome, lotto, scadenza, quantità).' 
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="header-gradient">
          <IonTitle>📦 Magazzino</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="home-container">
          <h2 style={{ color: '#2f703a', marginBottom: '20px' }}>
            📦 Magazzino Prodotti
          </h2>
          
          {/* Scanner Area */}
          <div className="scanner-area" onClick={scanProduct}>
            <div className="icon">📱</div>
            <h4>Scansiona Codice a Barre</h4>
            <p>Tocca per scansionare un nuovo prodotto</p>
          </div>

          <button className="btn btn-secondary" onClick={addProductManually}>
            ➕ Aggiungi Prodotto Manualmente
          </button>

          <h3 style={{ color: '#2f703a', margin: '30px 0 15px 0' }}>
            Prodotti Disponibili
          </h3>
          
          <div className="product-list">
            {products.map((product, index) => (
              <div 
                key={index}
                className="product-item"
                style={{ 
                  borderLeftColor: product.status === 'low' ? '#ff4757' : '#2f703a' 
                }}
              >
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p>Scad: {product.expiry} • Lotto: {product.lot}</p>
                  {product.warning && (
                    <p style={{ color: '#ff4757', fontWeight: 600 }}>
                      {product.warning}
                    </p>
                  )}
                </div>
                <div 
                  className="product-quantity"
                  style={{ 
                    background: product.status === 'low' ? '#ff4757' : '#2f703a' 
                  }}
                >
                  {product.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Barcode Scanner Modal */}
        <IonModal isOpen={showScanModal} onDidDismiss={() => setShowScanModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Scanner Attivo</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowScanModal(false)}>
                  <IonIcon icon={closeOutline} />
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
              padding: '40px',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '120px', 
                marginBottom: '20px',
                animation: isScanning ? 'pulse 1s infinite' : 'none'
              }}>
                📷
              </div>
              <h2>{isScanning ? 'Scansione in corso...' : 'Inquadra il codice a barre'}</h2>
              <p style={{ color: 'var(--ion-color-medium)' }}>
                {isScanning 
                  ? 'In un\'app reale, qui si attiverebbe la fotocamera per la scansione del codice a barre.'
                  : 'Posiziona il codice a barre al centro dello schermo'
                }
              </p>
            </div>
          </IonContent>
        </IonModal>

        <IonToast 
          isOpen={toast.show} 
          message={toast.msg}
          duration={4000} 
          onDidDismiss={() => setToast({ show: false, msg: '' })} 
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default WarehousePage;