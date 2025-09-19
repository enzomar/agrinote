import React, { useContext } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList, IonItem } from '@ionic/react';
import { AppContext } from '../context/AppContext';
import jsPDF from 'jspdf';

const ReportsPage: React.FC = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('AppContext missing');

  const { treatments, fertilizers, products } = ctx;

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('AgriNote - Report', 14, 20);

    let y = 32;
    doc.setFontSize(12);
    doc.text('Treatments', 14, y);
    y += 8;
    treatments.forEach((t, idx) => {
      doc.text(`${idx + 1}. ${t.description} ${t.dose ? `- ${t.dose} kg/ha` : ''}`, 14, y);
      y += 6;
      if (y > 280) { doc.addPage(); y = 20; }
    });

    y += 8;
    doc.text('Fertilizers', 14, y);
    y += 8;
    fertilizers.forEach((f, idx) => {
      doc.text(`${idx + 1}. ${f.name} - ${f.amount} kg/ha`, 14, y);
      y += 6;
      if (y > 280) { doc.addPage(); y = 20; }
    });

    y += 8;
    doc.text('Warehouse', 14, y);
    y += 8;
    products.forEach((p, idx) => {
      doc.text(`${idx + 1}. ${p.name} - ${p.quantity} ${p.unit || ''}`, 14, y);
      y += 6;
      if (y > 280) { doc.addPage(); y = 20; }
    });

    doc.save(`agronote-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Reports</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={generatePDF}>Download PDF</IonButton>

        <h3 style={{ marginTop: 18 }}>Quick Preview</h3>
        <h4>Treatments</h4>
        <IonList>
          {treatments.map(t => <IonItem key={t.id}>{t.description}</IonItem>)}
        </IonList>

        <h4>Fertilizers</h4>
        <IonList>
          {fertilizers.map(f => <IonItem key={f.id}>{f.name} - {f.amount} kg/ha</IonItem>)}
        </IonList>

        <h4>Warehouse</h4>
        <IonList>
          {products.map(p => <IonItem key={p.id}>{p.name} - {p.quantity} {p.unit}</IonItem>)}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ReportsPage;
