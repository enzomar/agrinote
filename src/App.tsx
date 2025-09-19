import React from 'react';
import { 
  IonApp, 
  IonTabs, 
  IonRouterOutlet, 
  IonTabBar, 
  IonTabButton, 
  IonLabel, 
  IonIcon,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';

import { 
  homeOutline,
  leafOutline, 
  sparklesOutline, 
  cubeOutline, 
  documentTextOutline 
} from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* Context */
import { AppProvider } from './context/AppContext';

/* Pages */
import Home from './pages/HomePage';
import TreatmentsPage from './pages/TreatmentsPage';
import FertilizingPage from './pages/FertilizingPage';
import WarehousePage from './pages/WarehousePage';
import ReportsPage from './pages/ReportsPage';

// Initialize Ionic React
setupIonicReact({
  rippleEffect: true,
  mode: 'md',
});

const App: React.FC = () => {
  return (
    <IonApp>
      <AppProvider>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/home" component={Home} />
              <Route exact path="/treatments" component={TreatmentsPage} />
              <Route exact path="/fertilizing" component={FertilizingPage} />
              <Route exact path="/warehouse" component={WarehousePage} />
              <Route exact path="/reports" component={ReportsPage} />
              {/* Default route */}
              <Route exact path="/" render={() => <Redirect to="/home" />} />
            </IonRouterOutlet>

            <IonTabBar slot="bottom">
              <IonTabButton tab="home" href="/home">
                <IonIcon aria-hidden="true" icon={homeOutline} />
                <IonLabel>Home</IonLabel>
              </IonTabButton>

              <IonTabButton tab="treatments" href="/treatments">
                <IonIcon aria-hidden="true" icon={leafOutline} />
                <IonLabel>Treatments</IonLabel>
              </IonTabButton>

              <IonTabButton tab="fertilizing" href="/fertilizing">
                <IonIcon aria-hidden="true" icon={sparklesOutline} />
                <IonLabel>Fertilizing</IonLabel>
              </IonTabButton>

              <IonTabButton tab="warehouse" href="/warehouse">
                <IonIcon aria-hidden="true" icon={cubeOutline} />
                <IonLabel>Warehouse</IonLabel>
              </IonTabButton>

              <IonTabButton tab="reports" href="/reports">
                <IonIcon aria-hidden="true" icon={documentTextOutline} />
                <IonLabel>Reports</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </AppProvider>
    </IonApp>
  );
};

export default App;
