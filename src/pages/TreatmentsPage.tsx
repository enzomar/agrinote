import React, { useContext, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonList, IonToast } from '@ionic/react';
import { AppContext } from '../context/AppContext';

const TreatmentsPage: React.FC = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('AppContext not found');

  const { treatments, addTreatment } = ctx;
  const [description, setDescription] = useState('');
  const [dose, setDose] = useState<string>('');
  const [crop, setCrop] = useState('');
  const [area, setArea] = useState<string>('');
  const [toast, setToast] = useState<{show: boolean; msg: string}>({ show: false, msg: '' });

  // voice recognition fallback using Web Speech API
  const startVoiceRecognition = async () => {
    const AnyWindow = window as any;
    const Speech = AnyWindow.SpeechRecognition || AnyWindow.webkitSpeechRecognition;
    if (!Speech) {
      setToast({ show: true, msg: 'Voice recognition not supported in this browser' });
      return;
    }
    const sr = new Speech();
    sr.lang = 'it-IT';
    sr.interimResults = false;
    sr.maxAlternatives = 1;
    sr.onresult = (ev: any) => {
      const txt = ev.results[0][0].transcript;
      // small parse heuristics
      setDescription(txt);
      const doseMatch = txt.match(/(\d+(?:[.,]\d+)?)\s*(kg|l|kg\/ha|l\/ha)/i);
      if (doseMatch) setDose(doseMatch[1].replace(',', '.'));
      const areaMatch = txt.match(/(\d+(?:[.,]\d+)?)\s*(ha|ettari|ettaro)/i);
      if (areaMatch) setArea(areaMatch[1].replace(',', '.'));
    };
    sr.onerror = () => setToast({ show: true, msg: 'Voice recognition error' });
    sr.start();
  };

  const save = () => {
    if (!description || (!dose && !area)) {
      setToast({ show: true, msg: 'Please fill at least description and dose/area' });
      return;
    }
    const t = {
      id: Date.now().toString(),
      description,
      date: new Date().toISOString(),
      crop,
      product: description,
      dose: dose ? parseFloat(dose) : undefined,
      area: area ? parseFloat(area) : undefined,
    };
    addTreatment(t);
    setDescription(''); setDose(''); setArea(''); setCrop('');
    setToast({ show: true, msg: 'Treatment saved' });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Treatments</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Description</IonLabel>
          <IonInput value={description} placeholder="e.g. copper on vineyard 2 ha 3 kg/ha" onIonChange={e => setDescription(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Dose (kg/ha or L/ha)</IonLabel>
          <IonInput value={dose} type="number" step="0.1" onIonChange={e => setDose(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Area (ha)</IonLabel>
          <IonInput value={area} type="number" step="0.1" onIonChange={e => setArea(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Crop</IonLabel>
          <IonInput value={crop} placeholder="e.g. vineyard" onIonChange={e => setCrop(e.detail.value!)} />
        </IonItem>

        <IonButton expand="block" onClick={save}>Save Treatment</IonButton>
        <IonButton expand="block" color="tertiary" onClick={startVoiceRecognition}>Voice Input (Italian)</IonButton>

        <h3 style={{ marginTop: 18 }}>Recent Treatments</h3>
        <IonList>
          {treatments.map(t => (
            <IonItem key={t.id}>
              <div style={{ width: '100%' }}>
                <strong>{t.description}</strong>
                <div style={{ fontSize: 13, color: 'var(--ion-color-medium)' }}>
                  {t.dose ? `${t.dose} kg/ha` : ''} {t.area ? `• ${t.area} ha` : ''}
                  <div>{new Date(t.date).toLocaleString()}</div>
                </div>
              </div>
            </IonItem>
          ))}
        </IonList>

        <IonToast isOpen={toast.show} message={toast.msg} duration={2000} onDidDismiss={() => setToast({ show: false, msg: '' })} />
      </IonContent>
    </IonPage>
  );
};

export default TreatmentsPage;
