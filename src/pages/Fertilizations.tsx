import React from "react";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/react";

const Fertilizations: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Concimazioni</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p>📌 Qui potrai inserire concimazioni e gestire le quantità.</p>
      </IonContent>
    </IonPage>
  );
};

export default Fertilizations;
