import React, { useState, useMemo } from "react";
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
  IonButton,
  IonIcon,
  IonList,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonNote,
  IonChip,
  IonMenuButton,
  IonButtons,
  IonSegment,
  IonSegmentButton,
  IonDatetime,
  IonModal,
  IonCheckbox,
  IonSelect,
  IonSelectOption,
  IonProgressBar,
  IonToast,
  IonFab,
  IonFabButton,
  IonActionSheet,
} from "@ionic/react";
import {
  downloadOutline,
  documentTextOutline,
  analyticsOutline,
  calendarOutline,
  checkmarkCircleOutline,
  leafOutline,
  medicalOutline,
  cubeOutline,
  certificateOutline,
  globeOutline,
  shieldCheckmarkOutline,
  businessOutline,
  filterOutline,
  shareOutline,
  printOutline,
  cloudUploadOutline,
  timeOutline,
  warningOutline,
} from "ionicons/icons";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'compliance' | 'operational' | 'inventory' | 'financial';
  certifications?: string[];
  color: string;
  estimatedTime: string;
  fields: ReportField[];
}

interface ReportField {
  name: string;
  required: boolean;
  type: 'date_range' | 'crop_selection' | 'product_category' | 'location';
}

interface GeneratedReport {
  id: string;
  templateId: string;
  name: string;
  generatedDate: string;
  period: string;
  status: 'generating' | 'ready' | 'error';
  size?: string;
  downloadUrl?: string;
}

const Reports: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState<string | null>(null);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([
    {
      id: '1',
      templateId: 'quaderno_campo',
      name: 'Quaderno di Campagna - Settembre 2024',
      generatedDate: '2024-09-19',
      period: '01/09/2024 - 30/09/2024',
      status: 'ready',
      size: '2.3 MB',
      downloadUrl: '#'
    },
    {
      id: '2',
      templateId: 'bio_compliance',
      name: 'Certificazione Bio - Q3 2024',
      generatedDate: '2024-09-15',
      period: '01/07/2024 - 30/09/2024',
      status: 'ready',
      size: '1.8 MB',
      downloadUrl: '#'
    },
    {
      id: '3',
      templateId: 'inventory_summary',
      name: 'Inventario Magazzino',
      generatedDate: '2024-09-18',
      period: 'Situazione al 18/09/2024',
      status: 'generating',
    }
  ]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [selectedReportForActions, setSelectedReportForActions] = useState<string | null>(null);

  // Report form data
  const [reportForm, setReportForm] = useState({
    dateFrom: '',
    dateTo: '',
    selectedCrops: [] as string[],
    selectedCategories: [] as string[],
    includePhotos: true,
    includeWeatherData: true,
    format: 'pdf' as 'pdf' | 'excel' | 'csv',
  });

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'quaderno_campo',
      name: 'Quaderno di Campagna',
      description: 'Registro completo di tutti i trattamenti e operazioni colturali',
      icon: documentTextOutline,
      category: 'compliance',
      certifications: ['Bio', 'SQNPI', 'GlobalGAP'],
      color: 'primary',
      estimatedTime: '~2 min',
      fields: [
        { name: 'Periodo', required: true, type: 'date_range' },
        { name: 'Colture', required: false, type: 'crop_selection' }
      ]
    },
    {
      id: 'bio_compliance',
      name: 'Certificazione Biologica',
      description: 'Report specifico per audit e controlli biologici',
      icon: leafOutline,
      category: 'compliance',
      certifications: ['Bio'],
      color: 'success',
      estimatedTime: '~3 min',
      fields: [
        { name: 'Periodo', required: true, type: 'date_range' },
        { name: 'Prodotti Bio', required: true, type: 'product_category' }
      ]
    },
    {
      id: 'globalgap',
      name: 'GlobalGAP Report',
      description: 'Documentazione per certificazione GlobalGAP',
      icon: globeOutline,
      category: 'compliance',
      certifications: ['GlobalGAP'],
      color: 'tertiary',
      estimatedTime: '~4 min',
      fields: [
        { name: 'Periodo', required: true, type: 'date_range' },
        { name: 'Ubicazioni', required: true, type: 'location' }
      ]
    },
    {
      id: 'sqnpi_report',
      name: 'SQNPI Compliance',
      description: 'Sistema di Qualità Nazionale Produzione Integrata',
      icon: shieldCheckmarkOutline,
      category: 'compliance',
      certifications: ['SQNPI'],
      color: 'warning',
      estimatedTime: '~3 min',
      fields: [
        { name: 'Periodo', required: true, type: 'date_range' },
        { name: 'Prodotti PI', required: true, type: 'product_category' }
      ]
    },
    {
      id: 'treatment_summary',
      name: 'Riepilogo Trattamenti',
      description: 'Analisi dettagliata di tutti i trattamenti effettuati',
      icon: medicalOutline,
      category: 'operational',
      color: 'danger',
      estimatedTime: '~1 min',
      fields: [
        { name: 'Periodo', required: true, type: 'date_range' },
        { name: 'Colture', required: false, type: 'crop_selection' }
      ]
    },
    {
      id: 'inventory_summary',
      name: 'Inventario Magazzino',
      description: 'Situazione scorte e movimenti di magazzino',
      icon: cubeOutline,
      category: 'inventory',
      color: 'medium',
      estimatedTime: '~30 sec',
      fields: [
        { name: 'Categorie', required: false, type: 'product_category' }
      ]
    },
    {
      id: 'cost_analysis',
      name: 'Analisi Costi',
      description: 'Report economico con analisi costi per coltura',
      icon: analyticsOutline,
      category: 'financial',
      color: 'secondary',
      estimatedTime: '~2 min',
      fields: [
        { name: 'Periodo', required: true, type: 'date_range' },
        { name: 'Colture', required: false, type: 'crop_selection' }
      ]
    },
  ];

  const categoryLabels = {
    all: 'Tutti',
    compliance: 'Conformità',
    operational: 'Operativi',
    inventory: 'Inventario',
    financial: 'Finanziari'
  };

  const filteredTemplates = useMemo(() => {
    if (activeCategory === 'all') return reportTemplates;
    return reportTemplates.filter(t => t.category === activeCategory);
  }, [activeCategory]);

  const generateReport = async (templateId: string) => {
    setIsGenerating(templateId);
    
    const template = reportTemplates.find(t => t.id === templateId);
    if (!template) return;

    // Simulate API call
    const newReport: GeneratedReport = {
      id: Date.now().toString(),
      templateId,
      name: `${template.name} - ${new Date().toLocaleDateString('it-IT')}`,
      generatedDate: new Date().toISOString().split('T')[0],
      period: reportForm.dateFrom && reportForm.dateTo 
        ? `${new Date(reportForm.dateFrom).toLocaleDateString('it-IT')} - ${new Date(reportForm.dateTo).toLocaleDateString('it-IT')}`
        : 'Periodo completo',
      status: 'generating'
    };

    setGeneratedReports(prev => [newReport, ...prev]);
    
    // Simulate generation time
    setTimeout(() => {
      setGeneratedReports(prev => prev.map(r => 
        r.id === newReport.id 
          ? { ...r, status: 'ready' as const, size: '1.5 MB', downloadUrl: '#' }
          : r
      ));
      setIsGenerating(null);
      setShowReportModal(null);
      setToastMessage(`${template.name} generato con successo!`);
      setShowToast(true);
    }, 3000);
  };

  const downloadReport = (reportId: string) => {
    const report = generatedReports.find(r => r.id === reportId);
    if (report && report.status === 'ready') {
      setToastMessage(`Download di "${report.name}" avviato`);
      setShowToast(true);
      // In a real app, this would trigger the actual download
      console.log('Downloading report:', report);
    }
  };

  const shareReport = (reportId: string) => {
    setToastMessage('Link di condivisione copiato negli appunti');
    setShowToast(true);
  };

  const deleteReport = (reportId: string) => {
    setGeneratedReports(prev => prev.filter(r => r.id !== reportId));
    setToastMessage('Report eliminato');
    setShowToast(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return checkmarkCircleOutline;
      case 'generating': return timeOutline;
      case 'error': return warningOutline;
      default: return documentTextOutline;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'success';
      case 'generating': return 'warning';
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
            <div className="page-title">📊 Report</div>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowActionSheet(true)}>
              <IonIcon icon={filterOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Quick Stats */}
        <IonCard className="stats-card">
          <IonCardHeader>
            <IonCardTitle>Report Disponibili</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow className="ion-text-center">
                <IonCol>
                  <div className="stat-number">{generatedReports.filter(r => r.status === 'ready').length}</div>
                  <div className="stat-label">Pronti</div>
                </IonCol>
                <IonCol>
                  <div className="stat-number">{generatedReports.filter(r => r.status === 'generating').length}</div>
                  <div className="stat-label">Generazione</div>
                </IonCol>
                <IonCol>
                  <div className="stat-number">{reportTemplates.filter(t => t.category === 'compliance').length}</div>
                  <div className="stat-label">Conformità</div>
                </IonCol>
                <IonCol>
                  <div className="stat-number">{reportTemplates.length}</div>
                  <div className="stat-label">Template</div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* Recent Reports */}
        {generatedReports.length > 0 && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Report Recenti</IonCardTitle>
            </IonCardHeader>
            <IonCardContent style={{ padding: '0' }}>
              <IonList>
                {generatedReports.slice(0, 3).map((report) => (
                  <IonItem key={report.id} button={report.status === 'ready'}>
                    <IonIcon
                      icon={getStatusIcon(report.status)}
                      slot="start"
                      color={getStatusColor(report.status)}
                    />
                    <IonLabel>
                      <h3>{report.name}</h3>
                      <p>{report.period}</p>
                      <IonNote>
                        Generato: {new Date(report.generatedDate).toLocaleDateString('it-IT')}
                        {report.size && ` • ${report.size}`}
                      </IonNote>
                    </IonLabel>
                    <div slot="end">
                      {report.status === 'generating' && (
                        <IonProgressBar type="indeterminate" style={{ width: '60px' }} />
                      )}
                      {report.status === 'ready' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <IonButton
                            fill="clear"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadReport(report.id);
                            }}
                          >
                            <IonIcon icon={downloadOutline} />
                          </IonButton>
                          <IonButton
                            fill="clear"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReportForActions(report.id);
                              setShowActionSheet(true);
                            }}
                          >
                            <IonIcon icon={shareOutline} />
                          </IonButton>
                        </div>
                      )}
                    </div>
                  </IonItem>
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>
        )}

        {/* Category Filter */}
        <IonSegment
          value={activeCategory}
          onIonChange={(e) => setActiveCategory(e.detail.value!)}
        >
          {Object.entries(categoryLabels).map(([key, label]) => (
            <IonSegmentButton key={key} value={key}>
              <IonLabel style={{ fontSize: '13px' }}>{label}</IonLabel>
            </IonSegmentButton>
          ))}
        </IonSegment>

        {/* Report Templates */}
        <IonGrid>
          <IonRow>
            {filteredTemplates.map((template) => (
              <IonCol size="12" sizeMd="6" sizeLg="4" key={template.id}>
                <IonCard 
                  button
                  onClick={() => setShowReportModal(template.id)}
                  style={{ 
                    height: '100%',
                    '--color': `var(--ion-color-${template.color}-contrast)`,
                  }}
                >
                  <IonCardHeader style={{ paddingBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <IonIcon 
                        icon={template.icon} 
                        color={template.color}
                        style={{ fontSize: '24px', marginRight: '12px' }}
                      />
                      <IonCardTitle style={{ fontSize: '16px', margin: 0 }}>
                        {template.name}
                      </IonCardTitle>
                    </div>
                    
                    {template.certifications && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                        {template.certifications.map((cert) => (
                          <IonChip key={cert} color={template.color} style={{ fontSize: '11px', height: '20px' }}>
                            <IonLabel>{cert}</IonLabel>
                          </IonChip>
                        ))}
                      </div>
                    )}
                  </IonCardHeader>
                  
                  <IonCardContent style={{ paddingTop: '0' }}>
                    <p style={{ 
                      fontSize: '13px', 
                      color: 'var(--ion-color-medium)', 
                      lineHeight: '1.4',
                      marginBottom: '12px'
                    }}>
                      {template.description}
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <IonNote style={{ fontSize: '12px' }}>
                        <IonIcon icon={timeOutline} style={{ marginRight: '4px' }} />
                        {template.estimatedTime}
                      </IonNote>
                      
                      <IonButton
                        size="small"
                        color={template.color}
                        disabled={isGenerating === template.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          generateReport(template.id);
                        }}
                      >
                        {isGenerating === template.id ? 'Generazione...' : 'Genera'}
                      </IonButton>
                    </div>
                    
                    {isGenerating === template.id && (
                      <IonProgressBar 
                        type="indeterminate" 
                        color={template.color}
                        style={{ marginTop: '8px' }}
                      />
                    )}
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        {/* Report Generation Modal */}
        <IonModal 
          isOpen={!!showReportModal} 
          onDidDismiss={() => setShowReportModal(null)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>
                Genera Report
              </IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowReportModal(null)}>
                  Chiudi
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            {showReportModal && (() => {
              const template = reportTemplates.find(t => t.id === showReportModal);
              if (!template) return null;

              return (
                <>
                  <IonCard>
                    <IonCardContent>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                        <IonIcon 
                          icon={template.icon} 
                          color={template.color}
                          style={{ fontSize: '32px', marginRight: '16px' }}
                        />
                        <div>
                          <h2 style={{ margin: 0 }}>{template.name}</h2>
                          <p style={{ margin: '4px 0 0 0', color: 'var(--ion-color-medium)' }}>
                            {template.description}
                          </p>
                        </div>
                      </div>
                      
                      {template.certifications && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {template.certifications.map((cert) => (
                            <IonChip key={cert} color={template.color}>
                              <IonIcon icon={certificateOutline} />
                              <IonLabel>{cert}</IonLabel>
                            </IonChip>
                          ))}
                        </div>
                      )}
                    </IonCardContent>
                  </IonCard>

                  {/* Form Fields */}
                  {template.fields.map((field) => (
                    <div key={field.name}>
                      {field.type === 'date_range' && (
                        <>
                          <IonItem>
                            <IonLabel position="stacked">
                              Data Inizio {field.required && '*'}
                            </IonLabel>
                            <IonDatetime
                              value={reportForm.dateFrom}
                              onIonChange={(e) => setReportForm(prev => ({ 
                                ...prev, 
                                dateFrom: e.detail.value as string 
                              }))}
                              presentation="date"
                              max={new Date().toISOString()}
                            />
                          </IonItem>

                          <IonItem>
                            <IonLabel position="stacked">
                              Data Fine {field.required && '*'}
                            </IonLabel>
                            <IonDatetime
                              value={reportForm.dateTo}
                              onIonChange={(e) => setReportForm(prev => ({ 
                                ...prev, 
                                dateTo: e.detail.value as string 
                              }))}
                              presentation="date"
                              max={new Date().toISOString()}
                              min={reportForm.dateFrom}
                            />
                          </IonItem>
                        </>
                      )}

                      {field.type === 'crop_selection' && (
                        <IonItem>
                          <IonLabel position="stacked">
                            Colture {field.required && '*'}
                          </IonLabel>
                          <IonSelect
                            multiple
                            value={reportForm.selectedCrops}
                            onSelectionChange={(e) => setReportForm(prev => ({ 
                              ...prev, 
                              selectedCrops: e.detail.value 
                            }))}
                            placeholder="Seleziona colture"
                          >
                            <IonSelectOption value="vigneto_sangiovese">Vigneto Sangiovese</IonSelectOption>
                            <IonSelectOption value="vigneto_chianti">Vigneto Chianti</IonSelectOption>
                            <IonSelectOption value="oliveto">Oliveto</IonSelectOption>
                            <IonSelectOption value="frutteto">Frutteto</IonSelectOption>
                            <IonSelectOption value="orto">Orto</IonSelectOption>
                          </IonSelect>
                        </IonItem>
                      )}

                      {field.type === 'product_category' && (
                        <IonItem>
                          <IonLabel position="stacked">
                            Categorie Prodotti {field.required && '*'}
                          </IonLabel>
                          <IonSelect
                            multiple
                            value={reportForm.selectedCategories}
                            onSelectionChange={(e) => setReportForm(prev => ({ 
                              ...prev, 
                              selectedCategories: e.detail.value 
                            }))}
                            placeholder="Seleziona categorie"
                          >
                            <IonSelectOption value="pesticide">Fitofarmaci</IonSelectOption>
                            <IonSelectOption value="fertilizer">Fertilizzanti</IonSelectOption>
                            <IonSelectOption value="seed">Semi</IonSelectOption>
                            <IonSelectOption value="equipment">Attrezzature</IonSelectOption>
                          </IonSelect>
                        </IonItem>
                      )}
                    </div>
                  ))}

                  {/* Additional Options */}
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle style={{ fontSize: '16px' }}>Opzioni Aggiuntive</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonItem>
                        <IonCheckbox
                          checked={reportForm.includePhotos}
                          onIonChange={(e) => setReportForm(prev => ({ 
                            ...prev, 
                            includePhotos: e.detail.checked 
                          }))}
                        />
                        <IonLabel style={{ marginLeft: '12px' }}>
                          <h3>Includi Foto</h3>
                          <p>Aggiungi immagini dei trattamenti quando disponibili</p>
                        </IonLabel>
                      </IonItem>

                      <IonItem>
                        <IonCheckbox
                          checked={reportForm.includeWeatherData}
                          onIonChange={(e) => setReportForm(prev => ({ 
                            ...prev, 
                            includeWeatherData: e.detail.checked 
                          }))}
                        />
                        <IonLabel style={{ marginLeft: '12px' }}>
                          <h3>Dati Meteorologici</h3>
                          <p>Includi condizioni meteo per ogni trattamento</p>
                        </IonLabel>
                      </IonItem>

                      <IonItem>
                        <IonLabel position="stacked">Formato Output</IonLabel>
                        <IonSelect
                          value={reportForm.format}
                          onSelectionChange={(e) => setReportForm(prev => ({ 
                            ...prev, 
                            format: e.detail.value 
                          }))}
                        >
                          <IonSelectOption value="pdf">PDF</IonSelectOption>
                          <IonSelectOption value="excel">Excel</IonSelectOption>
                          <IonSelectOption value="csv">CSV</IonSelectOption>
                        </IonSelect>
                      </IonItem>
                    </IonCardContent>
                  </IonCard>

                  <IonButton 
                    expand="block" 
                    color={template.color}
                    onClick={() => generateReport(template.id)}
                    disabled={isGenerating === template.id}
                    style={{ marginTop: '20px' }}
                  >
                    {isGenerating === template.id ? (
                      <>
                        <IonProgressBar type="indeterminate" style={{ marginRight: '8px', width: '20px' }} />
                        Generazione in corso...
                      </>
                    ) : (
                      <>
                        <IonIcon icon={downloadOutline} style={{ marginRight: '8px' }} />
                        Genera Report ({template.estimatedTime})
                      </>
                    )}
                  </IonButton>
                </>
              );
            })()}
          </IonContent>
        </IonModal>

        {/* Quick Generate FAB */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton 
            color="secondary"
            onClick={() => generateReport('quaderno_campo')}
          >
            <IonIcon icon={downloadOutline} />
          </IonFabButton>
        </IonFab>

        {/* Action Sheet */}
        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => {
            setShowActionSheet(false);
            setSelectedReportForActions(null);
          }}
          header={selectedReportForActions ? "Azioni Report" : "Opzioni"}
          buttons={selectedReportForActions ? [
            {
              text: 'Scarica PDF',
              icon: downloadOutline,
              handler: () => {
                if (selectedReportForActions) {
                  downloadReport(selectedReportForActions);
                }
              }
            },
            {
              text: 'Condividi Link',
              icon: shareOutline,
              handler: () => {
                if (selectedReportForActions) {
                  shareReport(selectedReportForActions);
                }
              }
            },
            {
              text: 'Stampa',
              icon: printOutline,
              handler: () => {
                setToastMessage('Invio alla stampante...');
                setShowToast(true);
              }
            },
            {
              text: 'Carica su Cloud',
              icon: cloudUploadOutline,
              handler: () => {
                setToastMessage('Upload su cloud in corso...');
                setShowToast(true);
              }
            },
            {
              text: 'Elimina',
              role: 'destructive',
              icon: warningOutline,
              handler: () => {
                if (selectedReportForActions) {
                  deleteReport(selectedReportForActions);
                }
              }
            },
            {
              text: 'Annulla',
              role: 'cancel'
            }
          ] : [
            {
              text: 'Genera Quaderno Veloce',
              icon: documentTextOutline,
              handler: () => {
                generateReport('quaderno_campo');
              }
            },
            {
              text: 'Esporta Inventario',
              icon: cubeOutline,
              handler: () => {
                generateReport('inventory_summary');
              }
            },
            {
              text: 'Report Bio',
              icon: leafOutline,
              handler: () => {
                generateReport('bio_compliance');
              }
            },
            {
              text: 'Tutti i Report Pronti',
              icon: downloadOutline,
              handler: () => {
                setToastMessage('Download multiplo avviato');
                setShowToast(true);
              }
            },
            {
              text: 'Annulla',
              role: 'cancel'
            }
          ]}
        />

        {/* All Generated Reports */}
        {generatedReports.length > 3 && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Tutti i Report</IonCardTitle>
            </IonCardHeader>
            <IonCardContent style={{ padding: '0' }}>
              <IonList>
                {generatedReports.slice(3).map((report) => (
                  <IonItem key={report.id}>
                    <IonIcon
                      icon={getStatusIcon(report.status)}
                      slot="start"
                      color={getStatusColor(report.status)}
                    />
                    <IonLabel>
                      <h3>{report.name}</h3>
                      <p>{report.period}</p>
                      <IonNote>
                        {new Date(report.generatedDate).toLocaleDateString('it-IT')}
                        {report.size && ` • ${report.size}`}
                      </IonNote>
                    </IonLabel>
                    <IonBadge color={getStatusColor(report.status)} slot="end">
                      {report.status === 'ready' ? 'Pronto' :
                       report.status === 'generating' ? 'Generazione' : 'Errore'}
                    </IonBadge>
                  </IonItem>
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>
        )}

        {/* Empty State */}
        {generatedReports.length === 0 && (
          <IonCard>
            <IonCardContent style={{ textAlign: 'center', padding: '40px' }}>
              <IonIcon 
                icon={documentTextOutline} 
                style={{ fontSize: '64px', color: 'var(--ion-color-medium)', marginBottom: '16px' }}
              />
              <h2>Nessun Report Generato</h2>
              <p style={{ color: 'var(--ion-color-medium)', marginBottom: '24px' }}>
                Inizia generando il tuo primo report utilizzando i template disponibili
              </p>
              <IonButton 
                color="primary"
                onClick={() => generateReport('quaderno_campo')}
              >
                <IonIcon icon={downloadOutline} style={{ marginRight: '8px' }} />
                Genera Quaderno di Campagna
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        {/* Toast for feedback */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="bottom"
          color={toastMessage.includes('successo') ? 'success' : 'primary'}
        />
      </IonContent>
    </IonPage>
  );
};

export default Reports;