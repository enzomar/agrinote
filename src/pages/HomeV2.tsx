// src/pages/Home.tsx
import React, { useState } from "react";
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
  IonRefresher,
  IonRefresherContent,
  IonToast,
  IonBadge,
  IonSkeletonText,
  IonChip,
  IonLabel,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { 
  refreshOutline, 
  warningOutline, 
  checkmarkCircleOutline,
  timeOutline,
  cloudOfflineOutline,
  cloudDoneOutline,
} from "ionicons/icons";
import { useData } from '../context/DataContext';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();
  const { 
    state,
    weather, 
    getTodaysTreatments, 
    getOverdueTreatments, 
    getLowStockProducts, 
    getExpiringProducts,
    syncAll,
    isOffline,
    lastSync,
    loading,
    errors 
  } = useData();
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Calculate stats from real data
  const todaysTreatments = getTodaysTreatments();
  const overdueTreatments = getOverdueTreatments();
  const lowStockProducts = getLowStockProducts();
  const expiringProducts = getExpiringProducts();
  const completedTreatments = state.treatments.filter(t => t.status === 'completed');

  // Create notifications from real data
  const notifications = [
    ...(overdueTreatments.length > 0 ? [{
      id: 'overdue',
      type: 'warning' as const,
      title: 'Trattamenti in ritardo',
      message: `${overdueTreatments.length} trattamenti non completati`,
      urgent: true,
    }] : []),
    ...(lowStockProducts.length > 0 ? [{
      id: 'low_stock',
      type: 'danger' as const,
      title: 'Scorte basse',
      message: `${lowStockProducts.length} prodotti sotto la scorta minima`,
      urgent: true,
    }] : []),
    ...(expiringProducts.length > 0 ? [{
      id: 'expiring',
      type: 'warning' as const,
      title: 'Prodotti in scadenza',
      message: `${expiringProducts.length} prodotti scadranno nei prossimi 90 giorni`,
      urgent: false,
    }] : []),
    ...(weather?.warnings?.length ? [{
      id: 'weather',
      type: 'info' as const,
      title: 'Allerta meteo',
      message: weather.warnings[0],
      urgent: weather.warnings.some(w => w.includes('forte') || w.includes('intenso')),
    }] : []),
  ];

  const handleRefresh = async (event: CustomEvent) => {
    try {
      await syncAll();
      setToastMessage('Dati aggiornati con successo');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Errore durante l\'aggiornamento');
      setShowToast(true);
    }
    event.detail.complete();
  };

  const navigateToPage = (page: string) => {
    history.push(`/${page}`);
  };

  const formatLastSync = (timestamp: string | null) => {
    if (!timestamp) return 'Mai';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Ora';
    if (minutes < 60) return `${minutes} min fa`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h fa`;
    const days = Math.floor(hours / 24);
    return `${days}g fa`;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="header-gradient">
          <IonTitle>🌱 AgroManager</IonTitle>
          <div slot="end" style={{ display: 'flex', alignItems: 'center', marginRight: '16px' }}>
            <IonIcon 
              icon={isOffline ? cloudOfflineOutline : cloudDoneOutline} 
              color={isOffline ? 'danger' : 'success'}
              style={{ fontSize: '20px' }}
            />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            pullingIcon={refreshOutline}
            pullingText="Trascina per aggiornare"
            refreshingSpinner="crescent"
            refreshingText="Sincronizzazione..."
          />
        </IonRefresher>

        <div className="home-container">
          {/* Sync Status */}
          {(loading.treatments || loading.products || loading.weather) && (
            <IonCard>
              <IonCardContent style={{ textAlign: 'center', padding: '12px' }}>
                <IonSkeletonText animated style={{ width: '60%', margin: '0 auto' }} />
                <p style={{ fontSize: '12px', color: 'var(--ion-color-medium)', margin: '4px 0 0 0' }}>
                  Sincronizzazione in corso...
                </p>
              </IonCardContent>
            </IonCard>
          )}

          {/* Weather Widget */}
          {weather ? (
            <IonCard className="weather-widget">
              <IonCardContent>
                <h4>🌤️ Meteo Attuale</h4>
                <p>{weather.condition}, {weather.temperature}°C • Vento: {weather.windSpeed} km/h • Umidità: {weather.humidity}%</p>
                <p style={{ fontSize: '14px', marginTop: '5px' }}>
                  {weather.suitable 
                    ? 'Condizioni ottimali per trattamenti' 
                    : 'Condizioni non ideali per trattamenti'
                  }
                </p>
                {weather.warnings && weather.warnings.length > 0 && (
                  <IonChip color="warning" style={{ marginTop: '8px' }}>
                    <IonIcon icon={warningOutline} />
                    <IonLabel>{weather.warnings[0]}</IonLabel>
                  </IonChip>
                )}
              </IonCardContent>
            </IonCard>
          ) : (
            <IonCard className="weather-widget">
              <IonCardContent>
                <IonSkeletonText animated style={{ width: '70%' }} />
                <IonSkeletonText animated style={{ width: '100%' }} />
                <IonSkeletonText animated style={{ width: '80%' }} />
              </IonCardContent>
            </IonCard>
          )}

          {/* Urgent Notifications */}
          {notifications.filter(n => n.urgent).length > 0 && (
            <IonCard className="notifications">
              <IonCardContent>
                <h4>🔔 Attenzione Richiesta</h4>
                {notifications.filter(n => n.urgent).map((notification) => (
                  <div key={notification.id} className="notification-item">
                    {notification.type === 'warning' && '⏰'} 
                    {notification.type === 'danger' && '⚠️'} 
                    {notification.type === 'info' && '📋'} 
                    {' '}{notification.message}
                  </div>
                ))}
              </IonCardContent>
            </IonCard>
          )}

          {/* Dashboard Grid with Real Data */}
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
                    {overdueTreatments.length > 0 && (
                      <IonBadge color="danger" style={{ position: 'absolute', top: '8px', right: '8px' }}>
                        {overdueTreatments.length}
                      </IonBadge>
                    )}
                    <p style={{ fontSize: '12px', color: 'var(--ion-color-medium)', margin: '4px 0 0 0' }}>
                      {todaysTreatments.length} oggi
                    </p>
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
                    <p style={{ fontSize: '12px', color: 'var(--ion-color-medium)', margin: '4px 0 0 0' }}>
                      {state.fertilizations.length} programmate
                    </p>
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
                    {lowStockProducts.length > 0 && (
                      <IonBadge color="warning" style={{ position: 'absolute', top: '8px', right: '8px' }}>
                        {lowStockProducts.length}
                      </IonBadge>
                    )}
                    <p style={{ fontSize: '12px', color: 'var(--ion-color-medium)', margin: '4px 0 0 0' }}>
                      {state.products.length} prodotti
                    </p>
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
                    {state.reports.filter(r => r.status === 'ready').length > 0 && (
                      <IonBadge color="success" style={{ position: 'absolute', top: '8px', right: '8px' }}>
                        {state.reports.filter(r => r.status === 'ready').length}
                      </IonBadge>
                    )}
                    <p style={{ fontSize: '12px', color: 'var(--ion-color-medium)', margin: '4px 0 0 0' }}>
                      {state.reports.length} generati
                    </p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>

          {/* Quick Stats with Real Data */}
          <IonCard>
            <IonCardContent>
              <h4 style={{ margin: '0 0 16px 0', color: '#2f703a' }}>Statistiche</h4>
              <IonGrid>
                <IonRow className="ion-text-center">
                  <IonCol>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--ion-color-primary)' }}>
                      {todaysTreatments.length}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ion-color-medium)' }}>
                      Oggi
                    </div>
                  </IonCol>
                  <IonCol>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--ion-color-success)' }}>
                      {completedTreatments.length}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ion-color-medium)' }}>
                      Completati
                    </div>
                  </IonCol>
                  <IonCol>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--ion-color-danger)' }}>
                      {overdueTreatments.length}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ion-color-medium)' }}>
                      In ritardo
                    </div>
                  </IonCol>
                  <IonCol>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--ion-color-warning)' }}>
                      {lowStockProducts.length}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ion-color-medium)' }}>
                      Scorte basse
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>

          {/* All Notifications */}
          {notifications.length > 0 && (
            <IonCard>
              <IonCardContent>
                <h4 style={{ margin: '0 0 16px 0', color: '#2f703a', display: 'flex', alignItems: 'center' }}>
                  🔔 Notifiche
                  <IonBadge color="primary" style={{ marginLeft: '8px' }}>
                    {notifications.length}
                  </IonBadge>
                </h4>
                {notifications.map((notification) => (
                  <div key={notification.id} style={{
                    background: notification.urgent ? 'rgba(255,107,107,0.1)' : 'var(--ion-color-light)',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    borderLeft: `4px solid var(--ion-color-${
                      notification.type === 'danger' ? 'danger' :
                      notification.type === 'warning' ? 'warning' : 'primary'
                    })`
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {notification.title}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--ion-color-medium)' }}>
                      {notification.message}
                    </div>
                  </div>
                ))}
              </IonCardContent>
            </IonCard>
          )}

          {/* Sync Information */}
          <IonCard>
            <IonCardContent>
              <h4 style={{ margin: '0 0 12px 0', color: '#2f703a' }}>
                Sincronizzazione
                {isOffline && (
                  <IonChip color="danger" style={{ marginLeft: '8px' }}>
                    <IonIcon icon={cloudOfflineOutline} />
                    <IonLabel>Offline</IonLabel>
                  </IonChip>
                )}
              </h4>
              <div style={{ fontSize: '14px' }}>
                <div style={{ marginBottom: '4px' }}>
                  <strong>Trattamenti:</strong> {formatLastSync(lastSync.treatments)}
                </div>
                <div style={{ marginBottom: '4px' }}>
                  <strong>Prodotti:</strong> {formatLastSync(lastSync.products)}
                </div>
                <div style={{ marginBottom: '4px' }}>
                  <strong>Meteo:</strong> {formatLastSync(lastSync.weather)}
                </div>
                {state.pendingSync.treatments.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <IonChip color="warning">
                      <IonIcon icon={timeOutline} />
                      <IonLabel>{state.pendingSync.treatments.length} in attesa di sync</IonLabel>
                    </IonChip>
                  </div>
                )}
              </div>
            </IonCardContent>
          </IonCard>

          {/* Error Display */}
          {Object.values(errors).some(e => e !== null) && (
            <IonCard color="danger">
              <IonCardContent>
                <h4>Errori di sincronizzazione</h4>
                {Object.entries(errors).map(([key, error]) => 
                  error && (
                    <div key={key} style={{ fontSize: '14px', marginBottom: '4px' }}>
                      <strong>{key}:</strong> {error}
                    </div>
                  )
                )}
              </IonCardContent>
            </IonCard>
          )}
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;