import React from "react";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/react";

const Warehouse: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Magazzino</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p>📦 Gestione prodotti: lista fitofarmaci e quantità.</p>
        <p>(In futuro: scansione QR/barcode per inserire rapidamente un prodotto)</p>
      </IonContent>
    </IonPage>
  );
};

export default Warehouse;
