// src/pages/FertilizingPage.tsx
import React, { useContext, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonToast,
} from '@ionic/react';
import { AppContext } from '../context/AppContext';
import '../pages/Home.css';

const FertilizingPage: React.FC = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('AppContext not found');

  const [fertilizerType, setFertilizerType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [toast, setToast] = useState<{show: boolean; msg: string}>({ show: false, msg: '' });

  const scheduleFertilization = () => {
    if (!fertilizerType || !quantity) {
      setToast({ show: true, msg: 'Compila tipo concime e quantità' });
      return;
    }

    setToast({ 
      show: true, 
      msg: `Concimazione programmata: ${fertilizerType} - ${quantity} kg/ha per il ${new Date(date).toLocaleDateString('it-IT')}`
    });

    // Reset form
    setFertilizerType('');
    setQuantity('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="header-gradient">
          <IonTitle>🌿 Concimazioni</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="home-container">
          <h2 style={{ color: '#2f703a', marginBottom: '20px' }}>
            🌿 Gestione Concimazioni
          </h2>
          
          {/* Fertilizer Type */}
          <div className="form-group">
            <label>Tipo Concime</label>
            <select 
              className="form-control"
              value={fertilizerType}
              onChange={(e) => setFertilizerType(e.target.value)}
            >
              <option value="">Seleziona concime</option>
              <option value="NPK 15-15-15">NPK 15-15-15</option>
              <option value="Concime Organico">Concime Organico</option>
              <option value="Compost">Compost</option>
              <option value="Letame Maturo">Letame Maturo</option>
            </select>
          </div>

          {/* Quantity */}
          <div className="form-group">
            <label>Quantità (kg/ha)</label>
            <input 
              type="number" 
              className="form-control" 
              step="0.1" 
              placeholder="Es: 300"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {/* Date */}
          <div className="form-group">
            <label>Data Applicazione</label>
            <input 
              type="date" 
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <button className="btn" onClick={scheduleFertilization}>
            🌱 Programma Concimazione
          </button>
          
          {/* Upcoming Fertilizations */}
          <div style={{ marginTop: '30px' }}>
            <h3 style={{ color: '#2f703a', marginBottom: '15px' }}>
              Prossime Concimazioni
            </h3>
            <div className="product-item">
              <div className="product-info">
                <h4>NPK Vigneto A</h4>
                <p>Programmata per: 25 Settembre 2025</p>
              </div>
              <div className="product-quantity">300 kg/ha</div>
            </div>
          </div>
        </div>

        <IonToast 
          isOpen={toast.show} 
          message={toast.msg}
          duration={3000} 
          onDidDismiss={() => setToast({ show: false, msg: '' })} 
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default FertilizingPage;