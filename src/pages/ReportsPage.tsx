// src/pages/ReportsPage.tsx
import React, { useContext, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonToast,
} from '@ionic/react';
import { AppContext } from '../context/AppContext';
import '../pages/Home.css';

const ReportsPage: React.FC = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('AppContext not found');

  const [toast, setToast] = useState<{show: boolean; msg: string}>({ show: false, msg: '' });

  const reports = [
    {
      id: 'campo',
      title: '📋 Quaderno di Campagna',
      description: 'Report completo dei trattamenti effettuati',
      period: 'Periodo: Gennaio - Settembre 2025'
    },
    {
      id: 'bio',
      title: '🌿 Certificazione Biologica',
      description: 'Report per enti di certificazione bio',
      period: 'Conforme ai reg. UE 2018/848'
    },
    {
      id: 'gap',
      title: '🏆 SQNPI - GlobalGAP',
      description: 'Report per certificazioni di qualità',
      period: 'Standard internazionali'
    },
    {
      id: 'costi',
      title: '📈 Analisi Costi',
      description: 'Riepilogo spese per trattamenti e concimi',
      period: 'Budget 2025: €2,350 / €3,000'
    }
  ];

  const downloadReport = (type: string) => {
    const reportTypes: { [key: string]: string } = {
      'campo': 'Quaderno di Campagna',
      'bio': 'Certificazione Biologica',
      'gap': 'Report GlobalGAP',
      'costi': 'Analisi Costi'
    };
    
    setToast({ 
      show: true, 
      msg: `Sto generando il ${reportTypes[type]}...\n\nIn un'app reale, il PDF verrebbe scaricato automaticamente e inviato via email.`
    });
    
    // Simulate PDF generation
    setTimeout(() => {
      setToast({ 
        show: true, 
        msg: `${reportTypes[type]} generato con successo!\n\n📧 Inviato a: farmer@example.com\n📱 Salvato nel dispositivo`
      });
    }, 2000);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="header-gradient">
          <IonTitle>📊 Report</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="home-container">
          <h2 style={{ color: '#2f703a', marginBottom: '20px' }}>
            📊 Report & Certificazioni
          </h2>
          
          {reports.map((report) => (
            <div key={report.id} className="report-card">
              <h4>{report.title}</h4>
              <p>{report.description}</p>
              <p style={{ color: '#666', fontSize: '14px' }}>
                {report.period}
              </p>
              <button 
                className="btn" 
                onClick={() => downloadReport(report.id)}
              >
                📥 Scarica PDF
              </button>
            </div>
          ))}

          <div style={{ marginTop: '30px', textAlign: 'center', color: '#666' }}>
            <p>📧 I report vengono inviati automaticamente alla tua email</p>
          </div>
        </div>

        <IonToast 
          isOpen={toast.show} 
          message={toast.msg}
          duration={4000} 
          onDidDismiss={() => setToast({ show: false, msg: '' })} 
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default ReportsPage;