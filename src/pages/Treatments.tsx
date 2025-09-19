import React from "react";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from "@ionic/react";
import { Camera, CameraResultType } from "@capacitor/camera";

const Treatments: React.FC = () => {
  const takePhoto = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });
    console.log("Photo taken:", image.webPath);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Trattamenti</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton onClick={takePhoto}>📸 Scatta foto</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Treatments;
