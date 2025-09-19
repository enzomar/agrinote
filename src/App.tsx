import React from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import Home from "./pages/Home";
import Treatments from "./pages/Treatments";
import Fertilizations from "./pages/Fertilizations";
import Warehouse from "./pages/Warehouse";
import Reports from "./pages/Reports";

import "@ionic/react/css/core.css";

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonSplitPane contentId="main">
        <IonRouterOutlet id="main">
          <Route path="/home" component={Home} exact />
          <Route path="/treatments" component={Treatments} exact />
          <Route path="/fertilizations" component={Fertilizations} exact />
          <Route path="/warehouse" component={Warehouse} exact />
          <Route path="/reports" component={Reports} exact />
          <Redirect exact from="/" to="/home" />
        </IonRouterOutlet>
      </IonSplitPane>
    </IonReactRouter>
  </IonApp>
);

export default App;
