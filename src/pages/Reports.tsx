import React from "react";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from "@ionic/react";
import jsPDF from "jspdf";

const Reports: React.FC = () => {
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Report Certificazioni", 14, 20);

    doc.setFontSize(12);
    doc.text("Azienda Agricola Rossi", 14, 40);
    doc.text("Coltura: Vigneto (2 ettari)", 14, 50);
    doc.text("Trattamento: Rame 3kg/ha", 14, 60);
    doc.text("Data: 19/09/2025", 14, 70);

    doc.setFontSize(10);
    doc.text("Generato automaticamente dall'app", 14, 280);

    doc.save("report-certificazione.pdf");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Report</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p>📊 Qui puoi generare report per certificazioni (Bio, SQNPI, GlobalGAP).</p>
        <IonButton expand="block" onClick={generatePDF}>
          📄 Scarica PDF
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Reports;
