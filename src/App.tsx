import React, { Suspense, useState, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonMenuButton,
  IonButtons,
  IonLoading,
  IonBadge,
  IonNote,
  IonAvatar,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  homeOutline,
  medicalOutline,
  leafOutline,
  cubeOutline,
  analyticsOutline,
  settingsOutline,
  personCircleOutline,
  notificationsOutline,
} from "ionicons/icons";

// Lazy load components for better performance
const Home = React.lazy(() => import("./pages/Home"));
const Treatments = React.lazy(() => import("./pages/Treatments"));
const Fertilizations = React.lazy(() => import("./pages/Fertilizations"));
const Warehouse = React.lazy(() => import("./pages/Warehouse"));
const Reports = React.lazy(() => import("./pages/Reports"));

// Import all required Ionic CSS
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

// Import our new style system
import "./styles/global.css";
import "./styles/components.css";
import "./styles/layouts.css";

// Define route configuration for better maintainability
interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  exact: boolean;
  icon: string;
  title: string;
  badge?: number;
}

// Mock notification count - in real app this would come from state management
const getNotificationCounts = () => ({
  treatments: 2, // Pending treatments
  warehouse: 3,  // Low stock items
  reports: 0,
});

const App: React.FC = () => {
  // State for notifications and weather data
  const [weather, setWeather] = useState({
    temperature: 24,
    condition: "Sole",
    wind: 5,
    humidity: 65,
    message: "Condizioni ottimali per trattamenti"
  });

  // Mock notification counts
  const notificationCounts = {
    treatments: 2,
    warehouse: 3,
    reports: 0
  };

  // Routes configuration
  const routes: RouteConfig[] = [
    {
      path: "/home",
      component: Home,
      exact: true,
      icon: homeOutline,
      title: "Dashboard",
    },
    {
      path: "/treatments",
      component: Treatments,
      exact: true,
      icon: medicalOutline,
      title: "Trattamenti",
      badge: notificationCounts.treatments,
    },
    {
      path: "/fertilizations",
      component: Fertilizations,
      exact: true,
      icon: leafOutline,
      title: "Concimazioni",
    },
    {
      path: "/warehouse",
      component: Warehouse,
      exact: true,
      icon: cubeOutline,
      title: "Magazzino",
      badge: notificationCounts.warehouse,
    },
    {
      path: "/reports",
      component: Reports,
      exact: true,
      icon: analyticsOutline,
      title: "Report",
    },
  ];

  // Loading fallback component
  const LoadingFallback: React.FC = () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column' 
    }}>
      <IonLoading 
        isOpen={true} 
        message="Caricamento..." 
        spinner="crescent"
      />
    </div>
  );

  // Side menu component with improved UX
  const SideMenu: React.FC = () => (
    <IonMenu contentId="main" type="overlay">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>
            <div className="app-title">
              <span className="app-title-icon">🌱</span>
              AgriNote
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* User Profile Section */}
        <IonItem lines="full" className="ion-margin-bottom">
          <IonAvatar slot="start">
            <IonIcon icon={personCircleOutline} style={{ fontSize: '40px' }} />
          </IonAvatar>
          <IonLabel>
            <h2>Mario Rossi</h2>
            <p>Azienda Agricola Rossi</p>
            <IonNote>Ultima sincronizzazione: ora</IonNote>
          </IonLabel>
        </IonItem>

        {/* Navigation Items */}
        <IonList>
          {routes.map((route) => (
            <IonItem
              key={route.path}
              routerLink={route.path}
              routerDirection="none"
              lines="none"
              className="ion-activatable"
              style={{ 
                '--inner-padding-start': '16px',
                '--min-height': '48px'
              }}
            >
              <IonIcon 
                icon={route.icon} 
                slot="start" 
                style={{ 
                  fontSize: '20px',
                  marginRight: '16px'
                }}
              />
              <IonLabel>
                <h3 style={{ fontWeight: '500' }}>{route.title}</h3>
              </IonLabel>
              {route.badge && route.badge > 0 && (
                <IonBadge color="danger" slot="end">
                  {route.badge}
                </IonBadge>
              )}
            </IonItem>
          ))}

          {/* Divider */}
          <div style={{ 
            height: '1px', 
            backgroundColor: 'var(--ion-color-light)', 
            margin: '16px' 
          }} />

          {/* Additional Menu Items */}
          <IonItem lines="none" style={{ '--min-height': '48px' }}>
            <IonIcon 
              icon={notificationsOutline} 
              slot="start"
              style={{ fontSize: '20px', marginRight: '16px' }}
            />
            <IonLabel>
              <h3>Notifiche</h3>
            </IonLabel>
            {(notificationCounts.treatments + notificationCounts.warehouse) > 0 && (
              <IonBadge color="primary" slot="end">
                {notificationCounts.treatments + notificationCounts.warehouse}
              </IonBadge>
            )}
          </IonItem>

          <IonItem lines="none" style={{ '--min-height': '48px' }}>
            <IonIcon 
              icon={settingsOutline} 
              slot="start"
              style={{ fontSize: '20px', marginRight: '16px' }}
            />
            <IonLabel>
              <h3>Impostazioni</h3>
            </IonLabel>
          </IonItem>
        </IonList>

        {/* Footer Info */}
        <div style={{ 
          position: 'absolute', 
          bottom: '16px', 
          left: '16px', 
          right: '16px' 
        }}>
          <IonNote style={{ fontSize: '12px', textAlign: 'center' }}>
            AgriNote v1.0.0<br />
            Sincronizzazione automatica attiva
          </IonNote>
        </div>
      </IonContent>
    </IonMenu>
  );

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main" when="lg">
          <SideMenu />
          <IonRouterOutlet id="main">
            <Suspense fallback={<LoadingFallback />}>
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  component={route.component}
                  exact={route.exact}
                />
              ))}
              <Route exact path="/" render={() => <Redirect to="/home" />} />
              {/* 404 fallback route */}
              <Route render={() => <Redirect to="/home" />} />
            </Suspense>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;