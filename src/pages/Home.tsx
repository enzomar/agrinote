import React, { useState, useEffect } from "react";
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, 
  IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, 
  IonIcon, IonButton, IonBadge, IonItem, IonLabel, IonList, IonNote, 
  IonChip, IonButtons, IonMenuButton, IonRefresher, IonRefresherContent, 
  IonFab, IonFabButton, IonToast, IonSpinner 
} from "@ionic/react";
import { 
  medicalOutline, leafOutline, cubeOutline, analyticsOutline, notificationsOutline, 
  warningOutline, alertCircleOutline, checkmarkCircleOutline, addCircleOutline, 
  refreshOutline, locationOutline, thermometerOutline, waterOutline, eyeOutline, 
  cloudyOutline 
} from "ionicons/icons";
import "./Home.css";

interface DashboardCard {
  title: string;
  icon: string;
  color: string;
  route: string;
  count?: number;
  subtitle?: string;
  urgentBadge?: boolean;
}

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'danger';
  title: string;
  message: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
}

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  wind: number;
  rain_probability: number;
  alert?: string;
}

interface TaskSummary {
  today: number;
  thisWeek: number;
  overdue: number;
  completed: number;
}

const Home: React.FC = () => {
  // State declarations with explicit types
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [taskSummary, setTaskSummary] = useState<TaskSummary | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        setNotifications([
          { id: '1', type: 'warning', title: 'Scadenza Trattamento', message: 'Trattamento preventivo vigneto scade tra 2 giorni', time: '2 ore fa', priority: 'high' },
          { id: '2', type: 'danger', title: 'Scorte Basse', message: '3 prodotti sotto la scorta minima', time: '4 ore fa', priority: 'high' },
          { id: '3', type: 'info', title: 'Condizioni Meteo', message: 'Possibili precipitazioni nei prossimi 3 giorni', time: '6 ore fa', priority: 'medium' },
          { id: '4', type: 'success', title: 'Report Generato', message: 'Report mensile disponibile per il download', time: '1 giorno fa', priority: 'low' },
        ]);

        setWeather({
          location: 'Montalcino, Toscana',
          temperature: 22,
          condition: 'Parzialmente nuvoloso',
          humidity: 65,
          wind: 12,
          rain_probability: 30,
          alert: 'Possibili precipitazioni intense nelle prossime 48h',
        });

        setTaskSummary({
          today: 3,
          thisWeek: 12,
          overdue: 1,
          completed: 8,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setToastMessage('Errore durante il caricamento dei dati');
        setShowToast(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Event handlers
  const handleRefresh = async (event: CustomEvent): Promise<void> => {
    try {
      setIsRefreshing(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTaskSummary(prev => prev ? {
        ...prev,
        completed: prev.completed + 1
      } : null);
      
      setToastMessage('Dati aggiornati con successo');
      setShowToast(true);
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      setToastMessage('Errore durante l\'aggiornamento');
      setShowToast(true);
    } finally {
      setIsRefreshing(false);
      event.detail.complete();
    }
  };

  const dismissNotification = (id: string): void => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
    setToastMessage('Notifica rimossa');
    setShowToast(true);
  };

  // Helper functions
  const getNotificationIcon = (type: string): string => {
    switch (type) {
      case 'warning': return warningOutline;
      case 'danger': return alertCircleOutline;
      case 'success': return checkmarkCircleOutline;
      default: return notificationsOutline;
    }
  };

  const getNotificationColor = (type: string): string => {
    switch (type) {
      case 'warning': return 'warning';
      case 'danger': return 'danger';
      case 'success': return 'success';
      default: return 'primary';
    }
  };

  const getWeatherIcon = (): string => {
    if (!weather) return thermometerOutline;
    if (weather.rain_probability > 70) return waterOutline;
    if (weather.condition.includes('nuvoloso')) return cloudyOutline;
    return thermometerOutline;
  };

  // Dashboard cards configuration
  const dashboardCards: DashboardCard[] = [
    {
      title: 'Trattamenti',
      subtitle: taskSummary ? `${taskSummary.today} programmati oggi` : 'Caricamento...',
      icon: medicalOutline,
      color: 'primary',
      route: '/treatments',
      count: taskSummary?.overdue,
      urgentBadge: (taskSummary?.overdue || 0) > 0,
    },
    {
      title: 'Concimazioni',
      subtitle: taskSummary ? `${taskSummary.thisWeek} questa settimana` : 'Caricamento...',
      icon: leafOutline,
      color: 'success',
      route: '/fertilizations',
    },
    {
      title: 'Magazzino',
      subtitle: 'Gestione prodotti',
      icon: cubeOutline,
      color: 'warning',
      route: '/warehouse',
      count: 3,
      urgentBadge: true,
    },
    {
      title: 'Report',
      subtitle: '1 nuovo report disponibile',
      icon: analyticsOutline,
      color: 'tertiary',
      route: '/reports',
      count: 1,
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>🌱 Dashboard</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60vh', textAlign:'center' }}>
            <IonSpinner name="crescent" style={{ transform:'scale(1.5)', marginBottom:'24px' }} />
            <h2>Caricamento Dashboard...</h2>
            <p style={{ color:'var(--ion-color-medium)' }}>Sincronizzazione dati in corso</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  // Main render
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="header-toolbar" color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>
            <div className="page-title">Dashboard</div>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton className="notification-button">
              <IonIcon icon={notificationsOutline} />
              {notifications.filter(n => n.priority === 'high').length > 0 && (
                <IonBadge 
                  color="danger" 
                  className="notification-badge"
                >
                  {notifications.filter(n => n.priority === 'high').length}
                </IonBadge>
              )}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh} className="ion-refresher">
          <IonRefresherContent
            pullingIcon={refreshOutline}
            pullingText="Trascina per aggiornare"
            refreshingSpinner="crescent"
            refreshingText="Aggiornamento..."
          />
        </IonRefresher>
        <div className="app-container">
          <div className="content-area">

            {/* Quick Stats */}
            {taskSummary && (
              <div className="stats-card">
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-number">{taskSummary.today}</div>
                    <div className="stat-label">Oggi</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{taskSummary.thisWeek}</div>
                    <div className="stat-label">Settimana</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{taskSummary.completed}</div>
                    <div className="stat-label">Completate</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number text-danger">{taskSummary.overdue}</div>
                    <div className="stat-label">In ritardo</div>
                  </div>
                </div>
              </div>
            )}

            {/* Weather Card */}
            {weather && (
              <div className="weather-card">
                <IonCard>
                  <IonCardHeader>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <IonCardTitle>{weather.location}</IonCardTitle>
                      <IonIcon icon={getWeatherIcon()} />
                    </div>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>{weather.condition}, {weather.temperature}°C</p>
                    <p>Umidità: {weather.humidity}%, Vento: {weather.wind} km/h</p>
                    {weather.alert && <IonNote color="danger">{weather.alert}</IonNote>}
                  </IonCardContent>
                </IonCard>
              </div>
            )}

            {/* Dashboard Cards */}
            <div className="dashboard-grid">
              {dashboardCards.map((card, index) => (
                <div key={index} className="dashboard-card">
                  <IonCard button routerLink={card.route} color={card.color} className="h-100" routerDirection="forward">
                    <IonCardHeader>
                      <IonCardTitle className="ion-align-items-center">
                        <IonIcon icon={card.icon} style={{ marginRight: '8px' }} /> {card.title}
                        {card.urgentBadge && card.count && (
                          <IonBadge color="danger" style={{ marginLeft: '8px' }}>{card.count}</IonBadge>
                        )}
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      {card.subtitle}
                    </IonCardContent>
                  </IonCard>
                </div>
              ))}
            </div>
          </div>

          <div className="side-content">
            {/* Notifications */}
            <div className="notification-list">
              <IonList>
                {notifications.map(n => (
                  <IonItem key={n.id} color={getNotificationColor(n.type)}>
                    <IonIcon slot="start" icon={getNotificationIcon(n.type)} />
                    <IonLabel>
                      <h2>{n.title}</h2>
                      <p>{n.message}</p>
                      <IonNote>{n.time}</IonNote>
                    </IonLabel>
                    <IonButton fill="clear" color="medium" onClick={() => dismissNotification(n.id)}>
                      <IonIcon icon={addCircleOutline} />
                    </IonButton>
                  </IonItem>
                ))}
              </IonList>
            </div>
            </div>
          </div>
       


        {/* Floating Action Button */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/tasks">
            <IonIcon icon={addCircleOutline} />
          </IonFabButton>
        </IonFab>

        <IonToast
          isOpen={showToast}
          message={toastMessage}
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
