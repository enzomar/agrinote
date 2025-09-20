// src/pages/TreatmentsPage.tsx
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
  IonCardContent,
} from '@ionic/react';
import { AppContext } from '../context/AppContext';
import '../pages/Home.css'; // Import shared styles

const TreatmentsPage: React.FC = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('AppContext not found');

  const { treatments, addTreatment } = ctx;
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [crop, setCrop] = useState('');
  const [product, setProduct] = useState('');
  const [dose, setDose] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [toast, setToast] = useState<{show: boolean; msg: string}>({ show: false, msg: '' });
  const [isRecording, setIsRecording] = useState(false);
  const [aiValidation, setAiValidation] = useState<string>('');

  // Treatment validation data
  const treatmentData = {
    maxDoses: {
      'rame': 4.0,
      'zolfo': 8.0,
      'olio': 1.5,
      'insetticida': 2.0
    },
    warningMessages: {
      'rame': 'Attenzione: il rame ha limiti annuali rigidi per il biologico',
      'zolfo': 'Lo zolfo può causare fitotossicità con temperature > 28°C',
      'olio': 'Non applicare olio minerale in fioritura',
      'insetticida': 'Rispettare i tempi di carenza prima del raccolto'
    }
  };

  // Voice recognition
  const startVoiceRecognition = async () => {
    const AnyWindow = window as any;
    const Speech = AnyWindow.SpeechRecognition || AnyWindow.webkitSpeechRecognition;
    
    if (!Speech) {
      setToast({ show: true, msg: 'Riconoscimento vocale non supportato' });
      return;
    }

    setIsRecording(true);
    const sr = new Speech();
    sr.lang = 'it-IT';
    sr.interimResults = false;
    sr.maxAlternatives = 1;

    sr.onresult = (ev: any) => {
      const txt = ev.results[0][0].transcript.toLowerCase();
      setDescription(txt);
      parseVoiceInput(txt);
      setIsRecording(false);
    };

    sr.onerror = () => {
      setIsRecording(false);
      setToast({ show: true, msg: 'Errore riconoscimento vocale' });
    };

    sr.start();
  };

  // Parse voice input with AI
  const parseVoiceInput = (input: string) => {
    // Extract product
    if (input.includes('rame')) {
      setProduct('rame');
    } else if (input.includes('zolfo')) {
      setProduct('zolfo');
    } else if (input.includes('olio')) {
      setProduct('olio');
    } else if (input.includes('insetticida')) {
      setProduct('insetticida');
    }
    
    // Extract crop
    if (input.includes('vigneto')) {
      setCrop('vigneto');
    } else if (input.includes('oliveto')) {
      setCrop('oliveto');
    } else if (input.includes('frutteto')) {
      setCrop('frutteto');
    }
    
    // Extract dose
    const doseMatch = input.match(/(\d+(?:\.\d+)?)\s*(?:kg|chilogram)/i);
    if (doseMatch) {
      setDose(doseMatch[1]);
      validateDose(product, parseFloat(doseMatch[1]));
    }
    
    // Extract area
    const areaMatch = input.match(/(\d+(?:\.\d+)?)\s*(?:ettari|ettaro|ha)/i);
    if (areaMatch) {
      setArea(areaMatch[1]);
    }
    
    setToast({ show: true, msg: 'Comando vocale elaborato!' });
  };

  // Dose validation with AI
  const validateDose = (selectedProduct: string, doseValue: number) => {
    if (!selectedProduct || !doseValue) {
      setAiValidation('');
      return;
    }
    
    const maxDose = treatmentData.maxDoses[selectedProduct as keyof typeof treatmentData.maxDoses];
    const warningMessage = treatmentData.warningMessages[selectedProduct as keyof typeof treatmentData.warningMessages];
    
    if (doseValue > maxDose) {
      setAiValidation(`
        <div class="validation-alert danger">
          <strong>⚠️ ATTENZIONE!</strong><br>
          La dose ${doseValue} kg/ha supera il limite consigliato di ${maxDose} kg/ha per ${selectedProduct}.<br>
          <small>${warningMessage}</small>
        </div>
      `);
    } else if (doseValue > maxDose * 0.8) {
      setAiValidation(`
        <div class="validation-alert">
          <strong>⚡ Dose Elevata</strong><br>
          La dose è vicina al limite massimo. Considera le condizioni meteorologiche.<br>
          <small>${warningMessage}</small>
        </div>
      `);
    } else {
      setAiValidation(`
        <div class="validation-alert success">
          <strong>✅ Dose Corretta</strong><br>
          La dose rientra nei parametri consigliati per ${selectedProduct}.<br>
          <small>${warningMessage}</small>
        </div>
      `);
    }
  };

  const save = () => {
    if (!description || (!dose && !area)) {
      setToast({ show: true, msg: 'Compila almeno descrizione e dose/area' });
      return;
    }

    // Validate required fields for better UX
    if (!date || !crop || !product || !dose || !area) {
      setToast({ show: true, msg: 'Compila tutti i campi obbligatori prima di salvare.' });
      return;
    }

    const t = {
      id: Date.now().toString(),
      description,
      date: new Date(date).toISOString(),
      crop,
      product: description,
      dose: dose ? parseFloat(dose) : undefined,
      area: area ? parseFloat(area) : undefined,
    };
    
    addTreatment(t);
    
    // Reset form
    setDescription('');
    setDose('');
    setArea('');
    setCrop('');
    setProduct('');
    setAiValidation('');
    setDate(new Date().toISOString().split('T')[0]);
    
    setToast({ show: true, msg: `Trattamento con ${product} su ${crop} salvato correttamente.` });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="header-gradient">
          <IonTitle>🧪 Trattamenti</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="home-container">
          <h2 style={{ color: '#2f703a', marginBottom: '20px' }}>
            ✍️ Nuovo Trattamento
          </h2>
          
          {/* Description with Voice Input */}
          <div className="form-group">
            <label>Descrizione Trattamento</label>
            <div className="voice-input">
              <input 
                type="text" 
                className="form-control" 
                value={description}
                placeholder="Es: rame su vigneto 2 ettari 3kg/ha"
                onChange={(e) => setDescription(e.target.value)}
              />
              <button 
                className={`voice-btn ${isRecording ? 'recording' : ''}`}
                onClick={startVoiceRecognition}
              >
                🎤
              </button>
            </div>
            <small style={{ color: '#666' }}>
              Puoi usare l'input vocale o digitare manualmente
            </small>
          </div>

          {/* AI Validation */}
          {aiValidation && (
            <div dangerouslySetInnerHTML={{ __html: aiValidation }} />
          )}

          {/* Date */}
          <div className="form-group">
            <label>Data Trattamento</label>
            <input 
              type="date" 
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Crop */}
          <div className="form-group">
            <label>Coltura</label>
            <select 
              className="form-control"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
            >
              <option value="">Seleziona coltura</option>
              <option value="vigneto">Vigneto</option>
              <option value="oliveto">Oliveto</option>
              <option value="frutteto">Frutteto</option>
              <option value="seminativo">Seminativo</option>
            </select>
          </div>

          {/* Product */}
          <div className="form-group">
            <label>Prodotto</label>
            <select 
              className="form-control"
              value={product}
              onChange={(e) => {
                setProduct(e.target.value);
                if (dose) {
                  validateDose(e.target.value, parseFloat(dose));
                }
              }}
            >
              <option value="">Seleziona prodotto</option>
              <option value="rame">Solfato di Rame</option>
              <option value="zolfo">Zolfo</option>
              <option value="olio">Olio Minerale</option>
              <option value="insetticida">Insetticida Biologico</option>
            </select>
          </div>

          {/* Dose */}
          <div className="form-group">
            <label>Dose (kg/ha o L/ha)</label>
            <input 
              type="number" 
              className="form-control" 
              step="0.1"
              value={dose}
              placeholder="Es: 3.5"
              onChange={(e) => {
                setDose(e.target.value);
                if (product) {
                  validateDose(product, parseFloat(e.target.value));
                }
              }}
            />
          </div>

          {/* Area */}
          <div className="form-group">
            <label>Superficie (ettari)</label>
            <input 
              type="number" 
              className="form-control" 
              step="0.1"
              value={area}
              placeholder="Es: 2.5"
              onChange={(e) => setArea(e.target.value)}
            />
          </div>

          <button className="btn" onClick={save}>
            💾 Salva Trattamento
          </button>
        </div>

        {/* Recent Treatments List */}
        <h3 style={{ marginTop: '30px', marginLeft: '20px', color: '#2f703a' }}>
          Trattamenti Recenti
        </h3>
        <IonList>
          {treatments.map(t => (
            <IonCard key={t.id} style={{ margin: '10px 20px' }}>
              <IonCardContent>
                <div style={{ width: '100%' }}>
                  <strong>{t.description}</strong>
                  <div style={{ fontSize: '13px', color: 'var(--ion-color-medium)', marginTop: '8px' }}>
                    {t.dose ? `${t.dose} kg/ha` : ''} {t.area ? `• ${t.area} ha` : ''}
                    <div>{new Date(t.date).toLocaleString()}</div>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>

        {treatments.length === 0 && (
          <IonCard style={{ margin: '20px', textAlign: 'center', padding: '40px' }}>
            <IonCardContent>
              <div style={{ fontSize: '64px', color: 'var(--ion-color-medium)' }}>🧪</div>
              <h2>Nessun Trattamento</h2>
              <p style={{ color: 'var(--ion-color-medium)' }}>
                Aggiungi il tuo primo trattamento utilizzando il form sopra
              </p>
            </IonCardContent>
          </IonCard>
        )}

        <IonToast 
          isOpen={toast.show} 
          message={toast.msg}
          duration={2000} 
          onDidDismiss={() => setToast({ show: false, msg: '' })} 
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default TreatmentsPage;