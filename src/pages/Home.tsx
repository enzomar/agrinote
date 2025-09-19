import React from "react";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol } from "@ionic/react";
import DashboardCard from "../components/DashboardCard";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol size="6">
              <DashboardCard title="Trattamenti" path="/treatments" />
            </IonCol>
            <IonCol size="6">
              <DashboardCard title="Concimazioni" path="/fertilizations" />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="6">
              <DashboardCard title="Magazzino" path="/warehouse" />
            </IonCol>
            <IonCol size="6">
              <DashboardCard title="Report" path="/reports" />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
