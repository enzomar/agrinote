// src/pages/Home.tsx
import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButton,
  IonRefresher,
  IonRefresherContent,
  IonToast,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { refreshOutline } from "ionicons/icons";
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Set today's date on component mount
  useEffect(() => {
    // Any initialization logic
  }, []);

  const handleRefresh = async (event: CustomEvent) => {
    // Simulate data refresh
    setTimeout(() => {
      setToastMessage('Dati aggiornati');
      setShowToast(true);
      event.detail.complete();
    }, 1500);
  };

  const navigateToPage = (page: string) => {
    history.push(`/${page}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="header-gradient">
          <IonTitle>🌱 AgriNote</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            pullingIcon={refreshOutline}
            pullingText="Trascina per aggiornare"
            refreshingSpinner="crescent"
            refreshingText="Aggiornamento..."
          />
        </IonRefresher>

        <div className="home-container">
          {/* Weather Widget */}
          <IonCard className="weather-widget">
            <IonCardContent>
              <h4>🌤️ Meteo Oggi</h4>
              <p>Sole, 24°C • Vento: 5 km/h • Umidità: 65%</p>
              <p style={{ fontSize: '14px', marginTop: '5px' }}>
                Condizioni ottimali per trattamenti
              </p>
            </IonCardContent>
          </IonCard>

          {/* Notifications */}
          <IonCard className="notifications">
            <IonCardContent>
              <h4>🔔 Notifiche Importanti</h4>
              <div className="notification-item">
                ⏰ Scadenza: Trattamento rame su Vigneto A tra 2 giorni
              </div>
              <div className="notification-item">
                📋 Promemoria: Controllo magazzino settimanale
              </div>
              <div className="notification-item">
                ⚠️ Allerta: Possibili piogge nei prossimi 3 giorni
              </div>
            </IonCardContent>
          </IonCard>

          {/* Dashboard Grid */}
          <IonGrid className="dashboard-grid">
            <IonRow>
              <IonCol size="6">
                <IonCard 
                  button 
                  className="dashboard-card"
                  onClick={() => navigateToPage('treatments')}
                >
                  <IonCardContent>
                    <span className="card-icon">🧪</span>
                    <h3>Trattamenti</h3>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="6">
                <IonCard 
                  button 
                  className="dashboard-card"
                  onClick={() => navigateToPage('fertilizing')}
                >
                  <IonCardContent>
                    <span className="card-icon">🌿</span>
                    <h3>Concimazioni</h3>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="6">
                <IonCard 
                  button 
                  className="dashboard-card"
                  onClick={() => navigateToPage('warehouse')}
                >
                  <IonCardContent>
                    <span className="card-icon">📦</span>
                    <h3>Magazzino</h3>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="6">
                <IonCard 
                  button 
                  className="dashboard-card"
                  onClick={() => navigateToPage('reports')}
                >
                  <IonCardContent>
                    <span className="card-icon">📊</span>
                    <h3>Report</h3>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;