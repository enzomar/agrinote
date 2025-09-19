import React from 'react';
import {
  IonIcon,
  IonLabel,
  IonCard,
  IonCardContent
} from '@ionic/react';

interface DashboardCardProps {
  icon: string;
  title: string;
  onClick: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, onClick }) => {
  return (
    <div className="dashboard-card" onClick={onClick}>
      <span className="icon">{icon}</span>
      <h3>{title}</h3>
    </div>
  );
};

interface WeatherWidgetProps {
  temperature: number;
  condition: string;
  wind: number;
  humidity: number;
  message?: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  temperature,
  condition,
  wind,
  humidity,
  message
}) => {
  return (
    <div className="weather-widget">
      <h4>🌤️ Meteo Oggi</h4>
      <p>{condition}, {temperature}°C • Vento: {wind} km/h • Umidità: {humidity}%</p>
      {message && <p style={{ fontSize: '14px', marginTop: '5px' }}>{message}</p>}
    </div>
  );
};

interface NotificationItemProps {
  icon: string;
  message: string;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ icon, message }) => {
  return (
    <div className="notification-item">
      {icon} {message}
    </div>
  );
};

interface NotificationsProps {
  notifications: Array<{
    icon: string;
    message: string;
  }>;
}

export const Notifications: React.FC<NotificationsProps> = ({ notifications }) => {
  return (
    <div className="notifications">
      <h4>🔔 Notifiche Importanti</h4>
      {notifications.map((notification, index) => (
        <NotificationItem
          key={index}
          icon={notification.icon}
          message={notification.message}
        />
      ))}
    </div>
  );
};

interface ValidationAlertProps {
  type: 'success' | 'warning' | 'danger';
  title: string;
  message: string;
  details?: string;
}

export const ValidationAlert: React.FC<ValidationAlertProps> = ({
  type,
  title,
  message,
  details
}) => {
  return (
    <div className={`validation-alert ${type}`}>
      <strong>{title}</strong><br />
      {message}<br />
      {details && <small>{details}</small>}
    </div>
  );
};

interface VoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  onVoiceStart: () => void;
  onVoiceStop: () => void;
  isRecording: boolean;
  placeholder?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  value,
  onChange,
  onVoiceStart,
  onVoiceStop,
  isRecording,
  placeholder
}) => {
  return (
    <div className="voice-input">
      <input
        type="text"
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <button
        className={`voice-btn ${isRecording ? 'recording' : ''}`}
        onClick={isRecording ? onVoiceStop : onVoiceStart}
      >
        {isRecording ? '🔴' : '🎤'}
      </button>
    </div>
  );
};
