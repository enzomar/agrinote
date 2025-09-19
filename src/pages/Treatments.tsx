import React, { useState, useEffect } from "react";
import { SelectChangeEventDetail } from '@ionic/core';
import '../theme/shared-layouts.css';
import './Treatments.css';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonList,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonBadge,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonFab,
  IonFabButton,
  IonModal,
  IonButtons,
  IonGrid,
  IonRow,
  IonCol,
  IonNote,
  IonChip,
  IonAlert,
  IonMenuButton,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonDatetime,
  IonCheckbox,
  IonToast,
  IonActionSheet,
  IonProgressBar,
} from "@ionic/react";
import {
  add,
  create,
  trash,
  search,
  micOutline,
  micOffOutline,
  stopCircleOutline,
  checkmarkCircleOutline,
  warningOutline,
  calendarOutline,
  locationOutline,
  leafOutline,
  flaskOutline,
  timeOutline,
  listOutline,
  filterOutline,
  downloadOutline,
} from "ionicons/icons";

interface Treatment {
  id: string;
  date: string;
  crop: string;
  area: number;
  product: string;
  dosage: number;
  unit: string;
  method: string;
  weather: string;
  notes?: string;
  status: 'planned' | 'completed' | 'overdue';
  createdBy: 'manual' | 'voice' | 'import';
  aiValidation?: {
    status: 'valid' | 'warning' | 'error';
    message: string;
  };
}

type StatusFilter = 'all' | 'planned' | 'completed' | 'overdue';

const Treatments: React.FC = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([
    {
      id: '1',
      date: '2024-09-20',
      crop: 'Vigneto Sangiovese',
      area: 2.5,
      product: 'Rame ossicloruro',
      dosage: 3,
      unit: 'kg/ha',
      method: 'Nebulizzazione',
      weather: 'Sereno, 22°C, vento 5km/h',
      status: 'planned',
      createdBy: 'manual',
      aiValidation: {
        status: 'valid',
        message: 'Dosaggio conforme alle normative'
      }
    },
    {
      id: '2',
      date: '2024-09-18',
      crop: 'Oliveto',
      area: 1.2,
      product: 'Olio bianco',
      dosage: 1.5,
      unit: 'L/ha',
      method: 'Irrorazione',
      weather: 'Nuvoloso, 19°C',
      status: 'completed',
      createdBy: 'voice',
      notes: 'Inserito tramite comando vocale'
    },
    {
      id: '3',
      date: '2024-09-15',
      crop: 'Vigneto Chianti',
      area: 3.0,
      product: 'Zolfo bagnabile',
      dosage: 8,
      unit: 'kg/ha',
      method: 'Nebulizzazione',
      weather: 'Sereno, 25°C',
      status: 'overdue',
      createdBy: 'manual',
      aiValidation: {
        status: 'warning',
        message: 'Dosaggio elevato - verificare necessità'
      }
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchText, setSearchText] = useState('');
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Treatment>>({
    date: new Date().toISOString(),
    crop: '',
    area: 0,
    product: '',
    dosage: 0,
    unit: 'kg/ha',
    method: 'Nebulizzazione',
    weather: '',
    notes: '',
  });

  const statusLabels = {
    all: 'Tutti',
    planned: 'Programmati',
    completed: 'Completati',
    overdue: 'In ritardo',
  };

  const statusColors = {
    planned: 'primary',
    completed: 'success',
    overdue: 'danger',
  };

  // Mock products database for autocomplete
  const products = [
    'Rame ossicloruro',
    'Zolfo bagnabile',
    'Olio bianco',
    'Bacillus thuringiensis',
    'Spinosad',
    'Azoxystrobin',
  ];

  const crops = [
    'Vigneto Sangiovese',
    'Vigneto Chianti',
    'Oliveto',
    'Frutteto misto',
    'Orto',
  ];

  // Voice recognition simulation
  const startVoiceRecognition = () => {
    setIsListening(true);
    setVoiceText('');
    
    // Simulate voice recognition
    setTimeout(() => {
      const mockVoiceInput = "rame su vigneto 2 ettari 3 chili per ettaro";
      setVoiceText(mockVoiceInput);
      setIsListening(false);
      setIsProcessingVoice(true);
      
      // Process voice input with AI
      setTimeout(() => {
        processVoiceInput(mockVoiceInput);
        setIsProcessingVoice(false);
      }, 2000);
    }, 3000);
  };

  const stopVoiceRecognition = () => {
    setIsListening(false);
    setVoiceText('');
  };

  // AI Processing of voice input
  const processVoiceInput = (input: string) => {
    const processed = {
      product: 'Rame ossicloruro',
      crop: 'Vigneto Sangiovese',
      area: 2,
      dosage: 3,
      unit: 'kg/ha',
      date: new Date().toISOString(),
      method: 'Nebulizzazione',
      weather: 'Da verificare',
      aiValidation: {
        status: 'valid' as const,
        message: 'Trattamento standard conforme'
      }
    };

    setFormData(processed);
    setToastMessage('Comando vocale elaborato con successo!');
    setShowToast(true);
    setIsAddModalOpen(true);
  };

  // AI Validation
  const validateTreatment = (treatment: Partial<Treatment>) => {
    // Mock AI validation logic
    if (treatment.dosage && treatment.dosage > 5) {
      return {
        status: 'warning' as const,
        message: 'Dosaggio superiore alla norma - verificare etichetta prodotto'
      };
    }
    if (treatment.dosage && treatment.dosage > 10) {
      return {
        status: 'error' as const,
        message: 'ATTENZIONE: Dosaggio eccessivo - rischio fitotossicità'
      };
    }
    return {
      status: 'valid' as const,
      message: 'Trattamento conforme alle normative'
    };
  };

  const handleSubmit = () => {
    if (!formData.product || !formData.crop || !formData.area) {
      setToastMessage('Compila tutti i campi obbligatori');
      setShowToast(true);
      return;
    }

    const validation = validateTreatment(formData);
    
    const newTreatment: Treatment = {
      id: Date.now().toString(),
      date: formData.date || new Date().toISOString(),
      crop: formData.crop || '',
      area: formData.area || 0,
      product: formData.product || '',
      dosage: formData.dosage || 0,
      unit: formData.unit || 'kg/ha',
      method: formData.method || 'Nebulizzazione',
      weather: formData.weather || 'Da verificare',
      notes: formData.notes,
      status: 'planned',
      createdBy: voiceText ? 'voice' : 'manual',
      aiValidation: validation,
    };

    setTreatments(prev => [newTreatment, ...prev]);
    setToastMessage('Trattamento aggiunto con successo');
    setShowToast(true);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString(),
      crop: '',
      area: 0,
      product: '',
      dosage: 0,
      unit: 'kg/ha',
      method: 'Nebulizzazione',
      weather: '',
      notes: '',
    });
    setVoiceText('');
    setIsAddModalOpen(false);
  };

  const markAsCompleted = (id: string) => {
    setTreatments(prev => 
      prev.map(t => 
        t.id === id 
          ? { ...t, status: 'completed' as const }
          : t
      )
    );
    setToastMessage('Trattamento completato');
    setShowToast(true);
  };

  const deleteTreatment = (id: string) => {
    setTreatments(prev => prev.filter(t => t.id !== id));
    setToastMessage('Trattamento eliminato');
    setShowToast(true);
  };

  // Filter treatments
  const filteredTreatments = treatments.filter(treatment => {
    const matchesStatus = statusFilter === 'all' || treatment.status === statusFilter;
    const matchesSearch = treatment.product.toLowerCase().includes(searchText.toLowerCase()) ||
                         treatment.crop.toLowerCase().includes(searchText.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getValidationIcon = (status: string) => {
    switch (status) {
      case 'valid': return checkmarkCircleOutline;
      case 'warning': return warningOutline;
      case 'error': return warningOutline;
      default: return checkmarkCircleOutline;
    }
  };

  const getValidationColor = (status: string) => {
    switch (status) {
      case 'valid': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'danger';
      default: return 'medium';
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>
            <div className="page-title">🚜 Trattamenti</div>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowActionSheet(true)}>
              <IonIcon icon={listOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="page-container">
          {/* Quick Stats */}
          <div className="stats-card">
            <div className="stats-grid">
              <div className="stat-item fade-in">
                <div className="stat-number">{treatments.filter(t => t.status === 'planned').length}</div>
                <div className="stat-label">Programmati</div>
              </div>
              <div className="stat-item fade-in">
                <div className="stat-number">{treatments.filter(t => t.status === 'completed').length}</div>
                <div className="stat-label">Completati</div>
              </div>
              <div className="stat-item fade-in">
                <div className="stat-number text-danger">{treatments.filter(t => t.status === 'overdue').length}</div>
                <div className="stat-label">In ritardo</div>
              </div>
              <div className="stat-item fade-in">
                <div className="stat-number">{treatments.length}</div>
                <div className="stat-label">Totale</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          {/* Main Content */}
          <div className="content-wrapper">
            {/* Voice Recognition Card */}
        {(isListening || isProcessingVoice || voiceText) && (
          <IonCard color={isListening ? 'primary' : isProcessingVoice ? 'warning' : 'success'}>
            <IonCardContent>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IonIcon 
                  icon={isListening ? micOutline : isProcessingVoice ? flaskOutline : checkmarkCircleOutline} 
                  style={{ fontSize: '24px', marginRight: '12px' }}
                />
                <div>
                  {isListening && <p>🎤 Sto ascoltando... Parla ora!</p>}
                  {isProcessingVoice && (
                    <>
                      <p>🤖 Elaborazione AI in corso...</p>
                      <IonProgressBar type="indeterminate" />
                    </>
                  )}
                  {voiceText && !isProcessingVoice && (
                    <p>✅ Riconosciuto: "{voiceText}"</p>
                  )}
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        )}

        {/* Search and Filter */}
        <IonSearchbar
          value={searchText}
          onIonInput={(e) => setSearchText(e.detail.value!)}
          placeholder="Cerca trattamenti..."
        />

        <IonSegment
          value={statusFilter}
          onIonChange={(e) => setStatusFilter(e.detail.value as StatusFilter)}
        >
          {Object.entries(statusLabels).map(([key, label]) => (
            <IonSegmentButton key={key} value={key}>
              <IonLabel>{label}</IonLabel>
            </IonSegmentButton>
          ))}
        </IonSegment>

        {/* Treatments List */}
        <IonList>
          {filteredTreatments.map((treatment) => (
            <IonItemSliding key={treatment.id}>
              <IonItem>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, fontWeight: '600' }}>
                      {treatment.product}
                    </h3>
                    <IonBadge color={statusColors[treatment.status]}>
                      {statusLabels[treatment.status]}
                    </IonBadge>
                  </div>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <IonChip color="medium">
                      <IonIcon icon={locationOutline} />
                      <IonLabel>{treatment.crop}</IonLabel>
                    </IonChip>
                    <IonChip color="medium">
                      <IonIcon icon={calendarOutline} />
                      <IonLabel>{new Date(treatment.date).toLocaleDateString('it-IT')}</IonLabel>
                    </IonChip>
                  </div>

                  <IonGrid style={{ padding: 0 }}>
                    <IonRow>
                      <IonCol size="6">
                        <IonNote>Area: {treatment.area} ha</IonNote>
                      </IonCol>
                      <IonCol size="6">
                        <IonNote>Dose: {treatment.dosage} {treatment.unit}</IonNote>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <IonNote>{treatment.method} • {treatment.weather}</IonNote>
                      </IonCol>
                    </IonRow>
                  </IonGrid>

                  {treatment.aiValidation && (
                    <div style={{ marginTop: '8px' }}>
                      <IonChip color={getValidationColor(treatment.aiValidation.status)}>
                        <IonIcon icon={getValidationIcon(treatment.aiValidation.status)} />
                        <IonLabel>{treatment.aiValidation.message}</IonLabel>
                      </IonChip>
                    </div>
                  )}

                  {treatment.createdBy === 'voice' && (
                    <IonChip color="tertiary" style={{ marginTop: '4px' }}>
                      <IonIcon icon={micOutline} />
                      <IonLabel>Comando vocale</IonLabel>
                    </IonChip>
                  )}
                </div>
              </IonItem>

              <IonItemOptions side="end">
                {treatment.status === 'planned' && (
                  <IonItemOption 
                    color="success" 
                    onClick={() => markAsCompleted(treatment.id)}
                  >
                    <IonIcon icon={checkmarkCircleOutline} />
                  </IonItemOption>
                )}
                <IonItemOption 
                  color="primary" 
                  onClick={() => {/* Edit logic */}}
                >
                  <IonIcon icon={create} />
                </IonItemOption>
                <IonItemOption 
                  color="danger" 
                  onClick={() => deleteTreatment(treatment.id)}
                >
                  <IonIcon icon={trash} />
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
        </IonList>

        {/* Add Treatment FAB */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton 
            color="secondary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        {/* Voice Input FAB */}
        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton 
            color={isListening ? "danger" : "tertiary"}
            onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
            disabled={isProcessingVoice}
          >
            <IonIcon icon={isListening ? stopCircleOutline : micOutline} />
          </IonFabButton>
        </IonFab>

        {/* Add Treatment Modal */}
        <IonModal isOpen={isAddModalOpen} onDidDismiss={resetForm}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nuovo Trattamento</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={resetForm}>Chiudi</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            {voiceText && (
              <IonCard color="success">
                <IonCardContent>
                  <p><strong>Input vocale riconosciuto:</strong></p>
                  <p>"{voiceText}"</p>
                </IonCardContent>
              </IonCard>
            )}

            <IonItem>
              <IonLabel position="stacked">Data Trattamento</IonLabel>
              <IonDatetime
                value={formData.date}
                onIonChange={(e) => setFormData(prev => ({ ...prev, date: e.detail.value as string }))}
                presentation="date"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Coltura *</IonLabel>
              <IonSelect
                value={formData.crop}
                onIonChange={(e) => setFormData(prev => ({ ...prev, crop: e.detail.value }))}
                placeholder="Seleziona coltura"
              >
                {crops.map(crop => (
                  <IonSelectOption key={crop} value={crop}>{crop}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Superficie (ha) *</IonLabel>
              <IonInput
                type="number"
                value={formData.area}
                onIonInput={(e) => setFormData(prev => ({ ...prev, area: parseFloat(e.detail.value!) || 0 }))}
                placeholder="es. 2.5"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Prodotto *</IonLabel>
              <IonSelect
                value={formData.product}
                onIonChange={(e) => setFormData(prev => ({ ...prev, product: e.detail.value }))}
                placeholder="Seleziona prodotto"
              >
                {products.map(product => (
                  <IonSelectOption key={product} value={product}>{product}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonItem>
                    <IonLabel position="stacked">Dosaggio *</IonLabel>
                    <IonInput
                      type="number"
                      value={formData.dosage}
                      onIonInput={(e) => setFormData(prev => ({ ...prev, dosage: parseFloat(e.detail.value!) || 0 }))}
                      placeholder="es. 3"
                    />
                  </IonItem>
                </IonCol>
                <IonCol>
                  <IonItem>
                    <IonLabel position="stacked">Unità</IonLabel>
                    <IonSelect
                      value={formData.unit}
                      onIonChange={(e) => setFormData(prev => ({ ...prev, unit: e.detail.value }))}
                    >
                      <IonSelectOption value="kg/ha">kg/ha</IonSelectOption>
                      <IonSelectOption value="L/ha">L/ha</IonSelectOption>
                      <IonSelectOption value="g/ha">g/ha</IonSelectOption>
                      <IonSelectOption value="mL/ha">mL/ha</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonGrid>

            {/* AI Validation Preview */}
            {formData.dosage && formData.dosage > 0 && (
              <IonCard color={getValidationColor(validateTreatment(formData).status)}>
                <IonCardContent>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IonIcon 
                      icon={getValidationIcon(validateTreatment(formData).status)}
                      style={{ marginRight: '8px' }}
                    />
                    <span>
                      <strong>Validazione AI:</strong> {validateTreatment(formData).message}
                    </span>
                  </div>
                </IonCardContent>
              </IonCard>
            )}

            <IonItem>
              <IonLabel position="stacked">Metodo</IonLabel>
              <IonSelect
                value={formData.method}
                onIonChange={(e) => setFormData(prev => ({ ...prev, method: e.detail.value }))}
              >
                <IonSelectOption value="Nebulizzazione">Nebulizzazione</IonSelectOption>
                <IonSelectOption value="Irrorazione">Irrorazione</IonSelectOption>
                <IonSelectOption value="Polverizzazione">Polverizzazione</IonSelectOption>
                <IonSelectOption value="Distribuzione granulare">Distribuzione granulare</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Condizioni Meteo</IonLabel>
              <IonInput
                value={formData.weather}
                onIonInput={(e) => setFormData(prev => ({ ...prev, weather: e.detail.value! }))}
                placeholder="es. Sereno, 22°C, vento 5km/h"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Note</IonLabel>
              <IonTextarea
                value={formData.notes}
                onIonInput={(e) => setFormData(prev => ({ ...prev, notes: e.detail.value! }))}
                placeholder="Note aggiuntive..."
                rows={3}
              />
            </IonItem>

            <IonButton 
              expand="block" 
              onClick={handleSubmit}
              style={{ marginTop: '20px' }}
            >
              Aggiungi Trattamento
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Action Sheet */}
        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          buttons={[
            {
              text: 'Esporta PDF',
              icon: downloadOutline,
              handler: () => {
                setToastMessage('Export PDF in corso...');
                setShowToast(true);
              }
            },
            {
              text: 'Filtri avanzati',
              icon: filterOutline,
              handler: () => {
                // Open advanced filters
              }
            },
            {
              text: 'Annulla',
              role: 'cancel'
            }
          ]}
        />

        {/* Toast */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="bottom"
        />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Treatments;