import React, { useContext, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonList,
  IonToast,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonBadge,
  IonNote,
  IonDatetime,
  IonTextarea,
  IonFab,
  IonFabButton,
} from '@ionic/react';
import {
  leafOutline,
  addOutline,
  micOutline,
  checkmarkCircleOutline,
  timeOutline,
  warningOutline,
  calendarOutline,
} from 'ionicons/icons';
import { AppContext } from '../context/AppContext';

interface Fertilization {
  id: string;
  description: string;
  date: string;
  crop: string;
  fertilizerType: string;
  dose: number;
  unit: string;
  area: number;
  method: string;
  notes?: string;
  status: 'planned' | 'completed' | 'overdue';
  npkRatio?: string;
  organicContent?: number;
}

const FertilizingPage: React.FC = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('AppContext not found');

  // Mock fertilizations data - in real app this would come from context
  const [fertilizations, setFertilizations] = useState<Fertilization[]>([
    {
      id: '1',
      description: 'Concimazione NPK primaverile vigneto',
      date: '2024-03-15',
      crop: 'vineyard',
      fertilizerType: 'NPK 15-15-15',
      dose: 300,
      unit: 'kg/ha',
      area: 2.5,
      method: 'Broadcasting',
      status: 'completed',
      npkRatio: '15-15-15',
    },
    {
      id: '2',
      description: 'Concime organico oliveto',
      date: '2024-09-25',
      crop: 'olive_grove',
      fertilizerType: 'Compost maturo',
      dose: 500,
      unit: 'kg/ha',
      area: 1.8,
      method: 'Incorporation',
      status: 'planned',
      organicContent: 85,
      notes: 'Applicare prima delle piogge autunnali',
    },
  ]);

  const [formData, setFormData] = useState({
    description: '',
    date: new Date().toISOString(),
    crop: '',
    fertilizerType: '',
    dose: '',
    unit: 'kg/ha',
    area: '',
    method: 'Broadcasting',
    notes: '',
    npkRatio: '',
    organicContent: '',
  });

  const [toast, setToast] = useState<{show: boolean; msg: string}>({ show: false, msg: '' });
  const [isListening, setIsListening] = useState(false);

  const fertilizerTypes = [
    'NPK 15-15-15',
    'NPK 20-10-10',
    'Urea 46%',
    'Superfosfato',
    'Solfato di Potassio',
    'Compost maturo',
    'Letame bovino',
    'Humus di lombrico',
    'Concime pellettato',
    'Fertilizzante liquido',
  ];

  const cropTypes = [
    { value: 'vineyard', label: 'Vigneto' },
    { value: 'olive_grove', label: 'Oliveto' },
    { value: 'orchard', label: 'Frutteto' },
    { value: 'vegetable_garden', label: 'Orto' },
    { value: 'cereal', label: 'Cereali' },
    { value: 'legume', label: 'Leguminose' },
  ];

  const applicationMethods = [
    'Broadcasting',
    'Band application',
    'Incorporation',
    'Fertigation',
    'Foliar spray',
    'Side-dress',
  ];

  const startVoiceRecognition = async () => {
    const AnyWindow = window as any;
    const Speech = AnyWindow.SpeechRecognition || AnyWindow.webkitSpeechRecognition;
    
    if (!Speech) {
      setToast({ show: true, msg: 'Riconoscimento vocale non supportato' });
      return;
    }

    setIsListening(true);
    const sr = new Speech();
    sr.lang = 'it-IT';
    sr.interimResults = false;
    sr.maxAlternatives = 1;

    sr.onresult = (ev: any) => {
      const txt = ev.results[0][0].transcript.toLowerCase();
      
      // Parse voice input for fertilization
      setFormData(prev => ({ ...prev, description: txt }));

      // Extract fertilizer type
      if (txt.includes('npk') || txt.includes('enne pi kappa')) {
        setFormData(prev => ({ ...prev, fertilizerType: 'NPK 15-15-15' }));
      } else if (txt.includes('compost') || txt.includes('organico')) {
        setFormData(prev => ({ ...prev, fertilizerType: 'Compost maturo' }));
      } else if (txt.includes('letame')) {
        setFormData(prev => ({ ...prev, fertilizerType: 'Letame bovino' }));
      } else if (txt.includes('urea')) {
        setFormData(prev => ({ ...prev, fertilizerType: 'Urea 46%' }));
      }

      // Extract crop
      if (txt.includes('vigneto') || txt.includes('vigna')) {
        setFormData(prev => ({ ...prev, crop: 'vineyard' }));
      } else if (txt.includes('oliveto') || txt.includes('ulivo')) {
        setFormData(prev => ({ ...prev, crop: 'olive_grove' }));
      } else if (txt.includes('orto')) {
        setFormData(prev => ({ ...prev, crop: 'vegetable_garden' }));
      } else if (txt.includes('frutteto') || txt.includes('frutta')) {
        setFormData(prev => ({ ...prev, crop: 'orchard' }));
      }

      // Extract dose
      const doseMatch = txt.match(/(\d+(?:[.,]\d+)?)\s*(kg|chilogram|quintali)/i);
      if (doseMatch) {
        let dose = parseFloat(doseMatch[1].replace(',', '.'));
        if (doseMatch[2].toLowerCase().includes('quintali')) dose *= 100;
        setFormData(prev => ({ ...prev, dose: dose.toString() }));
      }

      // Extract area
      const areaMatch = txt.match(/(\d+(?:[.,]\d+)?)\s*(ha|ettari|ettaro)/i);
      if (areaMatch) {
        setFormData(prev => ({ ...prev, area: areaMatch[1].replace(',', '.') }));
      }

      setIsListening(false);
      setToast({ show: true, msg: 'Comando vocale elaborato!' });
    };

    sr.onerror = () => {
      setIsListening(false);
      setToast({ show: true, msg: 'Errore riconoscimento vocale' });
    };

    sr.start();
  };

  const saveFertilization = () => {
    if (!formData.description || !formData.dose || !formData.area) {
      setToast({ show: true, msg: 'Compila almeno descrizione, dose e superficie' });
      return;
    }

    const newFertilization: Fertilization = {
      id: Date.now().toString(),
      description: formData.description,
      date: formData.date,
      crop: formData.crop,
      fertilizerType: formData.fertilizerType,
      dose: parseFloat(formData.dose),
      unit: formData.unit,
      area: parseFloat(formData.area),
      method: formData.method,
      notes: formData.notes,
      status: 'planned',
      npkRatio: formData.npkRatio || undefined,
      organicContent: formData.organicContent ? parseFloat(formData.organicContent) : undefined,
    };

    setFertilizations(prev => [newFertilization, ...prev]);
    
    // Reset form
    setFormData({
      description: '',
      date: new Date().toISOString(),
      crop: '',
      fertilizerType: '',
      dose: '',
      unit: 'kg/ha',
      area: '',
      method: 'Broadcasting',
      notes: '',
      npkRatio: '',
      organicContent: '',
    });

    setToast({ show: true, msg: 'Concimazione salvata con successo!' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'overdue': return 'danger';
      case 'planned': return 'primary';
      default: return 'medium';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completata';
      case 'overdue': return 'In ritardo';
      case 'planned': return 'Programmata';
      default: return 'Sconosciuta';
    }
  };

  const getCropLabel = (cropValue: string) => {
    return cropTypes.find(c => c.value === cropValue)?.label || cropValue;
  };

  const calculateTotalAmount = (dose: number, area: number) => {
    return (dose * area).toFixed(1);
  };

  const plannedCount = fertilizations.filter(f => f.status === 'planned').length;
  const completedCount = fertilizations.filter(f => f.status === 'completed').length;
  const overdueCount = fertilizations.filter(f => f.status === 'overdue').length;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonTitle>🌿 Concimazioni</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Stats Card */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle style={{ display: 'flex', alignItems: 'center' }}>
              <IonIcon icon={leafOutline} style={{ marginRight: '8px' }} />
              Riepilogo Concimazioni
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow className="ion-text-center">
                <IonCol>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--ion-color-primary)' }}>
                    {plannedCount}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ion-color-medium)' }}>
                    Programmate
                  </div>
                </IonCol>
                <IonCol>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--ion-color-success)' }}>
                    {completedCount}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ion-color-medium)' }}>
                    Completate
                  </div>
                </IonCol>
                <IonCol>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--ion-color-danger)' }}>
                    {overdueCount}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ion-color-medium)' }}>
                    In ritardo
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* Voice Input Indicator */}
        {isListening && (
          <IonCard color="tertiary">
            <IonCardContent>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IonIcon icon={micOutline} style={{ fontSize: '24px', marginRight: '12px' }} />
                <span>🎤 Sto ascoltando... Descrivi la concimazione!</span>
              </div>
            </IonCardContent>
          </IonCard>
        )}

        {/* Form */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Nuova Concimazione</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel position="stacked">Descrizione *</IonLabel>
              <IonInput
                value={formData.description}
                placeholder="es. concime NPK vigneto 300 kg/ha"
                onIonChange={e => setFormData(prev => ({ ...prev, description: e.detail.value! }))}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Data Applicazione</IonLabel>
              <IonDatetime
                value={formData.date}
                presentation="date"
                onIonChange={e => setFormData(prev => ({ ...prev, date: e.detail.value as string }))}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Coltura</IonLabel>
              <IonSelect
                value={formData.crop}
                placeholder="Seleziona coltura"
                onSelectionChange={e => setFormData(prev => ({ ...prev, crop: e.detail.value }))}
              >
                {cropTypes.map(crop => (
                  <IonSelectOption key={crop.value} value={crop.value}>
                    {crop.label}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Tipo Fertilizzante</IonLabel>
              <IonSelect
                value={formData.fertilizerType}
                placeholder="Seleziona fertilizzante"
                onSelectionChange={e => setFormData(prev => ({ ...prev, fertilizerType: e.detail.value }))}
              >
                {fertilizerTypes.map(type => (
                  <IonSelectOption key={type} value={type}>
                    {type}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonItem>
                    <IonLabel position="stacked">Dose *</IonLabel>
                    <IonInput
                      type="number"
                      step="0.1"
                      value={formData.dose}
                      placeholder="300"
                      onIonChange={e => setFormData(prev => ({ ...prev, dose: e.detail.value! }))}
                    />
                  </IonItem>
                </IonCol>
                <IonCol>
                  <IonItem>
                    <IonLabel position="stacked">Unità</IonLabel>
                    <IonSelect
                      value={formData.unit}
                      onSelectionChange={e => setFormData(prev => ({ ...prev, unit: e.detail.value }))}
                    >
                      <IonSelectOption value="kg/ha">kg/ha</IonSelectOption>
                      <IonSelectOption value="t/ha">t/ha</IonSelectOption>
                      <IonSelectOption value="L/ha">L/ha</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonGrid>

            <IonItem>
              <IonLabel position="stacked">Superficie (ha) *</IonLabel>
              <IonInput
                type="number"
                step="0.1"
                value={formData.area}
                placeholder="2.5"
                onIonChange={e => setFormData(prev => ({ ...prev, area: e.detail.value! }))}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Metodo Applicazione</IonLabel>
              <IonSelect
                value={formData.method}
                onSelectionChange={e => setFormData(prev => ({ ...prev, method: e.detail.value }))}
              >
                {applicationMethods.map(method => (
                  <IonSelectOption key={method} value={method}>
                    {method}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            {formData.fertilizerType.includes('NPK') && (
              <IonItem>
                <IonLabel position="stacked">Rapporto NPK</IonLabel>
                <IonInput
                  value={formData.npkRatio}
                  placeholder="es. 15-15-15"
                  onIonChange={e => setFormData(prev => ({ ...prev, npkRatio: e.detail.value! }))}
                />
              </IonItem>
            )}

            {(formData.fertilizerType.includes('Compost') || formData.fertilizerType.includes('organico')) && (
              <IonItem>
                <IonLabel position="stacked">Contenuto Organico (%)</IonLabel>
                <IonInput
                  type="number"
                  step="0.1"
                  value={formData.organicContent}
                  placeholder="85"
                  onIonChange={e => setFormData(prev => ({ ...prev, organicContent: e.detail.value! }))}
                />
              </IonItem>
            )}

            <IonItem>
              <IonLabel position="stacked">Note</IonLabel>
              <IonTextarea
                value={formData.notes}
                placeholder="Note aggiuntive..."
                rows={3}
                onIonChange={e => setFormData(prev => ({ ...prev, notes: e.detail.value! }))}
              />
            </IonItem>

            <IonButton expand="block" onClick={saveFertilization} style={{ marginTop: '16px' }}>
              <IonIcon icon={addOutline} slot="start" />
              Salva Concimazione
            </IonButton>

            <IonButton
              expand="block"
              color="tertiary"
              fill="outline"
              onClick={startVoiceRecognition}
              disabled={isListening}
            >
              <IonIcon icon={micOutline} slot="start" />
              {isListening ? 'Ascolto in corso...' : 'Input Vocale'}
            </IonButton>
          </IonCardContent>
        </IonCard>

        {/* Recent Fertilizations */}
        <h3 style={{ marginTop: '24px', marginBottom: '16px', color: 'var(--ion-color-success)' }}>
          Concimazioni Recenti
        </h3>

        {fertilizations.map(fertilization => (
          <IonCard key={fertilization.id}>
            <IonCardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontWeight: '600' }}>{fertilization.fertilizerType}</h3>
                <IonBadge color={getStatusColor(fertilization.status)}>
                  {getStatusText(fertilization.status)}
                </IonBadge>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <IonIcon icon={leafOutline} style={{ marginRight: '8px', fontSize: '16px' }} />
                <span style={{ marginRight: '16px' }}>{getCropLabel(fertilization.crop)}</span>
                
                <IonIcon icon={calendarOutline} style={{ marginRight: '8px', fontSize: '16px' }} />
                <span>{new Date(fertilization.date).toLocaleDateString('it-IT')}</span>
              </div>

              <IonGrid style={{ padding: 0 }}>
                <IonRow>
                  <IonCol size="4">
                    <IonNote style={{ fontSize: '12px' }}>Dose</IonNote>
                    <div style={{ fontWeight: '600' }}>
                      {fertilization.dose} {fertilization.unit}
                    </div>
                  </IonCol>
                  <IonCol size="4">
                    <IonNote style={{ fontSize: '12px' }}>Superficie</IonNote>
                    <div style={{ fontWeight: '600' }}>
                      {fertilization.area} ha
                    </div>
                  </IonCol>
                  <IonCol size="4">
                    <IonNote style={{ fontSize: '12px' }}>Totale</IonNote>
                    <div style={{ fontWeight: '600' }}>
                      {calculateTotalAmount(fertilization.dose, fertilization.area)} kg
                    </div>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonNote style={{ fontSize: '12px' }}>Metodo</IonNote>
                    <div>{fertilization.method}</div>
                  </IonCol>
                </IonRow>
              </IonGrid>

              {fertilization.npkRatio && (
                <div style={{ marginTop: '8px' }}>
                  <span style={{ 
                    backgroundColor: 'var(--ion-color-success-tint)', 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    color: 'var(--ion-color-success-contrast)'
                  }}>
                    NPK {fertilization.npkRatio}
                  </span>
                </div>
              )}

              {fertilization.organicContent && (
                <div style={{ marginTop: '8px' }}>
                  <span style={{ 
                    backgroundColor: 'var(--ion-color-secondary-tint)', 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    color: 'var(--ion-color-secondary-contrast)'
                  }}>
                    🌱 {fertilization.organicContent}% Organico
                  </span>
                </div>
              )}

              {fertilization.notes && (
                <p style={{ 
                  margin: '12px 0 0 0', 
                  fontSize: '14px', 
                  color: 'var(--ion-color-medium)',
                  fontStyle: 'italic',
                  padding: '8px',
                  backgroundColor: 'var(--ion-color-light)',
                  borderRadius: '8px'
                }}>
                  📝 {fertilization.notes}
                </p>
              )}
            </IonCardContent>
          </IonCard>
        ))}

        {fertilizations.length === 0 && (
          <IonCard>
            <IonCardContent style={{ textAlign: 'center', padding: '40px' }}>
              <IonIcon 
                icon={leafOutline} 
                style={{ fontSize: '64px', color: 'var(--ion-color-medium)', marginBottom: '16px' }}
              />
              <h3>Nessuna Concimazione</h3>
              <p style={{ color: 'var(--ion-color-medium)' }}>
                Aggiungi la tua prima concimazione utilizzando il form sopra
              </p>
            </IonCardContent>
          </IonCard>
        )}

        {/* FAB for quick add */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="success" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        <IonToast
          isOpen={toast.show}
          message={toast.msg}
          duration={3000}
          position="bottom"
          onDidDismiss={() => setToast({ show: false, msg: '' })}
        />
      </IonContent>
    </IonPage>
  );
};

export default FertilizingPage;