// src/pages/Home.tsx
import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonBadge,
  IonChip,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
  IonToast,
} from "@ionic/react";
import { 
  useHistory 
} from "react-router-dom";
import {
  leafOutline,
  sparklesOutline,
  cubeOutline,
  documentTextOutline,
  addOutline,
  warningOutline,
  checkmarkCircleOutline,
  timeOutline,
  cloudyOutline,
  thermometerOutline,
  waterOutline,
  refreshOutline,
  micOutline,
  notificationsOutline,
} from "ionicons/icons";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  wind: number;
  description: string;
  suitable: boolean;
}

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'reminder';
  title: string;
  message: string;
  time: string;
  urgent: boolean;
}

interface QuickStat {
  label: string;
  value: number;
  color: string;
  icon: string;
}

const Home: React.FC = () => {
  const history = useHistory();
  const [weather, setWeather] = useState<WeatherData>({
    location: "Antibes, France",
    temperature: 24,
    condition: "Sunny",
    humidity: 60,
    wind: 12,
    description: "Condizioni ottimali per trattamenti",
    suitable: true,
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Scadenza Trattamento',
      message: 'Trattamento rame su Vigneto A tra 2 giorni',
      time: '2h fa',
      urgent: true,
    },
    {
      id: '2',
      type: 'reminder',
      title: 'Controllo Magazzino',
      message: 'Controllo magazzino settimanale programmato',
      time: '4h fa',
      urgent: false,
    },
    {
      id: '3',
      type: 'info',
      title: 'Allerta Meteo',
      message: 'Possibili piogge nei prossimi 3 giorni',
      time: '6h fa',
      urgent: true,
    },
  ]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const quickStats: QuickStat[] = [
    { label: 'Programmati', value: 3, color: 'primary', icon: timeOutline },
    { label: 'Completati', value: 8, color: 'success', icon: checkmarkCircleOutline },
    { label: 'In ritardo', value: 1, color: 'danger', icon: warningOutline },
    { label: 'Prodotti', value: 15, color: 'medium', icon: cubeOutline },
  ];

  const upcomingTasks = [
    { task: 'Controllo umidità terreno', due: 'Domani', type: 'check' },
    { task: 'Acquisto fertilizzante organico', due: 'In 3 giorni', type: 'purchase' },
    { task: 'Trattamento preventivo oliveto', due: 'Giovedì', type: 'treatment' },
  ];

  const nextDeliveries = [
    { item: 'Semi di Pomodoro Bio', expected: 'Lunedì', icon: '🌱' },
    { item: 'Spray Antiparassitario', expected: 'Venerdì', icon: '🧴' },
  ];

  const handleRefresh = async (event: CustomEvent) => {
    // Simulate weather data refresh
    setTimeout(() => {
      setWeather(prev => ({
        ...prev,
        temperature: prev.temperature + (Math.random() - 0.5) * 4,
        wind: prev.wind + (Math.random() - 0.5) * 6,
        humidity: Math.max(40, Math.min(80, prev.humidity + (Math.random() - 0.5) * 20)),
      }));
      
      setToastMessage('Dati aggiornati');
      setShowToast(true);
      event.detail.complete();
    }, 1500);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setToastMessage('Notifica rimossa');
    setShowToast(true);
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning': return 'warning';
      case 'info': return 'primary';
      case 'reminder': return 'medium';
      default: return 'light';
    }
  };

  const getWeatherIcon = () => {
    if (weather.condition.toLowerCase().includes('rain')) return waterOutline;
    if (weather.condition.toLowerCase().includes('cloud')) return cloudyOutline;
    return thermometerOutline;
  };

  const navigateToQuickAction = (action: string) => {
    switch (action) {
      case 'treatments':
        history.push('/treatments');
        break;
      case 'fertilizing':
        history.push('/fertilizing');
        break;
      case 'warehouse':
        history.push('/warehouse');
        break;
      case 'reports':
        history.push('/reports');
        break;
      default:
        setToastMessage('Funzione non ancora implementata');
        setShowToast(true);
    }
  };

  const startVoiceCommand = () => {
    setToastMessage('Comando vocale: "Rame su vigneto 2 ettari 3kg/ha"');
    setShowToast(true);
    // Simulate voice processing
    setTimeout(() => {
      history.push('/treatments');
    }, 2000);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>🌱 AgroManager</IonTitle>
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

        {/* Welcome Section */}
        <div className="ion-padding-top ion-padding-horizontal">
          <h2 style={{ margin: '0 0 8px 0', color: 'var(--ion-color-dark)' }}>
            Benvenuto in AgroManager
          </h2>
          <p style={{ color: 'var(--ion-color-medium)', margin: '0 0 20px 0' }}>
            Il tuo assistente digitale per la gestione agricola professionale
          </p>
        </div>

        {/* Weather Widget */}
        <IonCard style={{ margin: '0 16px 16px 16px' }}>
          <IonCardContent>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>
                  {weather.location}
                </h3>
                <p style={{ margin: '0', color: 'var(--ion-color-medium)' }}>
                  {weather.description}
                </p>
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '14px' }}>
                  <span>💨 {weather.wind} km/h</span>
                  <span>💧 {weather.humidity}%</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                  <IonIcon icon={getWeatherIcon()} style={{ marginRight: '8px' }} />
                  {weather.temperature}°C
                </div>
                <IonChip color={weather.suitable ? 'success' : 'warning'} style={{ marginTop: '4px' }}>
                  {weather.suitable ? '✅ Adatto' : '⚠️ Attenzione'}
                </IonChip>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Quick Stats */}
        <IonCard style={{ margin: '0 16px 16px 16px' }}>
          <IonCardHeader>
            <IonCardTitle style={{ fontSize: '18px' }}>Stato Attività</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid style={{ padding: '0' }}>
              <IonRow>
                {quickStats.map((stat, index) => (
                  <IonCol size="3" key={index}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '24px', 
                        fontWeight: 'bold',
                        color: `var(--ion-color-${stat.color})`
                      }}>
                        {stat.value}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--ion-color-medium)' }}>
                        {stat.label}
                      </div>
                    </div>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* Quick Actions */}
        <div style={{ padding: '0 16px' }}>
          <h3 style={{ margin: '0 0 16px 0', color: 'var(--ion-color-dark)' }}>
            Azioni Rapide
          </h3>
          <IonGrid style={{ padding: '0' }}>
            <IonRow>
              <IonCol size="6">
                <IonButton 
                  expand="block" 
                  fill="outline" 
                  color="primary"
                  onClick={() => navigateToQuickAction('treatments')}
                >
                  <IonIcon icon={leafOutline} slot="start" />
                  Trattamenti
                </IonButton>
              </IonCol>
              <IonCol size="6">
                <IonButton 
                  expand="block" 
                  fill="outline" 
                  color="success"
                  onClick={() => navigateToQuickAction('fertilizing')}
                >
                  <IonIcon icon={sparklesOutline} slot="start" />
                  Concimi
                </IonButton>
              </IonCol>
              <IonCol size="6">
                <IonButton 
                  expand="block" 
                  fill="outline" 
                  color="warning"
                  onClick={() => navigateToQuickAction('warehouse')}
                >
                  <IonIcon icon={cubeOutline} slot="start" />
                  Magazzino
                </IonButton>
              </IonCol>
              <IonCol size="6">
                <IonButton 
                  expand="block" 
                  fill="outline" 
                  color="tertiary"
                  onClick={() => navigateToQuickAction('reports')}
                >
                  <IonIcon icon={documentTextOutline} slot="start" />
                  Report
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>

        {/* Priority Notifications */}
        {notifications.filter(n => n.urgent).length > 0 && (
          <IonCard style={{ margin: '16px', backgroundColor: 'var(--ion-color-light-tint)' }}>
            <IonCardHeader>
              <IonCardTitle style={{ fontSize: '16px', display: 'flex', alignItems: 'center' }}>
                <IonIcon icon={notificationsOutline} style={{ marginRight: '8px' }} />
                Notifiche Importanti
                <IonBadge color="danger" style={{ marginLeft: 'auto' }}>
                  {notifications.filter(n => n.urgent).length}
                </IonBadge>
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent style={{ padding: '0 16px 16px 16px' }}>
              {notifications.filter(n => n.urgent).map((notification) => (
                <div 
                  key={notification.id}
                  style={{
                    background: `var(--ion-color-${getNotificationColor(notification.type)}-tint)`,
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    borderLeft: `4px solid var(--ion-color-${getNotificationColor(notification.type)})`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600' }}>
                        {notification.title}
                      </h4>
                      <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--ion-color-medium)' }}>
                        {notification.message}
                      </p>
                      <IonNote style={{ fontSize: '12px' }}>{notification.time}</IonNote>
                    </div>
                    <IonButton 
                      fill="clear" 
                      size="small"
                      onClick={() => dismissNotification(notification.id)}
                    >
                      ✕
                    </IonButton>
                  </div>
                </div>
              ))}
            </IonCardContent>
          </IonCard>
        )}

        {/* Upcoming Tasks */}
        <div style={{ padding: '0 16px', marginTop: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', color: 'var(--ion-color-dark)' }}>
            Prossime Attività ⏰
          </h3>
          <IonList>
            {upcomingTasks.map((task, index) => (
              <IonItem key={index} button>
                <IonLabel>
                  <h3>{task.task}</h3>
                </IonLabel>
                <IonNote slot="end">{task.due}</IonNote>
              </IonItem>
            ))}
          </IonList>
        </div>

        {/* Next Deliveries */}
        <div style={{ padding: '0 16px', marginTop: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', color: 'var(--ion-color-dark)' }}>
            Prossime Consegne 📦
          </h3>
          <IonList>
            {nextDeliveries.map((delivery, index) => (
              <IonItem key={index}>
                <IonLabel>
                  <h3>{delivery.icon} {delivery.item}</h3>
                </IonLabel>
                <IonNote slot="end">Previsto: {delivery.expected}</IonNote>
              </IonItem>
            ))}
          </IonList>
        </div>

        {/* Tip Card */}
        <IonCard style={{ margin: '24px 16px 100px 16px' }}>
          <IonCardHeader>
            <IonCardTitle style={{ fontSize: '16px' }}>💡 Consiglio del Giorno</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p style={{ margin: '0', lineHeight: '1.4' }}>
              Usa il comando vocale per registrare rapidamente i trattamenti. 
              Basta dire "rame su vigneto 2 ettari 3 kg per ettaro" e l'AI completerà automaticamente il form.
            </p>
          </IonCardContent>
        </IonCard>

        {/* Voice Command FAB */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="tertiary" onClick={startVoiceCommand}>
            <IonIcon icon={micOutline} />
          </IonFabButton>
        </IonFab>

        {/* Quick Add FAB */}
        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton color="secondary">
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        {/* Toast for feedback */}
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